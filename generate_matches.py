import os
import json
import logging
from typing import List, Dict, Optional
from datetime import datetime, timezone
from dotenv import load_dotenv
from pinecone import Pinecone
from supabase import create_client, Client

logging.basicConfig(level=logging.INFO,
                   format='%(asctime)s - %(levelname)s - %(message)s')

class MatchGenerator:
    def __init__(self):
        load_dotenv()
        self.pinecone_api_key = os.getenv('PINECONE_API_KEY')
        self.pinecone_index = os.getenv('PINECONE_INDEX')
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_KEY')

        # Initialize clients
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self.pinecone_client = Pinecone(api_key=self.pinecone_api_key)
        self.index = self.pinecone_client.Index(name=self.pinecone_index)

    def get_users_without_matches(self) -> List[Dict]:
        """Get users who need matches generated."""
        try:
            # Get users with embeddings but no matches
            response = self.supabase.table('user_embeddings').select(
                "*"
            ).execute()
            
            users_with_embeddings = response.data
            logging.info(f"Found {len(users_with_embeddings)} users with embeddings")
            return users_with_embeddings
            
        except Exception as e:
            logging.error(f"Error getting users without matches: {str(e)}")
            return []

    def get_user_embedding(self, user_id: str) -> Optional[List[float]]:
        """Get a user's embedding from Supabase."""
        try:
            result = self.supabase.table('user_embeddings') \
                .select('embedding') \
                .eq('user_id', user_id) \
                .execute()
            
            if result.data and len(result.data) > 0:
                return result.data[0]['embedding']
            return None
            
        except Exception as e:
            logging.error(f"Error getting embedding for user {user_id}: {str(e)}")
            return None

    def clear_existing_matches(self, user_ids: List[str]) -> bool:
        """Clear existing matches for the given users."""
        try:
            # Delete matches where user is either user1 or user2
            self.supabase.table('matches') \
                .delete() \
                .in_('user_id', user_ids) \
                .execute()
            
            logging.info(f"Cleared existing matches for {len(user_ids)} users")
            
            return True
            
        except Exception as e:
            logging.error(f"Error clearing existing matches: {str(e)}")
            return False

    def save_match(self, user_id: str, match_id: str, match_score: float) -> bool:
        """Save a match to the database."""
        try:
            # Insert the match
            self.supabase.table('matches').insert({
                'user_id': user_id,
                'match_id': match_id,
                'match_score': match_score,
                'created_at': datetime.now(timezone.utc).isoformat()
            }).execute()
            
            logging.info(f"Saved match between users {user_id} and {match_id}")
            
            return True
            
        except Exception as e:
            logging.error(f"Error saving match: {str(e)}")
            return False

    def generate_matches(self):
        """Generate matches for users."""
        try:
            users = self.get_users_without_matches()
            
            if not users:
                logging.info("No users found to generate matches for")
                return
            
            user_ids = [user['user_id'] for user in users]
            self.clear_existing_matches(user_ids)
            
            for user in users:
                try:
                    user_id = user['user_id']
                    embedding = self.get_user_embedding(user_id)
                    
                    if not embedding:
                        logging.warning(f"No embedding found for user {user_id}")
                        continue
                    
                    # Query Pinecone for similar vectors
                    query_response = self.index.query(
                        vector=embedding,
                        top_k=5,
                        include_metadata=True
                    )
                    
                    # Process and save matches
                    for match in query_response.matches:
                        if match.id != str(user_id):  # Don't match with self
                            self.save_match(
                                user_id=user_id,
                                match_id=match.id,
                                match_score=float(match.score)
                            )
                    
                    logging.info(f"Generated matches for user {user_id}")
                    
                except Exception as e:
                    logging.error(f"Error generating matches for user {user_id}: {str(e)}")
                    continue
                    
            logging.info("Match generation completed successfully")
            
        except Exception as e:
            logging.error(f"Error in generate_matches: {str(e)}")
            raise

def main():
    try:
        generator = MatchGenerator()
        generator.generate_matches()
    except Exception as e:
        logging.error(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main() 