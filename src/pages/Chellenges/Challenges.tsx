import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sword } from "lucide-react";
import cls from "./Challenges.module.css";
import type { IChallenge } from "../../types";
import { fetchChellenges } from "../../services/ChellengeService";
import { Title } from "../../components/UI/Title";
import { Button } from "../../components/UI/Button";
import ParticleBackground from "../../components/ParticleBackgound/ParticleBackground";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const Challenges = () => {
  const [challenges, setChallenges] = useState<IChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchChellenges();
        setChallenges(data || []);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "#59FD7C";
      case "medium":
        return "#FDEA59";
      case "hard":
        return "#FD595C";
      default:
        return "#59D9FD";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "🟢";
      case "medium":
        return "🟡";
      case "hard":
        return "🔴";
      default:
        return "🔵";
    }
  };

  if (loading) {
    return <div className={cls.loading}>🎮 Загрузка...</div>;
  }

  return (
    <motion.div
      className={cls.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ParticleBackground />

      <motion.div
        className={cls.heroContainer}
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={cls.titleContainer}>
          <Sword size={45} className={cls.icon} />
          <Title
            children="Испытания"
            color="white"
            size="large"
            customClass={cls.title}
          />
        </div>
        <span className={cls.description}>Прокачай навыки, решая задачи</span>
      </motion.div>

      <motion.div
        className={cls.grid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {challenges.length === 0 ? (
          <div className={cls.empty}>
            <p>Пока нет испытаний 😢</p>
          </div>
        ) : (
          challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              variants={itemVariants}
              className={cls.card}
              onClick={() => navigate(`/challenge/${challenge.id}`)}
            >
              <div className={cls.cardHeader}>
                <span
                  className={cls.difficulty}
                  style={{ color: getDifficultyColor(challenge.difficulty) }}
                >
                  {getDifficultyIcon(challenge.difficulty)}{" "}
                  {challenge.difficulty.toUpperCase()}
                </span>
                <span className={cls.xpBadge}>✨ +{challenge.xpReward} XP</span>
              </div>

              <h3 className={cls.cardTitle}>{challenge.title}</h3>
              <p className={cls.cardCategory}>📁 {challenge.category}</p>
              <p className={cls.cardDesc}>{challenge.description}</p>

              <div className={cls.cardFooter}>
                <span className={cls.language}>
                  {challenge.language === "javascript" ? "🟨 JS" : "🟦 HTML"}
                </span>
                <Button size="small">Начать →</Button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};
