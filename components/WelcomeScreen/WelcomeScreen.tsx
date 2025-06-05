import style from './WelcomeScreen.module.scss';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
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