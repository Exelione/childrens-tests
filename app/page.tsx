'use client'

import WelcomeScreen from '../components/WelcomeScreen/WelcomeScreen';
import UploadPhotosScreen from '../components/UploadPhotosScreen/UploadPhotosScreen';
import { useState } from 'react';
import QuestionsScreen from '../components/QuastionsScreen/QuestionsScreen';
import ReportScreen from '../components/ReportScreen/ReportScreen';

const Page: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'upload' | 'questionnaire' | 'report' >('welcome');

  const handleStart = () => {
    setStep('upload');
  };
  const handleProceedToQuestionnaire = () => {
    setStep('questionnaire');
  }
  const handleSubmit = () => {
    setStep('report');
  }

  return (
    <>
      {step === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {step === 'upload' && <UploadPhotosScreen onNext={handleProceedToQuestionnaire} />}
      {step === 'questionnaire' && <QuestionsScreen onBack={handleStart} submit={handleSubmit}/>}
      {step === 'report' && <ReportScreen />}
    </>
  );
};

export default Page;