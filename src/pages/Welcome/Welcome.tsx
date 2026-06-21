import cls from "./Welcome.module.css";
import type { ICourse, IUser } from "../../types/index";
import { useEffect, useState } from "react";
import { patchUser } from "../../services/UsersService";
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "../../services/CourseService";
import { fetchUser } from "../../services/UsersService";
import { Title } from "../../components/UI/Title";
import { HomeCourseCard } from "../../components/UI/HomeCourseCard";
import { ProgressBar } from "../../components/UI/ProgressBar";
import { Button } from "../../components/UI/Button";
import { Modal } from "../../components/UI/Modal";
import { AsideMenu } from "../../components/UI/AsideMenu";
import mascotte from "../../assets/mascotte.svg";

export const Welcome = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<ICourse[] | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [currentProgress, setCurrentProgress] = useState<number | null>(null);

  useEffect(() => {
    fetchUser().then(setUser);
    fetchCourses().then(setCourses);
  }, []);

  useEffect(() => {
    if (user) {
      setCurrentProgress(user.completedCourses.length);
    }
  }, [user]);

  const setClaimReward = async () => {
    try {
      const data = await patchUser({ rewardClaimed: true });
      setUser(data);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const totalProgress = courses?.length || 0;
  const canClaimReward =
    currentProgress === totalProgress &&
    !user?.rewardClaimed &&
    totalProgress > 0;

  // Разделяем курсы: вводные (первые 3) и основные (остальные)
  const introCourses = courses?.slice(0, 3) || [];
  const mainCourses = courses?.slice(3) || [];

  return (
    <div className={cls.education}>
      <AsideMenu />

      {canClaimReward && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          XP={800}
          Name={user?.username || "Игрок"}
          Course="Все курсы"
          type="courseComplete"
        />
      )}

      <div className={cls.helloUser}>
        <span>
          WELCOME,
          <br />
          {user?.username || "Гость"}
        </span>
        <img src={mascotte} alt="mascotte robot" className={cls.mascotte} />
      </div>

      {/* Вводные курсы */}
      <div className={cls.sectionHeader}>
        <span className={cls.sectionLine} />
        <h2 className={cls.sectionTitle}>Вводные курсы</h2>
        <span className={cls.sectionLine} />
      </div>

      <div className={cls.courseWrapper}>
        {introCourses.map((course) => (
          <div className={cls.course} key={course.id}>
            <Title level="h3" size="large" color="white">
              {course.name}
            </Title>
            <HomeCourseCard
              children={course.shortcut}
              color={course.color}
              onClick={() => navigate(`/education/${course.id}`)}
            />
          </div>
        ))}
      </div>

      {/* Основные курсы */}
      <div className={cls.sectionHeader}>
        <span className={cls.sectionLine} />
        <h2 className={cls.sectionTitle}>Основные курсы</h2>
        <span className={cls.sectionLine} />
      </div>

      <div className={cls.courseWrapper}>
        {mainCourses.map((course) => (
          <div className={cls.course} key={course.id}>
            <Title level="h3" size="large" color="white">
              {course.name}
            </Title>
            <HomeCourseCard
              children={course.shortcut}
              color={course.color}
              onClick={() => navigate(`/education/${course.id}`)}
            />
          </div>
        ))}
      </div>

      <div className={cls.progressBarAndBtn}>
        <ProgressBar
          currentProgress={currentProgress ?? 0}
          totalProgress={totalProgress}
        />
        <Button
          children={canClaimReward ? "Завершить" : "Награда получена"}
          size="large"
          animation={false}
          disabled={!canClaimReward}
          onClick={() => {
            if (canClaimReward) {
              setOpen(true);
              setClaimReward();
            }
          }}
        />
      </div>
    </div>
  );
};
