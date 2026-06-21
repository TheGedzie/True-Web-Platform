// Импорты
import cls from "./Course.module.css";
import type { ICourse, IUser } from "../../types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCourse } from "../../services/CourseService";
import { fetchUser, patchUser } from "../../services/UsersService";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { Button } from "../../components/UI/Button";
import { ProgressBar } from "../../components/UI/ProgressBar";
import { Modal } from "../../components/UI/Modal";
import { Quiz } from "../../components/UI/Quiz";

export const Course = () => {
  const XP: number = 50;
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<null | ICourse>(null);
  const [user, setUser] = useState<null | IUser>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // ✅ ТЕПЕРЬ ТЕСТ БЕРЁТСЯ ИЗ КУРСА (из database.json)
  const quiz = course?.quiz;

  const content = course?.content?.[currentPage];

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  useEffect(() => {
    if (id) {
      fetchCourse(id).then(setCourse);
    }
  }, [id]);

  const courseComplete = user?.completedCourses.includes(Number(id));
  const totalPages = course?.content?.length || 0;
  const isLastPage = currentPage === totalPages - 1;

  const handleNext = () => {
    if (course && currentPage < course.content.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ОСНОВНАЯ ФУНКЦИЯ ЗАВЕРШЕНИЯ — НАЧИСЛЕНИЕ XP
  const completeCourse = async () => {
    if (!user) return;

    console.log("📤 Отправляем запрос на завершение курса");
    console.log("📤 courseId:", Number(id));
    console.log("📤 Текущий user.totalXP:", user.totalXP);

    try {
      const updatedUser = await patchUser({
        courseId: Number(id),
      });
      console.log("✅ Ответ от сервера:", updatedUser);
      console.log("✅ Новый totalXP:", updatedUser.totalXP);
      setUser(updatedUser);
      setOpen(true);
    } catch (error: any) {
      console.error("❌ Ошибка:", error);
      if (error.response?.status === 400) {
        setOpen(true);
      } else {
        alert("Не удалось завершить курс");
      }
    }
  };

  // ОБРАБОТЧИК КНОПКИ "ЗАВЕРШИТЬ" — ЗАПУСКАЕТ ТЕСТ ИЛИ XP
  const handleCourseComplete = async () => {
    if (!user) return;

    // ✅ ТЕПЕРЬ ТЕСТ БЕРЁТСЯ ИЗ course.quiz
    if (quiz && !quizCompleted) {
      setShowQuiz(true); // открываем тест
    } else if (!quiz) {
      await completeCourse(); // сразу XP
    }
  };

  const handleQuizPass = async () => {
    setShowQuiz(false);
    setQuizCompleted(true);
    await completeCourse(); // XP после теста
  };

  const currentPageNumber = currentPage + 1;

  return (
    <>
      {courseComplete && <h1>Вы уже прошли этот курс !</h1>}
      <ProgressBar
        currentProgress={currentPageNumber}
        totalProgress={totalPages}
      />

      <div className={cls.buttonContainer}>
        <Button
          children="⇦ Назад"
          onClick={handlePrev}
          disabled={currentPage === 0}
        />
        <Button
          children={isLastPage ? "Завершить" : "Вперёд ⇨"}
          onClick={() => {
            if (isLastPage) {
              if (courseComplete) {
                navigate("/education");
              } else {
                handleCourseComplete();
              }
            } else {
              handleNext();
            }
          }}
        />
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        type="courseComplete"
        Name={user?.username}
        XP={XP}
        Course={course?.name || "Курс"}
        redirect={true}
        navigates={"/education"}
      />

      {/* ✅ КВИЗ БЕРЁТ ВОПРОСЫ ИЗ course.quiz */}
      {showQuiz && quiz && (
        <Quiz
          questions={quiz.questions || []}
          courseName={course?.name || "Курс"}
          onPass={handleQuizPass}
          onClose={() => setShowQuiz(false)}
        />
      )}

      <CodeEditor codeValue={content || "Загрузка..."} />
    </>
  );
};
