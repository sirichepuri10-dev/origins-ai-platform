import requests

class GitHubService:
    @staticmethod
    def fetch_trending_projects(skill):
        try:
            # Query GitHub Search API for repositories matching the skill, sorted by stars
            url = f"https://api.github.com/search/repositories?q={skill}&sort=stars"
            headers = {"Accept": "application/vnd.github.v3+json"}
            
            response = requests.get(url, headers=headers, timeout=5)
            
            if response.status_code != 200:
                return []
                
            data = response.json()
            repos = []
            
            # Extract top 5 repositories
            for repo in data.get("items", [])[:5]:
                repos.append({
                    "id": repo["id"],
                    "name": repo["name"],
                    "full_name": repo["full_name"],
                    "url": repo["html_url"],
                    "stars": repo["stargazers_count"],
                    "description": repo["description"] or "A popular repository related to this skill.",
                    "language": repo["language"]
                })
            
            return repos
        except Exception as e:
            print(f"GitHub API Error: {str(e)}")
            return []
