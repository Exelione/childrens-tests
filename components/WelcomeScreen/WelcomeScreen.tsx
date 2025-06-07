import React from 'react';
import style from './WelcomeScreen.module.scss';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className={style.welcomeScreenContainer}>
      <h1>Название теста</h1>
      <button
        onClick={onStart}
        className={style.startButton}
      >
        Начать тест
      </button>
    </div>
  );
};

export default WelcomeScreen;