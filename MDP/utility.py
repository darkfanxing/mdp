import csv

def get_reward_and_transition_probability():
    reward = {}
    transition_probability = {}

    with open("data/Reward.csv", encoding="utf-8-sig") as _file:
        rows = csv.reader(_file, delimiter=",")
        
        # start at row 1, because row 0 just is a description
        # description is x, y and score
        rows = list(rows)[1:]
        rows = map(lambda  x: tuple(x), rows)
        for x, y, score in rows:
            # int(x), int(y) is coordinate
            reward[(int(x), int(y))] = float(score)
        
    with open("data/TransitionProbability.csv", encoding="utf-8-sig") as _file:
        rows = csv.reader(_file, delimiter=",")

        # start at row 1, because row 0 just is a description
        # description is original_x, original_y, action, new_x, new_y and probability
        rows = list(rows)[1:]
        rows = map(lambda  x: tuple(x), rows)
        for original_x, original_y, action, new_x, new_y, probability in rows:
            original_position = (int(original_x), int(original_y))
            new_position = (int(new_x), int(new_y))
            if original_position in transition_probability:
                transition_probability[original_position][new_position] = {
                    "probability": float(probability),
                    "action": action
                }
            else:
                transition_probability[original_position] = {
                    new_position: {
                        "probability": float(probability),
                        "action": action
                    }
                }

    return reward, transition_probability

def initialize_value(states):
    value = {}
    for state in states:
        value[state] = 0

    return value