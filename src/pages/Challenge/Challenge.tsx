import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { getData } from "../../services/api";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { Button } from "../../components/UI/Button";
import { Title } from "../../components/UI/Title";
import cls from "./Challenge.module.css";
import type { IChallenge, IUser } from "../../types";
import {
  fetchChellenge,
  completeChallenge,
} from "../../services/ChellengeService";
import { runJsTests } from "../../utils/testRunner/testRunner";
import ParticleBackground from "../../components/ParticleBackgound/ParticleBackground";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut", delay: 0.1 },
  },
};

export const Challenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<IChallenge | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [userCode, setUserCode] = useState("");
  const [testResults, setTestResults] = useState<
    Array<{ passed: boolean; message: string }>
  >([]);
  const [showHints, setShowHints] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [userData, challengeData] = await Promise.all([
          getData("/users/1"),
          fetchChellenge(id),
        ]);
        setUser(userData);
        setChallenge(challengeData);
        setUserCode(challengeData.initialCode);

        const isAlreadyCompleted = userData.completedChallenges?.includes(
          Number(id),
        );
        setIsCompleted(isAlreadyCompleted || false);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const runTests = async () => {
    if (!challenge) return;

    const results = await runJsTests(userCode, challenge.testCases); // ← await
    setTestResults(results);

    console.log("🔍 Результаты тестов:", results);
    console.log(
      "🔍 Все пройдены?",
      results.every((r) => r.passed),
    );

    if (results.every((r) => r.passed) && !isCompleted) {
      handleChallengeComplete();
    }
  };

  // ✅ Переименовано, чтобы избежать конфликта с импортированной функцией
  const handleChallengeComplete = async () => {
    if (!user || !challenge) return;
    try {
      const response = await completeChallenge(user.id, Number(id));
      setIsCompleted(true);

      const updatedUser = await getData("/users/1");
      setUser(updatedUser);

      alert(`🎉 +${challenge.xpReward} XP!`);
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert("Вы уже выполнили это задание!");
      } else {
        console.error("Ошибка:", error);
        alert("Ошибка при сохранении");
      }
    }
  };

  if (loading) return <div className={cls.loading}>📖 Загрузка...</div>;
  if (!challenge) return <div className={cls.error}>⚠️ Не найдено</div>;

  return (
    <motion.div
      className={cls.challenge}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <ParticleBackground />

      <motion.div
        className={cls.header}
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <Button onClick={() => navigate("/challenges")}>← Назад</Button>
        <div className={cls.headerInfo}>
          <span
            className={cls.difficulty}
            style={{
              color:
                challenge.difficulty === "easy"
                  ? "#59FD7C"
                  : challenge.difficulty === "medium"
                    ? "#FDEA59"
                    : "#FD595C",
            }}
          >
            {challenge.difficulty.toUpperCase()}
          </span>
          <span className={cls.xpReward}>✨ +{challenge.xpReward} XP</span>
        </div>
      </motion.div>

      <motion.div
        className={cls.content}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={cls.leftPanel}>
          <div className={cls.description}>
            <Title level="h2" size="medium" color="white">
              {challenge.title}
            </Title>
            <p>{challenge.description}</p>
            <div className={cls.category}>📁 {challenge.category}</div>
          </div>

          <div className={cls.hints}>
            <div
              className={cls.hintsHeader}
              onClick={() => setShowHints(!showHints)}
            >
              <span>💡 Подсказки</span>
              <span>{showHints ? "▲" : "▼"}</span>
            </div>
            {showHints && (
              <ul>
                {challenge.hints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
            )}
          </div>

          <div className={cls.tests}>
            <h3>🧪 Тесты</h3>
            {testResults.map((r, i) => (
              <div
                key={i}
                className={`${cls.testResult} ${r.passed ? cls.passed : cls.failed}`}
              >
                {r.message}
              </div>
            ))}
            {testResults.length === 0 && (
              <div className={cls.noTests}>Нажми "Проверить"</div>
            )}
          </div>
        </div>

        <div className={cls.rightPanel}>
          <div className={cls.editorWrapper}>
            <div className={cls.editorHeader}>
              <span>✏️ Редактор</span>
              <Button size="small" onClick={runTests} disabled={isCompleted}>
                {isCompleted ? "✅ Выполнено" : "🧪 Проверить"}
              </Button>
            </div>
            <CodeEditor
              codeValue={userCode}
              onCodeChange={setUserCode}
              language={
                challenge.category === "JavaScript" ? "javascript" : "html"
              }
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
