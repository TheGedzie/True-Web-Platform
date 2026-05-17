import React, { useCallback, useEffect, useState } from 'react';
import { getData } from '../../services/api';
import { Title } from '../../components/UI/Title';
import { Button } from '../../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import cls from './Challenges.module.css';
import type { IChallenge } from '../../types';
import { fetchChellenges } from '../../services/ChellengeService';

interface UserProgress {
  completedChallenges: number[];
}

export const Challenges = () => {
  const [challenges, setChallenges] = useState<IChallenge[]>([]);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

const loadChallenges = useCallback(async () => {
  try {
    setLoading(true);
    const challengesRes = await fetchChellenges(); // ← убрал Promise.all
    setChallenges(challengesRes || []); // ← убрал .data
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!mounted) return;
      await loadChallenges();
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [loadChallenges]);

  const getDifficultyColor = (difficulty: IChallenge['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return '#59FD7C';
      case 'medium':
        return '#FDEA59';
      case 'hard':
        return '#FD595C';
      default:
        return '#59D9FD';
    }
  };

  const getDifficultyIcon = (difficulty: IChallenge['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'hard':
        return '🔴';
      default:
        return '🔵';
    }
  };

  if (loading) {
    return (
      <div className={cls.loading}>
        🎮 Загрузка испытаний...
      </div>
    );
  }

  if (!challenges.length) {
    return (
      <div className={cls.loading}>
        Пока нет доступных испытаний 😢
      </div>
    );
  }

  return (
    <div className={cls.challenges}>
      <div className={cls.header}>
        <Title level="h1" size="large" color="white">
          ⚔️ Испытания
        </Title>

        <p className={cls.subtitle}>
          Прокачай навыки, решая задачи
        </p>
      </div>

      <div className={cls.stats}>
        <div className={cls.statCard}>
          <span className={cls.statIcon}>🏆</span>
          <div>
            <div className={cls.statValue}>
              {completedIds.length}
            </div>
            <div className={cls.statLabel}>
              Выполнено
            </div>
          </div>
        </div>

        <div className={cls.statCard}>
          <span className={cls.statIcon}>⭐</span>
          <div>
            <div className={cls.statValue}>
              {challenges.length}
            </div>
            <div className={cls.statLabel}>
              Всего задач
            </div>
          </div>
        </div>
      </div>

      <div className={cls.challengesGrid}>
        {challenges.map((challenge) => {
          const isCompleted = completedIds.includes(challenge.id);

          return (
            <div
              key={challenge.id}
              className={`${cls.challengeCard} ${
                isCompleted ? cls.completed : ''
              }`}
              onClick={() =>
                navigate(`/challenge/${challenge.id}`)
              }
            >
              <div className={cls.cardHeader}>
                <span
                  className={cls.difficulty}
                  style={{
                    color: getDifficultyColor(
                      challenge.difficulty
                    ),
                  }}
                >
                  {getDifficultyIcon(
                    challenge.difficulty
                  )}{' '}
                  {challenge.difficulty.toUpperCase()}
                </span>

                {isCompleted && (
                  <span className={cls.completedBadge}>
                    ✅ Выполнено
                  </span>
                )}
              </div>

              <h3 className={cls.challengeTitle}>
                {challenge.title}
              </h3>

              <p className={cls.challengeCategory}>
                📁 {challenge.category}
              </p>

              <p className={cls.challengeDesc}>
                {challenge.description}
              </p>

              <div className={cls.cardFooter}>
                <span className={cls.xpReward}>
                  ✨ +{challenge.xpReward} XP
                </span>

                <Button
                  size="small"
                  onClick={() => {
                    navigate(`/challenge/${challenge.id}`);
                  }}
                >
                  Начать →
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};