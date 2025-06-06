'use client'
import React from 'react';
import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
  progress: number; // число от 0 до 1
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;