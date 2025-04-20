# filename: langchain_embedding_generator.py

import os
import json
import logging
import time
from datetime import datetime, timezone
from typing import Dict, Any, List

from dotenv import load_dotenv
from supabase import create_client, Client
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Pinecone as LangChainPinecone
import pinecone # Re-add for pinecone.init()

# --- Configuration ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# --- Load Environment Variables ---
load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
# Use the SERVICE ROLE KEY for admin operations like accessing auth schema if needed,
# and potentially for bypassing RLS if not configured for this task.
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_KEY') # Assuming SUPABASE_KEY holds the service role
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
PINECONE_ENVIRONMENT = os.getenv('PINECONE_ENV') # Match .env key
PINECONE_INDEX = os.getenv('PINECONE_INDEX')

# --- Validate Environment Variables ---
required_vars = {
    "OPENAI_API_KEY": OPENAI_API_KEY,
    "SUPABASE_URL": SUPABASE_URL,
    "SUPABASE_SERVICE_ROLE_KEY": SUPABASE_SERVICE_ROLE_KEY,
    "PINECONE_API_KEY": PINECONE_API_KEY,
    "PINECONE_ENVIRONMENT": PINECONE_ENVIRONMENT,
    "PINECONE_INDEX": PINECONE_INDEX,
}

missing_vars = [key for key, value in required_vars.items() if value is None]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}. Please check your .env file.")

logger.info("Environment variables loaded successfully.")

# --- Initialize Clients ---
try:
    # Supabase
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    logger.info("Supabase client initialized.")

    # OpenAI Embeddings (LangChain)
    openai_embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY, model="text-embedding-3-small")
    logger.info("LangChain OpenAIEmbeddings initialized.")

    # Pinecone (Initialize client first - using v2.2.2 syntax)
    logger.info(f"Initializing Pinecone client with environment: {PINECONE_ENVIRONMENT}")
    pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)

    # Use LangChain's Pinecone vector store integration
    logger.info(f"Attempting to connect to existing Pinecone index: {PINECONE_INDEX}")
    pinecone_vectorstore = LangChainPinecone.from_existing_index(
        index_name=PINECONE_INDEX,
        embedding=openai_embeddings
        # namespace= Optional namespace if you use them
    )
    logger.info(f"LangChain Pinecone vector store connected to index '{PINECONE_INDEX}'.")

except Exception as e:
    logger.error(f"Failed to initialize clients: {e}")
    # Log specific details if available
    if hasattr(e, 'status'): logger.error(f"Status Code: {e.status}")
    if hasattr(e, 'reason'): logger.error(f"Reason: {e.reason}")
    if hasattr(e, 'body'): logger.error(f"Body: {e.body}")
    raise

# --- Helper Functions ---
def format_responses_to_text(responses: Dict[str, Any]) -> str:
    """Flatten JSON responses into a plain text string using key-value formatting."""
    if not isinstance(responses, dict):
        logger.warning(f"Input responses is not a dict: {type(responses)}. Returning empty string.")
        return ""
    formatted_items = []
    for question, answer in responses.items():
        # Basic formatting, adjust as needed for clarity
        formatted_items.append(f"Question: {question}\\nAnswer: {answer}")
    return "\\n\\n".join(formatted_items)

def get_pending_users_data(supabase_client: Client) -> List[Dict[str, Any]]:
    """Fetch users and their survey responses that need embedding."""
    try:
        # Using the RPC function created previously
        # Ensure this RPC function returns user_id, responses (jsonb), and university (text)
        logger.info("Fetching pending users via RPC 'get_users_without_embeddings'...")
        response = supabase_client.rpc('get_users_without_embeddings').execute()
        logger.info(f"Supabase RPC response status: {response.status_code if hasattr(response, 'status_code') else 'N/A'}")

        if response.data:
            logger.info(f"Found {len(response.data)} users needing embeddings.")
            # Ensure 'university' key exists, provide default if not present in RPC result
            for user in response.data:
                if 'university' not in user:
                    user['university'] = 'Unknown' # Or None, depending on desired metadata
            return response.data
        else:
            logger.info("No users found needing embeddings.")
            return []
    except Exception as e:
        logger.error(f"Error fetching pending users from Supabase: {e}")
        # Look for specific Supabase errors if needed
        if hasattr(e, 'message'):
             logger.error(f"Supabase error message: {e.message}")
        return []

