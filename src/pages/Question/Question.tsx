import { useEffect, useState } from "react";
import cls from "./Question.module.css";
import type { IQuestion, IUser } from "../../types";
import { fetchQuestion, patchQuestion } from "../../services/QuestionService";
import { fetchUser } from "../../services/UsersService";
import { useParams } from "react-router-dom";
import { Button } from "../../components/UI/Button";
import { Title } from "../../components/UI/Title";
import { Error } from "../../components/UI/Error";
import ava from "../../assets/images.jpg";
import { Modal } from "../../components/UI/Modal";
import { Eye, Calendar, MessageCircle, Send } from "lucide-react";
import ParticleBackground from "../../components/ParticleBackgound/ParticleBackground";
import { AsideMenu } from "../../components/UI/AsideMenu";

export const Question = () => {
  const [question, setQuestion] = useState<IQuestion | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [openError, setOpenError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const { id } = useParams();

  const sendAnswer = async () => {
    if (!answer.trim()) {
      alert("Введите ответ");
      return;
    }

    try {
      await patchQuestion(String(id), {
        answer: {
          content: answer,
          authorId: user?.id,
          authorName: user?.username,
          authorAvatar: user?.avatar,
        },
      });

      const updatedQuestion = await fetchQuestion(String(id));
      setQuestion(updatedQuestion);
      setAnswer("");
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrorText("Вы уже отвечали на этот вопрос");
        setOpenError(true);
        setTimeout(() => {
          setOpenError(false);
        }, 3000);
      } else if (error.response?.status === 403) {
        setErrorText("Вы являетесь автором вопроса");
        setOpenError(true);
        setTimeout(() => {
          setOpenError(false);
        }, 3000);
      }
    }
  };

  // Функция открытия модалки с выбранным ответом
  const handleOpenModal = (answerId: string) => {
    console.log("🟢 Кнопка нажата! answerId:", answerId);
    setSelectedAnswerId(answerId);
    setOpenModal(true);
  };

  // Функция получения лучшего комментария
  const setAnswerIsBest = async (questionId: string, answerId: string) => {
    console.log("📤 Отправляем запрос:", { questionId, answerId });
    try {
      await patchQuestion(String(questionId), {
        changeIsBeast: { idAnswer: answerId },
      });
      const updatedQuestion = await fetchQuestion(String(questionId));
      setQuestion(updatedQuestion);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuestion(id).then(setQuestion);
    }
  }, [id]);

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  if (!question) {
    return <div className={cls.loading}>Загрузка вопроса...</div>;
  }

  // Проверка на то, является ли залогиненый пользователь автором вопроса
  const isAuthor = question.authorId === user?.id;
  const hasBestAnswer = question.answers.some((elem) => elem.isBest === true);
  const formattedDate = new Date(question.createdAt).toLocaleDateString(
    "ru-RU",
  );

  return (
    <div className={cls.questionPage}>
      <AsideMenu />
      <ParticleBackground />
      {openError && <Error children={errorText} />}
      <div className={cls.questionPageContent}>
        {/* Карточка вопроса */}
        <div className={cls.questionCard}>
          <div className={cls.userInfo}>
            <img
              src={ava || question.authorAvatar}
              alt="avatar"
              className={cls.avatar}
            />
            <div className={cls.userMeta}>
              <Title
                children={question.authorName}
                size="medium"
                color="white"
                level="h3"
              />
              <span className={cls.date}>
                <Calendar size={15} className={cls.calendar} />
                {formattedDate}
              </span>
            </div>
            <div className={cls.viewsCount}>
              <Eye size={20} className={cls.eye} /> {question.views}
            </div>
          </div>

          <div className={cls.questionContent}>
            <Title
              children={question.title}
              size="large"
              color="green"
              level="h1"
            />
            <p className={cls.description}>{question.content}</p>
          </div>
        </div>

        {/* Форма ответа */}
        {!isAuthor && (
          <div className={cls.answerForm}>
            <div className={cls.answerTitle}>
              <MessageCircle className={cls.messageCircle} />
              <Title
                children="Ваш ответ"
                size="medium"
                color="white"
                level="h3"
              />
            </div>
            <textarea
              className={cls.answerInput}
              placeholder="Напишите свой ответ..."
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <Button
              customClass={cls.submitBtn}
              size="medium"
              type="submit"
              onClick={() => sendAnswer()}
            >
              <Send size={20} />
              Отправить
            </Button>
          </div>
        )}

        {/* Список ответов */}
        <div className={cls.answersSection}>
          <Title
            children={`Ответы (${question.answers?.length || 0})`}
            size="medium"
            color="white"
            level="h3"
          />

          {question.answers && question.answers.length > 0 ? (
            <div className={cls.answersList}>
              {question.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={`${cls.answerCard} ${answer.isBest ? cls.bestAnswer : ""}`}
                >
                  <div className={cls.answerHeader}>
                    <img
                      src={ava || answer.authorAvatar}
                      alt="avatar"
                      className={cls.answerAvatar}
                    />
                    <div className={cls.answerAuthor}>
                      <span className={cls.authorName}>
                        {answer.authorName}
                      </span>
                      <span className={cls.answerDate}>
                        <Calendar size={12} />
                        {new Date(answer.createdAt).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                    {answer.isBest && (
                      <span className={cls.bestBadge}>🏆 Лучший ответ</span>
                    )}
                    {!hasBestAnswer && isAuthor && (
                      <Button
                        children="Это лучший ответ"
                        size="small"
                        onClick={() => handleOpenModal(answer.id)}
                      />
                    )}
                  </div>
                  <p className={cls.answerContent}>{answer.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={cls.noAnswers}>
              {isAuthor
                ? "На ваш вопрос еще никто не ответил"
                : "Пока нет ответов. Будьте первым!"}
            </div>
          )}
        </div>

        {/* Модалка */}
        {openModal && (
          <Modal
            type="accept"
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            onAccept={() => {
              if (selectedAnswerId) {
                setAnswerIsBest(String(id), selectedAnswerId);
              }
              setOpenModal(false);
            }}
            acceptText="Вы уверены что хотите выдать пользователю лучший комментарий ?"
          />
        )}
      </div>
    </div>
  );
};
