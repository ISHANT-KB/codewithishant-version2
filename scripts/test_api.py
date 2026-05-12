import requests

API_URL = "http://localhost:8000/notes"
NOTE_ID = "dcdf2c50-2f91-42ff-9d78-92017936af1e"

def test_get_note():
    try:
        response = requests.get(f"{API_URL}/{NOTE_ID}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_get_note()
