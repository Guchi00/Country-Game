import React, { useEffect, useState, ChangeEvent } from "react";
import { shuffle } from "../Utils/shuffle";
import styles from "./styles.module.css";

export interface GameProps {
  data: Record<string, string>;
}

export const Game = (props: GameProps) => {
  const { data } = props;

  const [initialGameData, setInitialGameData] = useState<string[]>(() => {
    const countryData = Object.entries(data);
    const flattenData = shuffle(countryData);
    return flattenData.flat().slice(0, 40);
  });
  const [gameData, setGameData] = useState<string[]>(() =>
    shuffle([...initialGameData])
  );
  const [clickedTiles, setClickedTiles] = useState<number[]>([]);
  const [correctPairs, setCorrectPairs] = useState<Set<number>>(new Set());
  const [temporaryCorrectPairs, setTemporaryCorrectPairs] = useState<
    Set<number>
  >(new Set());
  const [incorrectPairs, setIncorrectPairs] = useState<number[]>([]);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);

  useEffect(() => {
    // restartGame();
    reshuffleGame();
  }, []);

  const reshuffleGame = () => {
    setGameData(shuffle([...gameData]));
    setClickedTiles([]);
    setCorrectPairs(new Set());
    setTemporaryCorrectPairs(new Set());
    setIncorrectPairs([]);
    setIsGameComplete(false);
  };

  const restartGame = () => {
    const countryData = Object.entries(data);
    const newShuffledData = shuffle(countryData).flat().slice(0, 40);
    // const newShuffledData = shuffle(countryData).slice(0, 50);
    setInitialGameData(newShuffledData);
    setGameData(shuffle([...newShuffledData]));
    setClickedTiles([]);
    setCorrectPairs(new Set());
    setTemporaryCorrectPairs(new Set());
    setIncorrectPairs([]);
    setIsGameComplete(false);
  };

  const handleReplayGame = () => {
    reshuffleGame();
  };

  const handleClick = (index: number) => {
    if (correctPairs.has(index) || temporaryCorrectPairs.has(index)) return;

    const newClickedTiles = [...clickedTiles, index];
    setClickedTiles(newClickedTiles);

    if (newClickedTiles.length === 2) {
      const [firstIndex, secondIndex] = newClickedTiles;
      const firstTile = gameData[firstIndex];
      const secondTile = gameData[secondIndex];

      const firstIsCountry = data[firstTile] === secondTile;
      const secondIsCountry = data[secondTile] === firstTile;

      if (firstIsCountry || secondIsCountry) {
        setTemporaryCorrectPairs(
          (prev) => new Set([...Array.from(prev), firstIndex, secondIndex])
        );
        setTimeout(() => {
          setCorrectPairs((prev) => {
            const newCorrectPairs = new Set([
              ...Array.from(prev),
              firstIndex,
              secondIndex,
            ]);
            if (newCorrectPairs.size === gameData.length) {
              setIsGameComplete(true);
            }
            return newCorrectPairs;
          });
          setTemporaryCorrectPairs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(firstIndex);
            newSet.delete(secondIndex);
            return newSet;
          });
          setClickedTiles([]);
        }, 1000);
      } else {
        setIncorrectPairs([firstIndex, secondIndex]);
        setTimeout(() => {
          setIncorrectPairs([]);
          setClickedTiles([]);
        }, 1000);
      }
    } else if (newClickedTiles.length > 2) {
      setClickedTiles([index]);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Capital Match</h1>
        {isGameComplete ? (
          <div className={styles.congrats}>
            <h3>Congratulations!</h3>
            <h3>You have matched all tiles!</h3>
          </div>
        ) : (
          <div className={styles.board}>
            {gameData.map((tile, index) => {
              const isClicked = clickedTiles.includes(index);
              const isCorrect = correctPairs.has(index);
              const isTemporaryCorrect = temporaryCorrectPairs.has(index);
              const isIncorrect = incorrectPairs.includes(index);

              const borderColor = isIncorrect
                ? "red"
                : isTemporaryCorrect
                ? "rgb(52, 168, 84)"
                : isCorrect
                ? "rgb(52, 168, 84)"
                : isClicked
                ? "rgb(40, 133, 222)"
                : "white";

              return (
                <button
                  key={index}
                  style={{
                    backgroundColor: borderColor,
                    padding: "10px 20px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    border: "none",
                    display: isCorrect ? "none" : "inline-block",
                  }}
                  className={styles.tiles}
                  onClick={() => handleClick(index)}
                >
                  {tile}
                </button>
              );
            })}
          </div>
        )}
        <div className={styles.action_container}>
          <button onClick={restartGame} className={styles.action}>
            Restart Game
          </button>
          <button onClick={handleReplayGame} className={styles.action}>
            Play Again
          </button>
        </div>
        <h6>Prepared by Ugochi Iwuchukwu &#9829;</h6>
      </div>
    </>
  );
};
