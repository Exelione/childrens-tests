'use client'

import WelcomeScreen from '../components/WelcomeScreen/WelcomeScreen';
import UploadPhotosScreen from '../components/UploadPhotosScreen/UploadPhotosScreen';
import { useState } from 'react';

const Page: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'upload'>('welcome');

  const handleStart = () => {
    setStep('upload');
  };

  return (
    <>
      {step === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {step === 'upload' && <UploadPhotosScreen />}
    </>
  );
};

export default Page;