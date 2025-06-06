'use client'

import React, { useState, useEffect } from 'react';

import style from './ReportScreen.module.scss';
import { useSelector } from 'react-redux';
import { PhotosState } from '../QuastionsScreen/QuestionsScreen';

const ReportScreen = ({ onStart }: { onStart: () => void }) => {
  const photos = useSelector((state: { photos: PhotosState }) => state.photos);
  const taskId = photos.taskId;
  const [status, setStatus] = useState<'pending' | 'ready' | 'error'>('pending');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
              'Accept': 'application/pdf' // Явно запрашиваем PDF
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
        } else if (contentType?.includes('application/json')) {
          // Если сервер сначала возвращает JSON статус
          const data = await response.json();
          if (data.status === 'ready') {
            // Делаем второй запрос для получения PDF
            await fetchReportPdf();
          } else if (data.status === 'processing') {
            setTimeout(checkReportStatus, 15000);
          }
        } else {
          throw new Error('Неизвестный формат ответа');
        }
      } catch (error) {
        console.error('Ошибка при проверке статуса:', error);
        setStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Произошла неизвестная ошибка'
        );
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
        throw error;
      }
    };

    checkReportStatus();

    return () => {
      // Cleanup
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
    // URL.revokeObjectURL(url); // Не revoke, чтобы PDF оставался доступен
  };

  return (
    <div className={style.container}>
      <h1>Результаты психологического анализа</h1>

      {status === 'pending' && (
        <div className={style.statusMessage}>
          <div className={style.spinner}></div>
          <p>Идет обработка ваших результатов. Это может занять несколько минут...</p>
          <p>Пожалуйста, не закрывайте страницу.</p>
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