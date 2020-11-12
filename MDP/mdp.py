from utility import initialize_value

# we will use graphics of actions when printing grid world
direction = {
    "right": "→",
    "left": "←",
    "up": "↑",
    "down": "↓",
}

def get_exception(reward, transition_probability, value, current_state):
    exception = []
    for possible_state in transition_probability[current_state].keys():
        exception.append(reward[possible_state] + transition_probability[current_state][possible_state]["probability"] * value[possible_state])
    
    return max(exception)

class MarkovDecesionProcess():
    def __init__(self, gamma, theta, reward, transition_probability):
        self.reward = reward
        self.transition_probability = transition_probability
        self.states = list(reward.keys())
        self.gamma = gamma
        self.theta = theta
    
    def value_iteration(self, is_print_value=False, is_print_direction=False):
        value = initialize_value(self.states)

        while True:
            delta = 0
            current_value = value.copy()
            for state in self.states:
                value[state] = self.reward[state] + self.gamma * get_exception(self.reward, self.transition_probability, value, state)

                delta = max(delta, abs(current_value[state] - value[state]))
                current_value = value

                if delta < self.theta:
                    self.value = value
                
                if is_print_value:
                    self.print_value()

                if is_print_direction:
                    self.calculate_optimal_policy()
                    self.print_direction()
    
    def calculate_optimal_policy(self):
        pi = {}

        for state in self.states:
            max_exception = -100000
            best_action = ""

            for possible_state in self.transition_probability[state].keys():
                exception = self.reward[state] + self.gamma * get_exception(self.reward, self.transition_probability, self.value, possible_state)

                if exception > max_exception:
                    max_exception = exception
                    best_action = self.transition_probability[state][possible_state]["action"]
                
            pi[state] = best_action
        
        self.policy = pi

    def print_direction(self):
        print("-" * 21)
        for y in range(4, -1, -1):
            print("|", end="")
            for x in range(5):
                action = self.policy[(x, y)]

                if action == "exit":
                    print(" {} |".format(self.reward[(x, y)]), end="")
                else:
                    print(" {} |".format(direction[action]), end="")
                    
            print("\n", end="")
            print("-" * 21)


    def print_value(self):
        print("-" * 35)
        for y in range(4, -1, -1):
            print("|", end="")
            for x in range(5):
                print(" {} |".format(round(self.value[(x, y)], 1)), end="")

            print("\n", end="")
            print("-" * 35)