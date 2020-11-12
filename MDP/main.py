import numpy as np
from utility import get_reward_and_transition_probability
from time import sleep
from os import system
import random

# set parameter
gamma = 0.95
theta = 1e-3

# the grid world is 5x5 table, so the shape of reward is (5, 5)
reward, transition_probability = get_reward_and_transition_probability()