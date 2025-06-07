'use client'

import React, { useState, useEffect, useRef } from 'react';
import style from './ReportScreen.module.scss';
import { useSelector } from 'react-redux';
import { PhotosState } from '../QuastionsScreen/QuestionsScreen';

const ReportScreen = ({ onStart }: { onStart: () => void }) => {
  const photos = useSelector((state: { photos: PhotosState }) => state.photos);
  const taskId = photos.taskId;
  const [status, setStatus] = useState<'pending' | 'ready' | 'error'>('pending');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 20;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!taskId) {
      setErrorMessage('Отсутствует task_id');
      setStatus('error');
      return;
    }

    const checkReportStatus = async () => {
      try {
        const response = await fetch(
          `https://sirius-draw-test-94500a1b4a2f.herokuapp.com/report/${taskId}`,
          {
            headers: {
              'Accept': 'application/pdf'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/pdf')) {
          const blob = await response.blob();
          setPdfBlob(blob);
          setStatus('ready');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else if (contentType?.includes('application/json')) {
          const data = await response.json();
          if (data.status === 'ready') {
            await fetchReportPdf();
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          } else if (data.status === 'processing') {
            setRetryCount(prev => {
              const newCount = prev + 1;
              if (newCount >= maxRetries) {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                setStatus('error');
                setErrorMessage('Превышено время ожидания генерации отчета');
              }
              return newCount;
            });
          }
        } else {
          throw new Error('Неизвестный формат ответа');
        }
      } catch (error) {
        console.error('Ошибка при проверке статуса:', error);
        setRetryCount(prev => {
          const newCount = prev + 1;
          if (newCount >= maxRetries) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setStatus('error');
            setErrorMessage(
              error instanceof Error ? error.message : 'Произошла неизвестная ошибка'
            );
          }
          return newCount;
        });
      }
    };

    const fetchReportPdf = async () => {
      try {
        const response = await fetch(
          `https://sirius-draw-test-94500a1b4a2f.herokuapp.com/report/${taskId}`,
          {
            headers: {
              'Accept': 'application/pdf'
            }
          }
        );
        const blob = await response.blob();
        setPdfBlob(blob);
        setStatus('ready');
      } catch (error) {
        setStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Ошибка при загрузке PDF'
        );
      }
    };

    intervalRef.current = setInterval(checkReportStatus, 15000);
    checkReportStatus();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [taskId]);

  const handleDownload = () => {
    if (!pdfBlob) return;

    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `psychology_report_${taskId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleView = () => {
    if (!pdfBlob) return;

    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  };

  return (
    <div className={style.container}>
      <h1>Результаты психологического анализа</h1>

      {status === 'pending' && (
        <div className={style.statusMessage}>
          <div className={style.spinner}></div>
          <p>Идет обработка ваших результатов. Это может занять несколько минут...</p>
          <p>Пожалуйста, не закрывайте страницу.</p>
          <p>Попытка {retryCount + 1} из {maxRetries}...</p>
        </div>
      )}

      {status === 'error' && (
        <div className={style.errorMessage}>
          <h3>Ошибка при получении отчета</h3>
          <p>{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className={style.retryButton}
          >
            Попробовать снова
          </button>
        </div>
      )}

      {status === 'ready' && pdfBlob && (
        <div className={style.reportActions}>
          <h2>Ваш психологический анализ готов!</h2>
          <p>Результаты тестирования успешно сформированы.</p>

          <div className={style.buttons}>
            <button
              onClick={handleView}
              className={style.viewButton}
            >
              Открыть отчет в новом окне
            </button>

            <button
              onClick={handleDownload}
              className={style.downloadButton}
            >
              Скачать PDF отчет
            </button>
          </div>

          <div className={style.note}>
            <p>Рекомендуем сохранить отчет для консультации со специалистом.</p>
            <button className={style.viewButton} onClick={onStart}>В начало</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportScreen;