import os
import logging
from datetime import datetime, timezone
from typing import Dict, Any

import openai
from dotenv import load_dotenv
from supabase import create_client, Client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv('VITE_OPENAI_API_KEY')
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('VITE_SUPABASE_SERVICE_ROLE_KEY')

if not all([OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY]):
    raise ValueError("Missing required environment variables. Please check your .env file.")

# Initialize clients
openai.api_key = OPENAI_API_KEY
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def format_responses_to_text(responses: Dict[str, Any]) -> str:
    """Format JSON responses into a plain text string."""
    formatted_text = []
    for question, answer in responses.items():
        formatted_text.append(f"question: {question}\nanswer: {answer}")
    return "\n\n".join(formatted_text)

def generate_embedding(text: str) -> list[float]:
    """Generate embedding using OpenAI's API."""
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text,
        encoding_format="float"
    )
    return response.data[0].embedding

def process_users():
    """Process users who don't have embeddings."""
    try:
        # Fetch users without embeddings
        response = supabase.rpc('get_users_without_embeddings').execute()
        users = response.data

        if not users:
            logger.info("No users found without embeddings.")
            return

        logger.info(f"Found {len(users)} users without embeddings.")

        for user in users:
            try:
                user_id = user['user_id']
                responses = user['responses']
                
                logger.info(f"Processing user: {user_id}")
                
                # Format responses to text
                text = format_responses_to_text(responses)
                
                # Generate embedding
                embedding = generate_embedding(text)
                
                # Store embedding in database
                supabase.table('user_embeddings').upsert({
                    'user_id': user_id,
                    'embedding': embedding,
                    'updated_at': datetime.now(timezone.utc).isoformat()
                }).execute()
                
                logger.info(f"Successfully processed user: {user_id}")
                
            except Exception as e:
                logger.error(f"Error processing user {user_id}: {str(e)}")
                continue

    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")

if __name__ == "__main__":
    logger.info("Starting embedding generation process...")
    process_users()
    logger.info("Embedding generation process completed.") 