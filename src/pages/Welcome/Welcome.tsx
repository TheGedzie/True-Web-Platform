//Импорты

import cls from './Welcome.module.css'
import type { ICourse, IUser } from '../../types/index'
import { useEffect, useState } from 'react'
import { patchUser } from '../../services/UsersService'
import { useNavigate } from 'react-router-dom'
import { fetchCourses } from '../../services/CourseService'
import { fetchUser } from '../../services/UsersService'
import { Title } from '../../components/UI/Title'
import { HomeCourseCard } from '../../components/UI/HomeCourseCard'
import { ProgressBar } from '../../components/UI/ProgressBar'
import { Button } from '../../components/UI/Button'
import { Modal } from '../../components/UI/Modal'
import { AsideMenu } from '../../components/UI/AsideMenu'
import { Error } from '../../components/UI/Error'
import mascotte from '../../assets/mascotte.svg'



export const Welcome = () => {
  // Хук для роутинга 
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false)
  // Состояние для массива курсов
  const [courses, setCourses] = useState<ICourse[] | null>(null);
  // Состояние для массива пользователей
  const [user, setUsers] = useState<IUser | null>(null)
  // Состояние для хранения количества пройденных курсов
  const [currentProgress, setCurrentProgress] = useState<number | null>(null);
  // Имя пользователя, пока что статичное
  const userName : string | null = user != null ? user.username : null
  // Используется для максимального прогресса в progressBar
  const totalProgress : number | null = courses != null ? courses.length : null 
  
  // Получаем данные 
  useEffect(() => {
    fetchUser().then(setUsers);
    fetchCourses().then(setCourses);
  }, []);

  // Отслеживаем пользообновления пользователя и считываем сколько курсов он прошел 
  useEffect(() => {
    if (user != null) {
      setCurrentProgress(user?.completedCourses.length);
    }
  }, [user]);
  // Функция для обновления пользователя
  const setClaimReward = async() => {
    try {
      const data = await patchUser({
        rewardClaimed : true 
      })
      setUsers(data)
    } catch (error) {
      <Error children='Не удалось получить награду !'/>
    }
  }
  // Проверяем пройдены ли все курсы из доступных 
  const isProgressComplete : boolean = currentProgress === totalProgress;
  // Вычисляем disabled
  const disabled : boolean = currentProgress !== totalProgress
  // Проверяем забрал ли пользователь награду
  const canClaimReward = user?.completedCourses.length === totalProgress && !user?.rewardClaimed
  return (
    <div className={cls.education}>
      <AsideMenu />
      {isProgressComplete && <Modal XP={800} Name='TheGedzie' Course='React' isOpen={open} onClose={() => setOpen(false)}/>}
      <div className={cls.helloUser}>
        <span>WELCOME,<br />{userName}</span>
        <img src={mascotte} alt="masscotte robot" />
      </div>
      <div className={cls.courseWrapper}>
        { 
          courses!=null ? (
            courses.map(course => {
             return (
                <div className={cls.course} key={course.id}>
                  <Title children={`${course.name}`} level={"h3"} size='large' color='white'/>
                  <HomeCourseCard children={`${course.shortcut}`} color={`${course.color}`} onClick={() => {
                    navigate(`/education/${course.id}`)
                  }}/>
              </div>
             )
            })
          ) : (
             <div>Загрузка...</div>
          )
        }
      </div>
      <div className={cls.progressBarAndBtn}>
        <ProgressBar currentProgress={currentProgress != null ? currentProgress : 0} totalProgress={totalProgress != null ? totalProgress : 5}/>
        <Button children={canClaimReward ? "Завершить" : "Награда уже получена !"} size='large' animation={false} disabled={!canClaimReward}  onClick={() => {
          if(canClaimReward){
            setOpen(true)
            setClaimReward()
          }else{
          }
        }}/>
      </div>
    </div>
  )
}
