'use client'

import React from 'react';
import WelcomeScreen from '../components/WelcomeScreen/WelcomeScreen';
import UploadPhotosScreen from '../components/UploadPhotosScreen/UploadPhotosScreen';
import { useState } from 'react';
import QuestionsScreen from '../components/QuastionsScreen/QuestionsScreen';
import ReportScreen from '../components/ReportScreen/ReportScreen';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import styles from './page.module.scss';


const STEPS = ['upload', 'questionnaire', 'report'] as const;
type Step = typeof STEPS[number] | 'welcome';

const Page = () => {
  const [step, setStep] = useState<Step>('welcome');

  const handleStart = () => setStep('upload');
  const handleProceedToQuestionnaire = () => setStep('questionnaire');
  const handleSubmit = () => setStep('report');
  const handleRestart = () => setStep('welcome');

  const currentStepIndex = STEPS.indexOf(step as typeof STEPS[number]);
  const showProgress = step !== 'welcome';

  return (
    <div className={styles.flowContainer}>
      {showProgress && (
        <ProgressBar 
          progress={(currentStepIndex + 1) / STEPS.length} 
        />
      )}
      
      {step === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {step === 'upload' && <UploadPhotosScreen onNext={handleProceedToQuestionnaire} />}
      {step === 'questionnaire' && (
        <QuestionsScreen 
          onBack={() => setStep('upload')} 
          submit={handleSubmit}
        />
      )}
      {step === 'report' && <ReportScreen onStart={handleRestart} />}
    </div>
  );
};

export default Page;