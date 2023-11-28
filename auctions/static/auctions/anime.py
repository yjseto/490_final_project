import requests

# Make a GET request to search anime by keyword
def search_anime(keyword):
    url = f"https://api.jikan.moe/v4/anime?q={keyword}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None
