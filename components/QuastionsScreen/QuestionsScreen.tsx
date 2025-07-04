'use client'

import React, { useState } from 'react';

import RadioOptions from '../RadioOptions/RadioOptions';
import { useSelector } from 'react-redux';
import { CustomDatePicker } from '../CustomDatePicker/CustomDatePicker';
import Image from 'next/image';
import okFinger from '../../public/images/okFinger.png';
import flag from '../../public/images/flag.png';
import arrow from '../../public/icons/arrow.svg';
import ForwardRight from '../../public/icons/ForwardRight.svg';
import style from './QuestionsScreen.module.scss';

interface Props {
  onBack: () => void;
  submit: () => void;
}
export interface PhotosState {
  taskId: string;
}

const QuestionsScreen = ({ onBack, submit }: Props) => {
  const [, setIsSubmitting] = useState(false);
  const photos = useSelector((state: { photos: PhotosState }) => state.photos);
  const taskId = photos.taskId;
  const handleSendSurvey = async () => {
    if (!taskId) {
      alert('Task ID не найден');
      return;
    }

    const payload = {
      task_id: taskId,
      survey: answers
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(
        'https://sirius-draw-test-94500a1b4a2f.herokuapp.com/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке данных');
      }

    } catch (error) {
      console.error(error);
      alert('Произошла ошибка при отправке');
    } finally {
      setIsSubmitting(false);
      submit();
    }
  };


  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleAnswerChange = (name: string, value: string) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
  };
  const checkboxOptions = [
    { label: 'Очень редко', value: "1" },
    { label: 'Редко', value: "2" },
    { label: 'Иногда', value: "3" },
    { label: 'Часто', value: "4" },
    { label: 'Всегда', value: "5" }
  ];

  const requiredFields = [
    'childName',
    'childDOB',
    'childGender',
    'parentName',
    'q1_1', 'q1_2', 'q1_3', 'q1_4', 'q1_5', 'q1_6', 'q1_7', 'q1_8', 'q1_9', 'q1_10',
    'q2_1', 'q2_2', 'q2_3', 'q2_4', 'q2_5', 'q2_6', 'q2_7', 'q2_8', 'q2_9', 'q2_10',
    'q3_1', 'q3_2', 'q3_3', 'q3_4', 'q3_5', 'q3_6', 'q3_7', 'q3_8', 'q3_9', 'q3_10',
    'q4_1', 'q4_2', 'q4_3', 'q4_4', 'q4_5', 'q4_6', 'q4_7', 'q4_8', 'q4_9', 'q4_10',
    'emotionalState'
  ];
  const isFormComplete = () => {
    return requiredFields.every(field => answers[field]);
  };
  return (
    <div className={style.container}>
      <section className={style.section}>
        <h2 className={style.sectionTitle}>Общая информация о ребенке</h2>
        <div className={style.field}>
          <label className={style.label}>Имя ребенка</label>
          <input
            type="text"
            className={style.input}
            onChange={(e) => handleAnswerChange('childName', e.target.value)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label} >Дата рождения ребенка</label>
          <CustomDatePicker
            onChange={(date) => handleAnswerChange('childDOB', date)}
            placeholder="дд.мм.гггг"
          />

        </div>
        <div className={style.field}>
          <label className={style.label}>Пол ребенка</label>
          <RadioOptions
            name="childGender"
            options={[{ label: 'Мужской', value: 'male' }, { label: 'Женский', value: 'female' }]}
            selected={answers['childGender']}
            onChange={(val) => handleAnswerChange('childGender', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Имя родителя, заполняющего анкету</label>
          <input
            type="text"
            className={style.input}
            onChange={(e) => handleAnswerChange('parentName', e.target.value)}
          />
        </div>
      </section>
      <section className={style.infoSection}>
        <div className={style.infoBlock}>
          <Image
            src={okFinger}
            alt="finger"
            width={32}
            height={30}
          />
          <span className={style.text}>
            Пожалуйста, внимательно прочитайте каждый вопрос и выберите наиболее подходящий
            вариант ответа,  отражающий поведение и эмоциональное состояние вашего ребенка в
            течение последних 2-4 недель. Отвечайте максимально честно и искренне,
            так как от этого зависит точность оценки психоэмоционального
            развития Вашего ребенка.</span>
        </div>
        <div className={style.infoBlock}>
          <Image src={flag} alt='flag' width={32} height={32} />
          <span className={style.text}>Все вопросы обязательны к заполнению</span>
        </div>
      </section>
      <section className={style.section}>
        <h2 className={style.sectionTitle}>Раздел 1. Эмоциональная сфера</h2>
        <div className={style.field}>
          <label className={style.label}>Ребенок часто выражает радость и удовольствие:</label>
          <RadioOptions
            name="q1_1"
            options={checkboxOptions}
            selected={answers['q1_1']}
            onChange={(val) => handleAnswerChange('q1_1', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Ребенок часто грустит или плачет без видимой причины:
          </label>
          <RadioOptions
            name="q1_2"
            options={checkboxOptions}
            selected={answers['q1_2']}
            onChange={(val) => handleAnswerChange('q1_2', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок часто выражает радость и удовольствие:</label>
          <RadioOptions
            name="q1_3"
            options={checkboxOptions}
            selected={answers['q1_3']}
            onChange={(val) => handleAnswerChange('q1_3', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Ребенок часто грустит или плачет без видимой причины:
          </label>
          <RadioOptions
            name="q1_4"
            options={checkboxOptions}
            selected={answers['q1_4']}
            onChange={(val) => handleAnswerChange('q1_4', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок часто выражает радость и удовольствие:</label>
          <RadioOptions
            name="q1_5"
            options={checkboxOptions}
            selected={answers['q1_5']}
            onChange={(val) => handleAnswerChange('q1_5', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Ребенок часто грустит или плачет без видимой причины:
          </label>
          <RadioOptions
            name="q1_6"
            options={checkboxOptions}
            selected={answers['q1_6']}
            onChange={(val) => handleAnswerChange('q1_6', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок часто выражает радость и удовольствие:</label>
          <RadioOptions
            name="q1_7"
            options={checkboxOptions}
            selected={answers['q1_7']}
            onChange={(val) => handleAnswerChange('q1_7', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок часто выражает радость и удовольствие:</label>
          <RadioOptions
            name="q1_8"
            options={checkboxOptions}
            selected={answers['q1_8']}
            onChange={(val) => handleAnswerChange('q1_8', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Ребенок часто грустит или плачет без видимой причины:
          </label>
          <RadioOptions
            name="q1_9"
            options={checkboxOptions}
            selected={answers['q1_9']}
            onChange={(val) => handleAnswerChange('q1_9', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок часто выражает радость и удовольствие:</label>
          <RadioOptions
            name="q1_10"
            options={checkboxOptions}
            selected={answers['q1_10']}
            onChange={(val) => handleAnswerChange('q1_10', val)}
          />
        </div>
      </section>
      <section className={style.section}>
        <h2 className={style.sectionTitle}>Раздел 2. Социальное взаимодействие</h2>
        <div className={style.field}>
          <label className={style.label}>Ребенок легко заводит друзей:</label>
          <RadioOptions
            name="q2_1"
            options={checkboxOptions}
            selected={answers['q2_1']}
            onChange={(val) => handleAnswerChange('q2_1', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Ребенок предпочитает играть один, а не с другими детьми:
          </label>
          <RadioOptions
            name="q2_2"
            options={checkboxOptions}
            selected={answers['q2_2']}
            onChange={(val) => handleAnswerChange('q2_2', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок легко заводит друзей:</label>
          <RadioOptions
            name="q2_3"
            options={checkboxOptions}
            selected={answers['q2_3']}
            onChange={(val) => handleAnswerChange('q2_3', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Ребенок предпочитает играть один, а не с другими детьми:
          </label>
          <RadioOptions
            name="q2_4"
            options={checkboxOptions}
            selected={answers['q2_4']}
            onChange={(val) => handleAnswerChange('q2_4', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок легко заводит друзей:</label>
          <RadioOptions
            name="q2_5"
            options={checkboxOptions}
            selected={answers['q2_5']}
            onChange={(val) => handleAnswerChange('q2_5', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Ребенок предпочитает играть один, а не с другими детьми:
          </label>
          <RadioOptions
            name="q2_6"
            options={checkboxOptions}
            selected={answers['q2_6']}
            onChange={(val) => handleAnswerChange('q2_6', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок легко заводит друзей:</label>
          <RadioOptions
            name="q2_7"
            options={checkboxOptions}
            selected={answers['q2_7']}
            onChange={(val) => handleAnswerChange('q2_7', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Ребенок предпочитает играть один, а не с другими детьми:
          </label>
          <RadioOptions
            name="q2_8"
            options={checkboxOptions}
            selected={answers['q2_8']}
            onChange={(val) => handleAnswerChange('q2_8', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок легко заводит друзей:</label>
          <RadioOptions
            name="q2_9"
            options={checkboxOptions}
            selected={answers['q2_9']}
            onChange={(val) => handleAnswerChange('q2_9', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Ребенок предпочитает играть один, а не с другими детьми:
          </label>
          <RadioOptions
            name="q2_10"
            options={checkboxOptions}
            selected={answers['q2_10']}
            onChange={(val) => handleAnswerChange('q2_10', val)}
          />
        </div>
      </section>
      <section className={style.section}>
        <h2 className={style.sectionTitle}>Раздел 3. Саморегуляция и поведение</h2>
        <div className={style.field}>
          <label className={style.label}>Ребенок умеет следовать правилам и инструкциям:</label>
          <RadioOptions
            name="q3_1"
            options={checkboxOptions}
            selected={answers['q3_1']}
            onChange={(val) => handleAnswerChange('q3_1', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенку трудно контролировать свои импульсы:</label>
          <RadioOptions
            name="q3_2"
            options={checkboxOptions}
            selected={answers['q3_2']}
            onChange={(val) => handleAnswerChange('q3_2', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок умеет следовать правилам и инструкциям:</label>
          <RadioOptions
            name="q3_3"
            options={checkboxOptions}
            selected={answers['q3_3']}
            onChange={(val) => handleAnswerChange('q3_3', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок умеет следовать правилам и инструкциям:</label>
          <RadioOptions
            name="q3_4"
            options={checkboxOptions}
            selected={answers['q3_4']}
            onChange={(val) => handleAnswerChange('q3_4', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенку трудно контролировать свои импульсы:</label>
          <RadioOptions
            name="q3_5"
            options={checkboxOptions}
            selected={answers['q3_5']}
            onChange={(val) => handleAnswerChange('q3_5', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок умеет следовать правилам и инструкциям:</label>
          <RadioOptions
            name="q3_6"
            options={checkboxOptions}
            selected={answers['q3_6']}
            onChange={(val) => handleAnswerChange('q3_6', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенку трудно контролировать свои импульсы:</label>
          <RadioOptions
            name="q3_7"
            options={checkboxOptions}
            selected={answers['q3_7']}
            onChange={(val) => handleAnswerChange('q3_7', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок умеет следовать правилам и инструкциям:</label>
          <RadioOptions
            name="q3_8"
            options={checkboxOptions}
            selected={answers['q3_8']}
            onChange={(val) => handleAnswerChange('q3_8', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенку трудно контролировать свои импульсы:</label>
          <RadioOptions
            name="q3_9"
            options={checkboxOptions}
            selected={answers['q3_9']}
            onChange={(val) => handleAnswerChange('q3_9', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок умеет следовать правилам и инструкциям:</label>
          <RadioOptions
            name="q3_10"
            options={checkboxOptions}
            selected={answers['q3_10']}
            onChange={(val) => handleAnswerChange('q3_10', val)}
          />
        </div>
      </section>
      <section className={style.section}>
        <h2 className={style.sectionTitle}>Раздел 4. Самооценка и уверенность в себе</h2>
        <div className={style.field}>
          <label className={style.label}>Ребенок уверен в своих силах и способностях:</label>
          <RadioOptions
            name="q4_1"
            options={checkboxOptions}
            selected={answers['q4_1']}
            onChange={(val) => handleAnswerChange('q4_1', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок часто сомневается в себе:</label>
          <RadioOptions
            name="q4_2"
            options={checkboxOptions}
            selected={answers['q4_2']}
            onChange={(val) => handleAnswerChange('q4_2', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок уверен в своих силах и способностях:</label>
          <RadioOptions
            name="q4_3"
            options={checkboxOptions}
            selected={answers['q4_3']}
            onChange={(val) => handleAnswerChange('q4_3', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок часто сомневается в себе:</label>
          <RadioOptions
            name="q4_4"
            options={checkboxOptions}
            selected={answers['q4_4']}
            onChange={(val) => handleAnswerChange('q4_4', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок уверен в своих силах и способностях:</label>
          <RadioOptions
            name="q4_5"
            options={checkboxOptions}
            selected={answers['q4_5']}
            onChange={(val) => handleAnswerChange('q4_5', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок часто сомневается в себе:</label>
          <RadioOptions
            name="q4_6"
            options={checkboxOptions}
            selected={answers['q4_6']}
            onChange={(val) => handleAnswerChange('q4_6', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок уверен в своих силах и способностях:</label>
          <RadioOptions
            name="q4_7"
            options={checkboxOptions}
            selected={answers['q4_7']}
            onChange={(val) => handleAnswerChange('q4_7', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок часто сомневается в себе:</label>
          <RadioOptions
            name="q4_8"
            options={checkboxOptions}
            selected={answers['q4_8']}
            onChange={(val) => handleAnswerChange('q4_8', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок уверен в своих силах и способностях:</label>
          <RadioOptions
            name="q4_9"
            options={checkboxOptions}
            selected={answers['q4_9']}
            onChange={(val) => handleAnswerChange('q4_9', val)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Ребенок часто сомневается в себе:</label>
          <RadioOptions
            name="q4_10"
            options={checkboxOptions}
            selected={answers['q4_10']}
            onChange={(val) => handleAnswerChange('q4_10', val)}
          />
        </div>
      </section>


      {/* Раздел 5. Общие вопросы */}
      <section className={style.section}>
        <h2 className={style.sectionTitle}>Раздел 5. Общие вопросы</h2>

        {/* Общее эмоциональное состояние */}
        <div className={style.field}>
          <label className={style.label}>
            Как Вы оцениваете общее эмоциональное состояние вашего ребенка?
          </label>
          <RadioOptions
            direction
            name="emotionalState"
            options={checkboxOptions}
            selected={answers['emotionalState']}
            onChange={(val) => handleAnswerChange('emotionalState', val)}
          />
        </div>

        {/* Особенности развития или поведения */}
        <div className={style.textAreaField}>
          <label className={style.label}>
            Есть ли у Вашего ребенка какие-либо особенности развития или поведения,
            о которых Вы хотели бы сообщить дополнительно?
          </label>
          <textarea className={style.textarea} />
        </div>

        {/* Сильные стороны и таланты */}
        <div className={style.textAreaField}>
          <label className={style.label}>
            Какие, на Ваш взгляд, сильные стороны и таланты есть у Вашего ребенка?
          </label>
          <textarea className={style.textarea} />
        </div>

        {/* Обращались ли к специалистам? */}
        <div className={style.textAreaField}>
          <label className={style.label}>
            Обращались ли Вы ранее к специалистам (психологу, неврологу, логопеду)?
          </label>
          <textarea className={style.textarea} />
        </div>
      </section>

      {/* Кнопки */}
      <div className={style.buttonsContainer} >
        {/* Шаги */}
        < span className={style.step}>Шаг 2/3</span >
        <div className={style.buttons}>
          < button className={style.buttonBack} onClick={onBack} >
            <Image className={style.arrow} src={arrow} alt="back" width={24} height={24} />
            К загрузке рисунков
          </button >
          {/* Активная только если все обязательные заполнены */}
          < button
            className={style.button}
            onClick={handleSendSurvey}
            disabled={!isFormComplete()} >
            Узнать результаты
            <Image
              className={style.arrowBig}
              src={ForwardRight}
              alt="back"
              width={24}
              height={24}
            />
          </button >
        </div>
      </div>
    </div >
  );
};

export default QuestionsScreen;