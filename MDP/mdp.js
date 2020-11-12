const symb = {
    'U': '▲',
    'L': '◀',
    'R': '▶',
    'D': '▼'
};

function MDP() {
    this.stepCount = 0;
    this.rewards = [];
    this.fields = [];
    this.utilities = [];
    this.movePop = {};
    this.policy = [];
    this.gamma = 1.0;
    this.currentCoordinate = {
        'x': 0,
        'y': 0
    };

    this.logSolution = function (message) {
        console.log(message);
    };
    this.fieldSize = {
        'x': 0,
        'y': 0
    };
    this.setFieldSize = function (x, y) {
        this.fieldSize = {
            'x': x,
            'y': y
        };
        this.initPolicy();
    };
    this.setCurrentCoordinate = function (mdp, x, y) {
        var newPos = new Coordinate(mdp, x, y);
        if (! newPos.isTerminal() && ! newPos.isWall()) {
            curPos = new Coordinate(mdp, x, y);
            this.currentCoordinate = curPos.clone();
            neverStart = false;
        }
    };
    this.initPolicy = function () {
        this.policy = [];
        for (var i = 0; i < this.fieldSize.y; i++) {
            this.policy[i] = [];
            for (var j = 0; j < this.fieldSize.x; j++) {
                if (this.fields[i][j] === 'T' || this.fields[i][j] === 'G') {
                    this.policy[i][j] = this.utilities[i][j];
                } else {
                    this.policy[i][j] = ' ';
                }
            }
        }
    };

    this.setInitPosition = function (mdp, x, y) {
        mdp.initPosition = new Coordinate(mdp, x, y);
    };

    function Coordinate(mdp, x, y) {
        this.mdp = mdp;
        this.move = function (direction) {
            var oc = this.clone();
            var x = this.x;
            var y = this.y;
            switch (direction) {
                case 'U': y--;
                    break;
                case 'L': x--;
                    break;
                case 'R': x++;
                    break;
                case 'D': y++;
                    break;
            }
            this.setXY(x, y);
            if (this.isWall()) {
                this.setXY(oc.x, oc.y);
            }
            return this;
        };
        this.setXY = function (x, y) {
            x = x < 0 ? 0 : x;
            x = x >= this.mdp.fieldSize.x ? this.mdp.fieldSize.x - 1 : x;
            y = y < 0 ? 0 : y;
            y = y >= this.mdp.fieldSize.y ? this.mdp.fieldSize.y - 1 : y;
            this.x = x;
            this.y = y;
            return this;
        };
        this.clone = function () {
            return new Coordinate(this.mdp, this.x, this.y);
        };
        this.utility = function () {
            return this.mdp.utilities[this.y][this.x];
        };
        this.isTerminal = function () {
            return this.mdp.fields[this.y][this.x] === 'T' || this.mdp.fields[this.y][this.x] === 'G';
        };
        this.isWall = function () {
            return this.mdp.fields[this.y][this.x] === '#';
        };
        this.print = function () {
            console.log(this.x, this.y);
        };
        this.setXY(x, y);
    }

    function print2DArray(arr) {
        for (var i in arr) {
            var value = arr[i].join("\t");
            for (var a in symb) {
                value = value.replace(new RegExp(a, 'g'), symb[a]);
            }
            console.log(i + ":\t" + value);
        }
    }
    var curPos;
    var neverStart = true;
    this.step = function () {
        if (neverStart === true) {
            neverStart = false;
            curPos = this.initPosition.clone();
        }
        this.stepCount ++;
        this.logSolution('================================================================');
        this.logSolution('Step: ' + this.stepCount);
        this.logSolution('================================================================');
        var moveScores = {};

        for (var desiredMove in this.movePop) {
            var sol = desiredMove + ' = ';
            moveScores[desiredMove] = 0.0;
            for (var realMove in this.movePop) {
                var chance = this.movePop[desiredMove][realMove];
                var utility = curPos.clone().move(realMove).utility();
                moveScores[desiredMove] += chance * utility;
                if (chance != 0) {
                    sol += realMove + ':' + chance + ' * ' + utility + ' + ';
                }
            }
            sol = sol.slice(0, -2) + '= ' + moveScores[desiredMove];
            this.logSolution(sol);
        }

        var bestMove = 'U';
        for (var move in moveScores) {
            if (moveScores[move] > moveScores[bestMove]) {
                bestMove = move;
            }
        }
        this.logSolution("Max = " + moveScores[bestMove]);
        this.logSolution('π(' + (
            curPos.y + 1
        ) + ',' + (
            curPos.x + 1
        ) + ') = ' + bestMove); // Set policy for this move
        this.policy[curPos.y][curPos.x] = symb[bestMove]; // Calculate new utility of this move
        var reward = this.rewards[curPos.y][curPos.x];
        this.utilities[curPos.y][curPos.x] = reward + this.gamma * moveScores[bestMove];
        var solU = 'U(' + (
            curPos.y + 1
        ) + ',' + (
            curPos.x + 1
        ) + ')';
        this.logSolution(solU + ' = ' + reward + ' + ' + this.gamma + ' * ' + moveScores[bestMove] + ' = ' + this.utilities[curPos.y][curPos.x]); // Move to new position
        curPos.move(bestMove);
        if (! curPos.isTerminal()) {} else {
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
            do {
                x = getRandomInt(0, this.fieldSize.x);
                y = getRandomInt(0, this.fieldSize.y);
                curPos = new Coordinate(this, x, y);
            } while (curPos.isTerminal() || curPos.isWall())
        }
        this.currentCoordinate = curPos.clone();
    };
    this.initPosition = new Coordinate(this, 0, 0);
}
