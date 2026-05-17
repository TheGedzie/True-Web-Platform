// Ипорты
import cls from './Profile.module.css'
import type { IUser } from '../../types'
import { useEffect, useState } from 'react'
import { fetchUser, patchUser, updateUserLevel } from '../../services/UsersService'
import { calculateNewLevel } from '../../utils/userXpUtils'
import { Button } from '../../components/UI/Button'
import { Title } from '../../components/UI/Title'
import { Error } from '../../components/UI/Error'

export const Profile = () => {
  // Состояние для пользователя
  const [user, setUser] = useState<IUser | null>(null)
  // Состояние для проаверки проходит ли изменение
  const [isEditing, setIsEditing] = useState(false)
  // Состояние для обновленного пользователя
  const [editedUser, setEditedUser] = useState<IUser | null>(null)

  
  const loadUser = async () => {
    try {
      const response = await fetchUser()
      setUser(response)
      setEditedUser(response)
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error)
  }
}
  // Получение данных с сервера
  useEffect(() => {
    loadUser()
  }, [])
  const { level, totalXP, xpToNextLevel, xpRequiredForNextLevel } = calculateNewLevel(Number(user?.level), Number(user?.totalXP))
  // Обновляем уровень пользователя, если уровни отличаются
  useEffect(() => {
    const syncLevel = async () => {
      if (user) {
        const updatedUser = await updateUserLevel(user)
        if (updatedUser.level !== user.level) {
          setUser(updatedUser)
        }
      }
    }
    syncLevel()
  }, [user?.totalXP])
  // Функция сохранения измененого пользователя
const handleSave = async () => {
  if (!editedUser) return
  
  // Отправляем только то, что можно менять
  const updateData = {
    username: editedUser.username,
    fullName: editedUser.fullName,
    email: editedUser.email,
    bio: editedUser.bio,
    avatar: editedUser.avatar,
    social: editedUser.social,
    settings: editedUser.settings
  }
  
  try {
    await patchUser(updateData)
    setUser(editedUser)
    setIsEditing(false)
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  }
}
  // Функция проверки изменения данных 
  const handleChange = (field: string, value: any) => {
    setEditedUser(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleSocialChange = (platform: string, value: string) => {
    setEditedUser(prev => prev ? {
      ...prev,
      social: { ...prev.social, [platform]: value }
    } : null)
  }
  if (!user) return <Error children='⚠️ Ошибка загрузки профиля' />

  return (
    <div className={cls.profile}>
      {/* Фоновый декоративный элемент */}
      <div className={cls.backgroundGlow}></div>
      
      <div className={cls.header}>
        <Title level="h1" size="large" color="white">Профиль игрока</Title>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
        )}
      </div>

      <div className={cls.content}>
        {/* Карточка пользователя */}
        <div className={cls.characterCard}>
          <div className={cls.avatarSection}>
            <div className={cls.avatarBorder}>
              <img src={user.avatar} alt={user.username} className={cls.avatar} />
            </div>
            {isEditing && (
              <input
                type="text"
                value={editedUser?.avatar || ''}
                onChange={(e) => handleChange('avatar', e.target.value)}
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
                <div className={cls.xpFill} style={{ width: `${30}%` }}></div>
              </div>
              <div className={cls.xpText}>
                <span>🔰 {totalXP} / {xpRequiredForNextLevel} XP</span>
                <span>{xpToNextLevel} XP до лвла {level + 1}</span>
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
                  value={editedUser?.username || ''}
                  onChange={(e) => handleChange('username', e.target.value)}
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
                  value={editedUser?.fullName || ''}
                  onChange={(e) => handleChange('fullName', e.target.value)}
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
                  value={editedUser?.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
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
                  value={editedUser?.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className={cls.textarea}
                  rows={3}
                />
              ) : (
                <p className={cls.statValue}>{user.bio}</p>
              )}
            </div>

            <div className={cls.statItem}>
              <label>⚡ Навыки</label>
                <div className={cls.skills}>
                  {user.skills.map(skill => (
                    <span key={skill} className={cls.skill}>⚡ {skill}</span>
                  ))}
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
                  value={editedUser?.social.github || ''}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                  className={cls.input}
                />
              ) : (
                <a href={user.social.github} target="_blank" className={cls.socialLink}>GitHub профиль →</a>
              )}
            </div>

            <div className={cls.statItem}>
              <label>📱 Telegram</label>
              {isEditing ? (
                <input
                  value={editedUser?.social.telegram || ''}
                  onChange={(e) => handleSocialChange('telegram', e.target.value)}
                  className={cls.input}
                />
              ) : (
                <span className={cls.statValue}>{user.social.telegram}</span>
              )}
            </div>

            <div className={cls.statItem}>
              <label>🌐 Веб-сайт</label>
              {isEditing ? (
                <input
                  value={editedUser?.social.website || ''}
                  onChange={(e) => handleSocialChange('website', e.target.value)}
                  className={cls.input}
                />
              ) : (
                <a href={user.social.website} target="_blank" className={cls.socialLink}>Посетить сайт →</a>
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
                <div className={cls.achievementValue}>{user.completedCourses.length}</div>
              </div>
            </div>
            <div className={cls.achievement}>
              <span className={cls.achievementIcon}>⭐</span>
              <div>
                <div className={cls.achievementTitle}>Всего XP</div>
                <div className={cls.achievementValue}>{user.totalXP}</div>
              </div>
            </div>
            <div className={cls.achievement}>
              <span className={cls.achievementIcon}>📅</span>
              <div>
                <div className={cls.achievementTitle}>В игре с</div>
                <div className={cls.achievementValue}>{new Date(user.registrationDate).toLocaleDateString('ru-RU')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки сохранения */}
        {isEditing && (
          <div className={cls.actions}>
            <Button onClick={handleSave}>💾 Сохранить изменения</Button>
            <Button onClick={() => {
              setEditedUser(user)
              setIsEditing(false)
            }}>❌ Отмена</Button>
          </div>
        )}
      </div>
    </div>
  )
}