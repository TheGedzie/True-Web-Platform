import { useState } from "react";
import cls from "./Quiz.module.css";
import type { IQuizQuestion } from "../../../types/index";

interface QuizProps {
  questions: IQuizQuestion[];
  courseName: string;
  onPass: () => void;
  onClose: () => void;
}

export const Quiz = ({ questions, courseName, onPass, onClose }: QuizProps) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;
  const isLast = current === total - 1;

  const handleSelect = (optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[current] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[current] === undefined) return;
    if (isLast) {
      setSubmitted(true);
      const correct = questions.filter(
        (q, i) => q.correct === answers[i],
      ).length;
      const passed = correct >= Math.ceil(total * 0.6); // 60% проходной балл
      setShowResults(true);
      if (passed) {
        setTimeout(() => {
          onPass();
        }, 1500);
      }
    } else {
      setCurrent(current + 1);
    }
  };

  const question = questions[current];
  const selected = answers[current];
  const isAnswered = selected !== undefined;

  if (showResults) {
    const correct = questions.filter((q, i) => q.correct === answers[i]).length;
    const passed = correct >= Math.ceil(total * 0.6);
    return (
      <div className={cls.overlay}>
        <div className={cls.modal}>
          <div className={cls.results}>
            <h2 className={passed ? cls.passed : cls.failed}>
              {passed ? "🎉 Тест пройден!" : "😢 Тест не пройден"}
            </h2>
            <div className={cls.score}>
              {correct} / {total}
            </div>
            <p>Правильных ответов: {correct}</p>
            <p>
              Требуется: {Math.ceil(total * 0.6)} из {total}
            </p>
            {passed ? (
              <button className={cls.btnPrimary} onClick={onPass}>
                ✅ Получить награду
              </button>
            ) : (
              <button className={cls.btnSecondary} onClick={onClose}>
                Попробовать позже
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cls.overlay}>
      <div className={cls.modal}>
        <div className={cls.title}>📝 Тест: {courseName}</div>
        <div className={cls.subtitle}>
          Вопрос {current + 1} из {total} • {Math.ceil(total * 0.6)} правильных
          для зачёта
        </div>

        <div className={cls.progressBar}>
          <div
            className={cls.progressFill}
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>

        <div className={cls.questionBlock}>
          <div className={cls.questionText}>{question.question}</div>
          <div className={cls.options}>
            {question.options.map((opt: any, idx: any) => {
              let className = cls.option;
              if (submitted) className += ` ${cls.disabled}`;
              if (selected === idx) className += ` ${cls.selected}`;
              return (
                <div
                  key={idx}
                  className={className}
                  onClick={() => handleSelect(idx)}
                >
                  <input
                    type="radio"
                    name={`q${current}`}
                    checked={selected === idx}
                    onChange={() => {}}
                    disabled={submitted}
                  />
                  <label>{opt}</label>
                </div>
              );
            })}
          </div>
        </div>

        <div className={cls.actions}>
          <button
            className={cls.btnPrimary}
            onClick={handleNext}
            disabled={!isAnswered}
          >
            {isLast ? "📤 Завершить" : "➡️ Далее"}
          </button>
          <button className={cls.btnSecondary} onClick={onClose}>
            ✕ Выйти
          </button>
        </div>
      </div>
    </div>
  );
};
