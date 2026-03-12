import requests

class GitHubService:
    @staticmethod
    @staticmethod
    def fetch_trending_projects(skill):
        try:
            url = f"https://api.github.com/search/repositories?q={skill}&sort=stars"
            headers = {"Accept": "application/vnd.github.v3+json"}
            response = requests.get(url, headers=headers, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                items = data.get("items", [])
                if items:
                    repos = []
                    for repo in items[:5]:
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

        # Mock Fallback if API fails or no results
        return [
            {
                "id": 1,
                "name": f"awesome-{skill.lower()}",
                "full_name": f"origins/awesome-{skill.lower()}",
                "url": "https://github.com",
                "stars": 1250,
                "description": f"A curated list of amazing {skill} resources and tools.",
                "language": skill
            },
            {
                "id": 2,
                "name": f"{skill.lower()}-starter-kit",
                "full_name": f"dev/repo-{skill.lower()}",
                "url": "https://github.com",
                "stars": 840,
                "description": f"The ultimate boilerplate for building {skill} applications quickly.",
                "language": skill
            }
        ]
