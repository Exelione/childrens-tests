import React from 'react';
import { useState, useRef, useEffect } from 'react';
import styles from './CustomDatePicker.module.scss';

interface CustomDatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  initialDate?: string; // Добавляем проп для начальной даты
}

export const CustomDatePicker = ({
  value = '',
  onChange,
  placeholder = 'Выберите дату',
  initialDate = '2017-07-28' // Устанавливаем начальную дату по умолчанию
}: CustomDatePickerProps) => {
  const [date, setDate] = useState(value || initialDate);
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Форматирование даты для отображения
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  // Обработчик клика вне календаря
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (selectedDate: string) => {
    setDate(selectedDate);
    onChange?.(selectedDate);
    setIsOpen(false);
  };

  // Раздельное форматирование месяца и года с разными стилями
  const russianMonths = [
    'Январь', 'Февраль', 'Март', 'Апрель',
    'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const formatMonthYear = (year: number, month: number) => {
    return (
      <span className={styles.monthYear}>
        <span className={styles.month}>{russianMonths[month]}</span>
        <span className={styles.year}> {year}</span>
      </span>
    );
  };

  const generateCalendarDays = () => {
    if (!isOpen) return null;

    const currentDate = date ? new Date(date) : new Date(initialDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const startDay = firstDay.getDay();
    const days = [];

    // Пустые ячейки для начала месяца
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1)
        .padStart(2, '0')}-${String(day)
          .padStart(2, '0')}`;
      days.push(
        <div
          key={dateStr}
          className={`${styles.day} ${date === dateStr ? styles.selected : ''}`}
          onClick={() => handleDateSelect(dateStr)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className={styles.calendarGrid}>
        <div className={styles.header}>
          <button onClick={() => handleMonthChange(-1)}>&lt;</button>
          {formatMonthYear(year, month)}
          <button onClick={() => handleMonthChange(1)}>&gt;</button>
        </div>
        <div className={styles.weekDays}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
            <div key={day} className={styles.weekDay}>{day}</div>
          ))}
        </div>
        <div className={styles.daysGrid}>{days}</div>
      </div>
    );
  };

  const handleMonthChange = (delta: number) => {
    const currentDate = date ? new Date(date) : new Date(initialDate);
    currentDate.setMonth(currentDate.getMonth() + delta);
    setDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <div className={styles.datePickerContainer} ref={calendarRef}>
      <div
        className={styles.dateInput}
        onClick={() => setIsOpen(!isOpen)}
      >
        {formatDisplayDate(date)}
      </div>

      {isOpen && (
        <div className={styles.calendarDropdown}>
          {generateCalendarDays()}
        </div>
      )}
    </div>
  );
};