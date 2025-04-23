import os
from typing import List, Dict
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI
from langchain.prompts import PromptTemplate

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("VITE_SUPABASE_URL"),
    os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY")
)

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("VITE_OPENAI_API_KEY"))

def format_survey_responses(responses: dict) -> str:
    """
    Format survey responses into a natural language string using LangChain.
    """
    template = """User Profile Summary:
    - Age: {age}
    - Gender: {gender}
    - Location: {location}
    - Interests: {interests}
    - Preferred Room Types: {preferred_room_types}
    - Budget Range: {budget_range}
    - Additional Preferences: {additional_preferences}
    """
    
    prompt = PromptTemplate(
        input_variables=["age", "gender", "location", "interests", 
                        "preferred_room_types", "budget_range", "additional_preferences"],
        template=template
    )
    
    # Fill in any missing values with "Not specified"
    for key in prompt.input_variables:
        if key not in responses:
            responses[key] = "Not specified"
    
    return prompt.format(**responses)

def get_embedding(text: str) -> List[float]:
    """
    Generate embedding using OpenAI's text-embedding-ada-002 model.
    """
    response = openai_client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding

def update_user_profile_status(user_id: str) -> None:
    """
    Update the profile completion status.
    """
    try:
        supabase.table("profiles") \
            .update({"profile_complete": True}) \
            .eq("id", user_id) \
            .execute()
        print(f"Updated profile completion status for user {user_id}")
    except Exception as e:
        print(f"Error updating profile status for user {user_id}: {str(e)}")

def generate_embeddings() -> List[Dict]:
    """
    Main function to generate embeddings for users who completed the survey.
    """
    try:
        # Get survey responses that don't have an embedding status yet
        query = supabase.table("survey_responses") \
            .select("user_id, responses") \
            .is_("embedding_status", "null") \
            .execute()
        
        if not query.data:
            print("No new surveys found to process")
            return []

        # Get existing embeddings to avoid duplicates
        embeddings_query = supabase.table("user_embeddings") \
            .select("user_id") \
            .execute()
        existing_user_ids = [emb["user_id"] for emb in embeddings_query.data]
        
        # Get valid users from the profiles table
        profiles_query = supabase.table("profiles") \
            .select("id") \
            .execute()
        valid_user_ids = [profile["id"] for profile in profiles_query.data]
        
        results = []
        
        for survey in query.data:
            # Skip if user doesn't exist in profiles table
            if survey["user_id"] not in valid_user_ids:
                print(f"User {survey['user_id']} not found in profiles table, skipping...")
                supabase.table("survey_responses") \
                    .update({
                        "embedding_status": "error",
                        "updated_at": "NOW()"
                    }) \
                    .eq("user_id", survey["user_id"]) \
                    .execute()
                continue
            
            # Skip if embedding already exists
            if survey["user_id"] in existing_user_ids:
                print(f"Embedding already exists for user {survey['user_id']}, skipping...")
                # Mark as completed since embedding exists
                supabase.table("survey_responses") \
                    .update({"embedding_status": "completed"}) \
                    .eq("user_id", survey["user_id"]) \
                    .execute()
                continue
                
            if not survey["responses"]:
                print(f"No responses found for user {survey['user_id']}, skipping...")
                # Mark as error since no responses found
                supabase.table("survey_responses") \
                    .update({"embedding_status": "error"}) \
                    .eq("user_id", survey["user_id"]) \
                    .execute()
                continue
            
            try:
                # Format survey responses into natural language
                text = format_survey_responses(survey["responses"])
                
                # Generate embedding
                embedding = get_embedding(text)
                
                # Store embedding in user_embeddings table
                supabase.table("user_embeddings") \
                    .upsert({
                        "user_id": survey["user_id"],
                        "embedding": embedding,
                        "updated_at": "NOW()"
                    }) \
                    .execute()
                
                # Update profile completion status
                update_user_profile_status(survey["user_id"])
                
                # Mark survey as completed
                supabase.table("survey_responses") \
                    .update({"embedding_status": "completed"}) \
                    .eq("user_id", survey["user_id"]) \
                    .execute()
                
                # Add to results
                results.append({
                    "user_id": survey["user_id"],
                    "embedding": embedding
                })
                
                print(f"Successfully processed survey and generated embedding for user {survey['user_id']}")
                
            except Exception as e:
                print(f"Error processing survey for user {survey['user_id']}: {str(e)}")
                # Update status to error
                supabase.table("survey_responses") \
                    .update({
                        "embedding_status": "error",
                        "updated_at": "NOW()"
                    }) \
                    .eq("user_id", survey["user_id"]) \
                    .execute()
        
        return results
    
    except Exception as e:
        print(f"Error in generate_embeddings: {str(e)}")
        return []

if __name__ == "__main__":
    print("Starting embedding generation...")
    embeddings = generate_embeddings()
    print(f"Generated and stored embeddings for {len(embeddings)} users")
