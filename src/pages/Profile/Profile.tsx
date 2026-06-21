// Импорты
import cls from "./Profile.module.css";
import type { IUser } from "../../types";
import { useEffect, useState } from "react";
import { fetchUser, patchUser } from "../../services/UsersService";
import { calculateNewLevel } from "../../utils/userXpUtils";
import { Button } from "../../components/UI/Button";
import { Title } from "../../components/UI/Title";
import { Error } from "../../components/UI/Error";
import ParticleBackground from "../../components/ParticleBackgound/ParticleBackground";

export const Profile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const response = await fetchUser();
      setUser(response);
      setEditedUser(response);
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const { level, totalXP, xpToNextLevel, xpRequiredForNextLevel } =
    calculateNewLevel(Number(user?.level), Number(user?.totalXP));

  // Автосинхронизация уровня
  useEffect(() => {
    const syncLevel = async () => {
      if (user) {
        const updatedUser = await patchUser({
          level: level,
          totalXP: totalXP,
        });
        if (updatedUser.level !== user.level) {
          setUser(updatedUser);
          setEditedUser(updatedUser);
        }
      }
    };
    syncLevel();
  }, [user?.totalXP]);

  const handleSave = async () => {
    if (!editedUser) return;

    const updateData = {
      username: editedUser.username,
      fullName: editedUser.fullName,
      email: editedUser.email,
      bio: editedUser.bio,
      avatar: editedUser.avatar,
      social: editedUser.social,
      settings: editedUser.settings,
    };

    try {
      const updatedUser = await patchUser(updateData);
      setUser(updatedUser);
      setEditedUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Не удалось сохранить изменения");
    }
  };

  const handleChange = (field: string, value: any) => {
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setEditedUser((prev) =>
      prev
        ? {
            ...prev,
            social: { ...prev.social, [platform]: value },
          }
        : null,
    );
  };

  if (loading) {
    return <div className={cls.loading}>Загрузка профиля...</div>;
  }

  if (!user) {
    return <Error children="⚠️ Ошибка загрузки профиля" />;
  }

  const progressPercent =
    xpRequiredForNextLevel > 0 ? (totalXP / xpRequiredForNextLevel) * 100 : 0;

  const registrationDate = new Date(user.registrationDate).toLocaleDateString(
    "ru-RU",
  );

  return (
    <div className={cls.profile}>
      <ParticleBackground />

      <div className={cls.header}>
        <div className={cls.titleIcon}></div>
        <Title level="h1" size="large" color="white">
          Профиль игрока
        </Title>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>✏️ Редактировать</Button>
        )}
      </div>

      <div className={cls.content}>
        {/* Карточка персонажа */}
        <div className={cls.characterCard}>
          <div className={cls.avatarSection}>
            <div className={cls.avatarBorder}>
              <img
                src={user.avatar || "/avatars/default.png"}
                alt={user.username}
                className={cls.avatar}
              />
            </div>
            {isEditing && (
              <input
                type="text"
                value={editedUser?.avatar || ""}
                onChange={(e) => handleChange("avatar", e.target.value)}
                placeholder="URL аватара"
                className={cls.input}
              />
            )}
          </div>

          <div className={cls.levelInfo}>
            <div className={cls.levelBadge}>
              <span className={cls.levelIcon}>⚔️</span>
              <span className={cls.levelNumber}>LVL {level}</span>
            </div>
            <div className={cls.xpBarContainer}>
              <div className={cls.xpBar}>
                <div
                  className={cls.xpFill}
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
              <div className={cls.xpText}>
                <span>
                  🔰 {totalXP} / {xpRequiredForNextLevel} XP
                </span>
                <span>
                  ✨ {xpToNextLevel} XP до LVL {level + 1}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Основная информация */}
        <div className={cls.statCard}>
          <div className={cls.cardHeader}>
            <span className={cls.cardIcon}>📜</span>
            <h3>Основные характеристики</h3>
          </div>

          <div className={cls.statsGrid}>
            <div className={cls.statItem}>
              <label>👤 Имя персонажа</label>
              {isEditing ? (
                <input
                  value={editedUser?.username || ""}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className={cls.input}
                />
              ) : (
                <span className={cls.statValue}>@{user.username}</span>
              )}
            </div>

            <div className={cls.statItem}>
              <label>📛 Полное имя</label>
              {isEditing ? (
                <input
                  value={editedUser?.fullName || ""}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className={cls.input}
                />
              ) : (
                <span className={cls.statValue}>{user.fullName}</span>
              )}
            </div>

            <div className={cls.statItem}>
              <label>📧 Email</label>
              {isEditing ? (
                <input
                  value={editedUser?.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={cls.input}
                />
              ) : (
                <span className={cls.statValue}>{user.email}</span>
              )}
            </div>

            <div className={cls.statItem}>
              <label>💬 Биография</label>
              {isEditing ? (
                <textarea
                  value={editedUser?.bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className={cls.textarea}
                  rows={3}
                />
              ) : (
                <p className={cls.statValue}>
                  {user.bio || "Пока ничего не рассказал о себе"}
                </p>
              )}
            </div>

            <div className={cls.statItem}>
              <label>⚡ Навыки</label>
              <div className={cls.skills}>
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <span key={skill} className={cls.skill}>
                      ⚡ {skill}
                    </span>
                  ))
                ) : (
                  <span className={cls.statValue}>Навыки ещё не освоены</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Социальные связи */}
        <div className={cls.statCard}>
          <div className={cls.cardHeader}>
            <span className={cls.cardIcon}>🔗</span>
            <h3>Социальные связи</h3>
          </div>

          <div className={cls.statsGrid}>
            <div className={cls.statItem}>
              <label>🐙 GitHub</label>
              {isEditing ? (
                <input
                  value={editedUser?.social?.github || ""}
                  onChange={(e) => handleSocialChange("github", e.target.value)}
                  className={cls.input}
                />
              ) : user.social?.github ? (
                <a
                  href={user.social.github}
                  target="_blank"
                  className={cls.socialLink}
                >
                  GitHub профиль →
                </a>
              ) : (
                <span className={cls.statValue}>Не указан</span>
              )}
            </div>

            <div className={cls.statItem}>
              <label>📱 Telegram</label>
              {isEditing ? (
                <input
                  value={editedUser?.social?.telegram || ""}
                  onChange={(e) =>
                    handleSocialChange("telegram", e.target.value)
                  }
                  className={cls.input}
                />
              ) : (
                <span className={cls.statValue}>
                  {user.social?.telegram || "Не указан"}
                </span>
              )}
            </div>

            <div className={cls.statItem}>
              <label>🌐 Веб-сайт</label>
              {isEditing ? (
                <input
                  value={editedUser?.social?.website || ""}
                  onChange={(e) =>
                    handleSocialChange("website", e.target.value)
                  }
                  className={cls.input}
                />
              ) : user.social?.website ? (
                <a
                  href={user.social.website}
                  target="_blank"
                  className={cls.socialLink}
                >
                  Посетить сайт →
                </a>
              ) : (
                <span className={cls.statValue}>Не указан</span>
              )}
            </div>
          </div>
        </div>

        {/* Достижения */}
        <div className={cls.statCard}>
          <div className={cls.cardHeader}>
            <span className={cls.cardIcon}>🏆</span>
            <h3>Достижения</h3>
          </div>

          <div className={cls.achievements}>
            <div className={cls.achievement}>
              <span className={cls.achievementIcon}>📚</span>
              <div>
                <div className={cls.achievementTitle}>Пройдено курсов</div>
                <div className={cls.achievementValue}>
                  {user.completedCourses?.length || 0}
                </div>
              </div>
            </div>
            <div className={cls.achievement}>
              <span className={cls.achievementIcon}>⭐</span>
              <div>
                <div className={cls.achievementTitle}>Всего XP</div>
                <div className={cls.achievementValue}>{user.totalXP || 0}</div>
              </div>
            </div>
            <div className={cls.achievement}>
              <span className={cls.achievementIcon}>📅</span>
              <div>
                <div className={cls.achievementTitle}>В игре с</div>
                <div className={cls.achievementValue}>{registrationDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки сохранения */}
        {isEditing && (
          <div className={cls.actions}>
            <Button onClick={handleSave}>💾 Сохранить</Button>
            <Button
              onClick={() => {
                setEditedUser(user);
                setIsEditing(false);
              }}
            >
              ❌ Отмена
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