def save_to_supabase(supabase_client: Client, user_id: str, embedding: List[float]) -> bool:
    """Upsert embedding to Supabase user_embeddings table."""
    try:
        # Upsert ensures that if the user_id already exists, it updates the row.
        # If it doesn't exist, it inserts a new row.
        logger.info(f"Attempting to upsert embedding to Supabase for user {user_id}")
        response = supabase_client.table('user_embeddings').upsert({
            'user_id': user_id,
            'embedding': embedding,
            'updated_at': datetime.now(timezone.utc).isoformat()
        }).execute()
        logger.info(f"Supabase upsert response status: {response.status_code if hasattr(response, 'status_code') else 'N/A'} for user {user_id}")
        # Basic check: If the API call succeeded (e.g., status 2xx), assume it worked.
        # Supabase client might not raise exceptions for logical errors like RLS violations on upsert without select.
        if hasattr(response, 'status_code') and 200 <= response.status_code < 300:
             logger.info(f"Successfully upserted embedding to Supabase for user {user_id}")
             return True
        else:
            logger.warning(f"Supabase upsert for user {user_id} completed but status was not 2xx. Response: {getattr(response, 'data', 'N/A')}")
            return False # Treat non-2xx as potential failure

    except Exception as e:
        logger.error(f"Error saving embedding to Supabase for user {user_id}: {e}")
        if hasattr(e, 'message'):
             logger.error(f"Supabase error message: {e.message}")
        return False

def save_to_pinecone(vector_store: LangChainPinecone, user_id: str, text: str, metadata: Dict[str, Any]) -> bool:
    """Upsert embedding to Pinecone using LangChain vector store."""
    try:
        logger.info(f"Attempting to upsert embedding to Pinecone for user {user_id}")
        # LangChain's add_texts handles embedding generation internally if needed,
        # but we generated it already. We can use add_embeddings or ensure add_texts uses the right one.
        # Using add_texts is often simpler as it takes the original text.
        # It will generate the embedding using the 'openai_embeddings' instance associated with the vector_store.
        vector_store.add_texts(
            texts=[text], # The formatted text used for embedding
            ids=[user_id], # Document ID in Pinecone
            metadatas=[metadata] # Metadata associated with the vector
        )
        # Note: add_texts implicitly upserts based on the provided ID.
        logger.info(f"Successfully upserted embedding to Pinecone for user {user_id} with metadata: {metadata}")
        return True
    except Exception as e:
        logger.error(f"Error saving embedding to Pinecone for user {user_id}: {e}")
        return False

# --- Main Processing Logic ---
def process_embeddings():
    """Main function to fetch data, generate embeddings, and save them."""
    logger.info("Starting embedding generation process...")
    pending_users = get_pending_users_data(supabase)

    if not pending_users:
        logger.info("No pending users to process. Exiting.")
        return

    processed_count = 0
    error_count = 0

    for user_data in pending_users:
        user_id = user_data.get('user_id', 'N/A') # Get user_id early for logging
        try:
            responses_json = user_data.get('responses')
            # 'university' should now be present due to the check in get_pending_users_data
            university = user_data.get('university', 'Unknown') # Default just in case

            if user_id == 'N/A' or not responses_json:
                logger.warning(f"Skipping user data due to missing user_id or responses: {user_data}")
                error_count += 1
                continue

            logger.info(f"Processing user: {user_id}")

            # 1. Format responses to text
            formatted_text = format_responses_to_text(responses_json)
            if not formatted_text:
                logger.warning(f"Skipping user {user_id} due to empty formatted text.")
                error_count +=1
                continue

            # 2. Generate embedding (using the same instance used by Pinecone vector store)
            # Generating explicitly to save separately to Supabase:
            logger.info(f"Generating embedding for user {user_id}...")
            embedding = openai_embeddings.embed_query(formatted_text)
            logger.info(f"Generated embedding for user {user_id} (length: {len(embedding)})")

            # 3. Save to Supabase
            supabase_success = save_to_supabase(supabase, user_id, embedding)

            # 4. Save to Pinecone
            # Pass the original formatted text to add_texts
            pinecone_metadata = {'university': university} # Adjust key if needed
            pinecone_success = save_to_pinecone(pinecone_vectorstore, user_id, formatted_text, pinecone_metadata)

            if supabase_success and pinecone_success:
                logger.info(f"Successfully processed and saved embeddings for user: {user_id}")
                processed_count += 1
            else:
                logger.warning(f"Partial or failed processing for user {user_id}: Supabase={supabase_success}, Pinecone={pinecone_success}")
                error_count += 1

            # Optional: Rate limiting to avoid overwhelming APIs
            time.sleep(1) # Pause for 1 second

        except Exception as e:
            logger.error(f"Unhandled error processing user data for user {user_id}: {e}")
            error_count += 1
            continue # Move to the next user

    logger.info(f"Embedding generation process completed. Processed: {processed_count}, Errors: {error_count}")

# --- Script Execution ---
if __name__ == "__main__":
    process_embeddings()