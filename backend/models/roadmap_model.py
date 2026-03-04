class Roadmap:
    def __init__(self, goal, steps):
        self.goal = goal
        self.steps = steps

    def to_json(self):
        return {
            "goal": self.goal,
            "steps": self.steps
        }
