import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const WhackAMole = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeMole, setActiveMole] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [stage, setStage] = useState(1);
  const [moleSpeed, setMoleSpeed] = useState(1000);

  const playSound = (soundName) => {
    const audio = new Audio(`/api/placeholder/audio/${soundName}`);
    audio.play();
  };

  const updateDifficulty = useCallback(() => {
    const newStage = Math.min(5, Math.floor(score / 10) + 1);
    setStage(newStage);
    setMoleSpeed(1000 - (newStage - 1) * 150);
  }, [score]);

  useEffect(() => {
    let moleTimer, gameTimer;
    if (gameStarted && timeLeft > 0) {
      gameTimer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      moleTimer = setInterval(() => {
        setActiveMole(Math.floor(Math.random() * 9));
      }, moleSpeed);
    } else if (timeLeft === 0) {
      setGameStarted(false);
      playSound('game-over.mp3');
    }
    return () => {
      clearInterval(moleTimer);
      clearInterval(gameTimer);
    };
  }, [gameStarted, timeLeft, moleSpeed]);

  useEffect(() => {
    updateDifficulty();
  }, [score, updateDifficulty]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setStage(1);
    setMoleSpeed(1000);
    setGameStarted(true);
    playSound('game-start.mp3');
  };

  const whackMole = (index) => {
    if (index === activeMole) {
      setScore((prevScore) => prevScore + 1);
      setActiveMole(null);
      playSound('whack.mp3');
    } else {
      playSound('miss.mp3');
    }
  };

  return (
    <div className="game-container">
      <h1>もぐらたたきゲーム</h1>
      <div className="game-info">
        <p>スコア: {score}</p>
        <p>残り時間: {timeLeft}秒</p>
        <p>ステージ: {stage}</p>
      </div>
      {!gameStarted ? (
        <button onClick={startGame} className="start-button">
          ゲーム開始
        </button>
      ) : (
        <div className="game-board">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              onClick={() => whackMole(index)}
              className="mole-hole"
            >
              {activeMole === index && (
                <div className="mole">
                  <div className="eyes">
                    <div className="eye"></div>
                    <div className="eye"></div>
                  </div>
                  <div className="nose"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhackAMole;
