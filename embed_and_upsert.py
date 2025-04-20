import os
import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional

from pinecone import Pinecone
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from supabase import create_client, Client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class EmbeddingProcessor:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        self.openai_api_key = os.getenv('VITE_OPENAI_API_KEY')
        self.supabase_url = os.getenv('VITE_SUPABASE_URL')
        self.supabase_key = os.getenv('VITE_SUPABASE_SERVICE_ROLE_KEY')
        self.pinecone_api_key = os.getenv('PINECONE_API_KEY')
        self.pinecone_env = os.getenv('PINECONE_ENVIRONMENT')
        self.pinecone_index_name = os.getenv('PINECONE_INDEX')

        # Validate environment variables
        self._validate_env_vars()

        # Initialize clients
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=self.openai_api_key,
            model="text-embedding-3-small"  # 1024-dimensional embeddings
        )
        
        # Initialize Pinecone
        self.pc = Pinecone(api_key=self.pinecone_api_key)
        self.pinecone_index = self.pc.Index(self.pinecone_index_name)

    def _validate_env_vars(self):
        """Validate that all required environment variables are set."""
        required_vars = [
            'VITE_OPENAI_API_KEY',
            'VITE_SUPABASE_URL',
            'VITE_SUPABASE_SERVICE_ROLE_KEY',
            'PINECONE_API_KEY',
            'PINECONE_ENVIRONMENT',
            'PINECONE_INDEX'
        ]
        missing_vars = [var for var in required_vars if not os.getenv(var)]
        if missing_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

    def flatten_responses(self, responses: Dict) -> str:
        """Convert responses JSON into a flat string format."""
        flattened = []
        for key, value in responses.items():
            flattened.append(f"{key}: {value}")
        return "\n".join(flattened)

    def get_users_without_embeddings(self) -> List[Dict]:
        """Get users that don't have embeddings using the RPC function."""
        try:
            result = self.supabase.rpc(
                'get_users_without_embeddings'
            ).execute()
            return result.data
        except Exception as e:
            logger.error(f"Error fetching users without embeddings: {str(e)}")
            raise

    def save_to_supabase(self, user_id: str, embedding: List[float]) -> None:
        """Save embedding to Supabase."""
        try:
            self.supabase.table('user_embeddings').upsert({
                'user_id': user_id,
                'embedding': embedding,
                'updated_at': datetime.now(timezone.utc).isoformat()
            }).execute()
            logger.info(f"Saved embedding to Supabase for user {user_id}")
        except Exception as e:
            logger.error(f"Error saving to Supabase for user {user_id}: {str(e)}")
            raise

    def save_to_pinecone(self, user_id: str, embedding: List[float], university_id: Optional[str]) -> None:
        """Save embedding to Pinecone."""
        try:
            self.pinecone_index.upsert(
                vectors=[{
                    'id': user_id,
                    'values': embedding,
                    'metadata': {'university_id': university_id} if university_id else {}
                }]
            )
            logger.info(f"Saved embedding to Pinecone for user {user_id}")
        except Exception as e:
            logger.error(f"Error saving to Pinecone for user {user_id}: {str(e)}")
            raise

    def process_users(self) -> None:
        """Main function to process all users without embeddings."""
        try:
            # Get users that need processing
            users = self.get_users_without_embeddings()
            logger.info(f"Found {len(users)} users to process")

            for user in users:
                try:
                    # Flatten responses into string
                    flattened_text = self.flatten_responses(user['responses'])
                    
                    # Generate embedding
                    embedding = self.embeddings.embed_query(flattened_text)
                    
                    # Save to both databases
                    self.save_to_supabase(user['user_id'], embedding)
                    self.save_to_pinecone(
                        user['user_id'], 
                        embedding,
                        user.get('university_id')
                    )
                    
                except Exception as e:
                    logger.error(f"Error processing user {user['user_id']}: {str(e)}")
                    continue

        except Exception as e:
            logger.error(f"Error in process_users: {str(e)}")
            raise

def main():
    try:
        processor = EmbeddingProcessor()
        processor.process_users()
        logger.info("Embedding generation completed successfully")
    except Exception as e:
        logger.error(f"Error in main: {str(e)}")
        raise

if __name__ == "__main__":
    main() 