import { useCallback, useEffect, useState } from "react";

const neighborsPossible = [
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
];

const sizes = [
    { value: "10x20", key: "key1" },
    { value: "30x30", key: "key2" },
    { value: "30x50", key: "key3" },
];

const GameOfLife = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gridSize, setGridSize] = useState({ rows: 30, cols: 30 });
    const generateEmptyField = () => Array(gridSize.rows).fill(Array(gridSize.cols).fill(false));
    const generateRandomSeed = () =>
        Array(gridSize.rows)
            .fill(Array(gridSize.cols).fill(false))
            .map((el) => el.map((el2) => (Math.random() > 0.7 ? 1 : 0)));

    const [grid, setGrid] = useState(generateEmptyField());
    useEffect(() => {
        setGrid(generateEmptyField());
    }, [gridSize.cols, gridSize.rows]);

    const getNextGen = useCallback(() => {
        const gridCopy = JSON.parse(JSON.stringify(grid));
        grid.forEach((row, rowIdx) => {
            row.forEach((col, colIdx) => {
                let neighbours = 0;
                neighborsPossible.forEach(([x, y]) => {
                    const nextX = rowIdx + x;
                    const nextY = colIdx + y;
                    if (
                        nextX >= 0 &&
                        nextX < gridSize.rows &&
                        nextY >= 0 &&
                        nextY < gridSize.cols
                    ) {
                        neighbours += grid[nextX][nextY];
                    }
                });

                if (neighbours < 2 || neighbours > 3) {
                    gridCopy[rowIdx][colIdx] = false;
                } else if (grid[rowIdx][colIdx] === false && neighbours === 3) {
                    gridCopy[rowIdx][colIdx] = true;
                }
            });
        });
        return gridCopy;
    }, [gridSize.cols, gridSize.rows, grid]);

    useEffect(() => {
        if (gameStarted) {
            const nextGenGrid = getNextGen();
            setTimeout(() => {
                setGrid(() => nextGenGrid);
            }, 150);
        }
    }, [grid, gameStarted, getNextGen]);
    console.log(grid.length);

    const handleSelectSize = (e) => {
        switch (e.target.value) {
            case "10x20":
                setGridSize({ rows: 10, cols: 20 });
                break;
            case "30x30":
                setGridSize({ rows: 30, cols: 30 });
                break;
            case "30x50":
                setGridSize({ rows: 30, cols: 50 });
                break;
            default:
                setGridSize({ rows: 10, cols: 20 });
                break;
        }
    };

    return (
        <div>
            <div className="flex flex-col justify-center font-mono bg-slate-200 h-screen items-center mx-auto pt-7 gap-6 text-2xl">
                <h1 className="text-6xl font-mono">Game Of Life</h1>
                <div className="flex max-w-[900px] w-full gap-5 mx-auto">
                    <button
                        role="button-start"
                        className="px-4 py-1 mb-2 rounded-full bg-black w-full text-white"
                        onClick={() => {
                            setGameStarted(!gameStarted);
                        }}
                    >
                        {gameStarted ? "Stop" : "Start"}
                    </button>
                    <button
                        disabled={gameStarted}
                        className={`${
                            gameStarted ? "bg-[#444648]" : "bg-black"
                        } px-4 py-2 mb-2 rounded-full w-full bg-black text-white`}
                        onClick={() => {
                            setGrid(generateRandomSeed());
                        }}
                    >
                        Random Seed
                    </button>
                    <button
                        className={`${
                            gameStarted ? "bg-[#444648]" : "bg-black"
                        } px-4 py-1 mb-2 rounded-full w-full bg-black text-white`}
                        disabled={gameStarted}
                        onClick={() => {
                            setGrid((prev) => generateEmptyField());
                        }}
                    >
                        Clear
                    </button>
                    <select
                        disabled={gameStarted}
                        onChange={handleSelectSize}
                        value={`${gridSize.rows}x${gridSize.cols}`}
                        className="px-4 py-1 mb-2 rounded-full w-full bg-black text-white text-center focus:outline-none"
                    >
                        {sizes.map((size) => (
                            <option key={size.key} value={size.value}>
                                {size.value}
                            </option>
                        ))}
                    </select>
                </div>
                <div
                    style={{
                        display: "grid",
                        padding: ".2rem",
                        gap: "2px",
                        backgroundColor: "black",
                        gridTemplateColumns: `repeat(${gridSize.cols}, 20px)`,
                        gridTemplateRows: `repeat(${gridSize.rows}, 20px)`,
                        justifyContent: "center",
                        alignContent: "center",
                    }}
                >
                    {grid.map((cols, i) =>
                        cols.map((rows, j) => (
                            <div
                                key={i + j}
                                onClick={(e) => {
                                    if (!gameStarted) {
                                        const gridCopy = JSON.parse(JSON.stringify(grid));
                                        gridCopy[i][j] === false
                                            ? (gridCopy[i][j] = true)
                                            : (gridCopy[i][j] = false);
                                        setGrid((grid) => gridCopy);
                                    }
                                }}
                                className={`cursor-pointer ${
                                    grid[i][j] == false ? "bg-white" : "bg-green-400"
                                } h-[20px] w-[20px]`}
                            ></div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameOfLife;
