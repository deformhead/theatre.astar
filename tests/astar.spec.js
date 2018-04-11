import {Astar} from '../sources/astar.js';

import chai from 'chai';

const expect = chai.expect;

describe('Astar', function () {

    const diagonal = (point, goal) => {

        // return the diagonal distance between point and goal
        return Math.max(Math.abs(point[0] - goal[0]), Math.abs(point[1] - goal[1]));
    };

    const euclidean = (point, goal) => {

        // return the euclidean distance between point and goal
        return Math.sqrt(Math.pow(point[0] - goal[0], 2) + Math.pow(point[1] - goal[1], 2));
    };

    const manhattan = (point, goal) => {

        // return the manhattan distance between point and goal
        return Math.abs(point[0] - goal[0]) + Math.abs(point[1] - goal[1]);
    };

    describe('#constructor()', function () {

        it('should expose getPath()', function () {

            const astar = new Astar(euclidean, false);

            expect(astar.getPath).to.be.a('function');
        });
    });

    describe('#getPath()', function () {

        it('should return an empty path when start or goal are not walkable', function () {

            const astar = new Astar(euclidean, false);

            const start = [0, 0];
            const goal = [1, 0];

            const map = [

                [0, 0]
            ];

            const path = astar.getPath(map, start, goal);

            expect(path).to.be.empty;
        });

        it('should return an empty path when start and goal are the same', function () {

            const astar = new Astar(euclidean, false);

            const start = [0, 0];
            const goal = [0, 0];

            const map = [

                [1]
            ];

            const path = astar.getPath(map, start, goal);

            expect(path).to.be.empty;
        });

        it('should return an empty path when there is no path', function () {

            const astar = new Astar(euclidean, false);

            const start = [0, 0];
            const goal = [2, 0];

            const map = [

                [1, 0, 1]
            ];

            const path = astar.getPath(map, start, goal);

            expect(path).to.be.empty;
        });

        it('should return an unpredictable path when same-level possibilities', function () {

            const astar = new Astar(euclidean, false);

            const start = [0, 0];
            const goal = [1, 1];

            const map = [

                [1, 1],
                [1, 1]
            ];

            //   s  x
            //   .  g
            //
            //    or
            //
            //   s  .
            //   x  g
            const path = astar.getPath(map, start, goal);

            expect(path).to.have.lengthOf(3);
            expect(path).to.satisfy((path) => {

                for (let iterator = 0; iterator < 10; iterator += 1) {

                    //   s  x
                    //   .  g
                    //
                    //    or
                    //
                    //   s  .
                    //   x  g
                    const current = astar.getPath(map, start, goal);

                    if (current[1][0] !== path[1][0]) {

                        return true;
                    }
                }

                return false;
            });
        });

        it('should return the fastest orthogonal allowed path', function () {

            const astar = new Astar(euclidean, false);

            const start = [0, 0];
            const goal = [0, 4];

            const map = [

                [1, 1, 1, 1, 1],
                [1, 1, 1, 0, 1],
                [1, 1, 1, 0, 1],
                [0, 0, 0, 1, 1],
                [1, 1, 1, 1, 1]
            ];

            //   s  x  x  x  x
            //   .  .  .  .  x
            //   .  .  .  .  x
            //   .  .  .  x  x
            //   g  x  x  x  .
            const path = astar.getPath(map, start, goal);

            expect(path).to.deep.equal([

                [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [4, 3], [3, 3], [3, 4], [2, 4], [1, 4], [0, 4]
            ]);
        });

        it('should return the fastest diagonal allowed path', function () {

            const astar = new Astar(euclidean, true);

            const start = [0, 0];
            const goal = [0, 4];

            const map = [

                [1, 1, 1, 1, 1],
                [1, 1, 1, 0, 1],
                [1, 1, 1, 0, 1],
                [0, 0, 0, 1, 1],
                [1, 1, 1, 1, 1]
            ];

            //   s  x  x  x  x
            //   .  .  .  .  x
            //   .  .  .  .  x
            //   .  .  .  .  x
            //   g  x  x  x  .
            const path = astar.getPath(map, start, goal);

            expect(path).to.deep.equal([

                [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [4, 3], [3, 4], [2, 4], [1, 4], [0, 4]
            ]);
        });

        it('should return the lightest orthogonal allowed path', function () {

            const astar = new Astar(euclidean, false);

            const start = [0, 0];
            const goal = [4, 0];

            const map = [

                [2, 2, 9, 2, 2],
                [3, 2, 5, 2, 3],
                [2, 2, 1, 2, 2]
            ];

            //   s  x  .  x  g
            //   .  x  .  x  .
            //   .  x  x  x  .
            const path = astar.getPath(map, start, goal);

            expect(path).to.deep.equal([

                [0, 0], [1, 0], [1, 1], [1, 2], [2, 2], [3, 2], [3, 1], [3, 0], [4, 0]
            ]);
        });

        it('should return the lightest diagonal allowed path', function () {

            const astar = new Astar(euclidean, true);

            const start = [0, 0];
            const goal = [4, 0];

            const map = [

                [2, 2, 9, 2, 2],
                [3, 2, 5, 2, 3],
                [2, 2, 1, 2, 2]
            ];

            //   s  .  .  .  g
            //   .  x  .  x  .
            //   .  .  x  .  .
            const path = astar.getPath(map, start, goal);

            expect(path).to.deep.equal([

                [0, 0], [1, 1], [2, 2], [3, 1], [4, 0]
            ]);
        });
    });
});
