// Импорты

import cls from './Course.module.css'
import type { ICourse, IUser } from '../../types'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCourse } from '../../services/CourseService'
import { fetchUser, patchUser } from '../../services/UsersService'
import CodeEditor from '../../components/CodeEditor/CodeEditor'
import { Button } from '../../components/UI/Button'
import { ProgressBar } from '../../components/UI/ProgressBar'
import { Modal } from '../../components/UI/Modal'

export const Course = () => {
  // Получаем опциональный параметр id
  const { id } = useParams()
  // Создание хука для навигации
  const navigate = useNavigate()
  // Состояние для курса
  const [course, setCourse] = useState<null | ICourse>(null)
  // Состояние пользователя
  const [user, setUser] = useState<null | IUser>(null)
  // Состояние для пагнинации
  const [currentPage, setCurrentPage] = useState<number>(0)
  // Состояние для модального окна
  const [open, setOpen] = useState<boolean>(false)
  
  // Вычисляем контент для текущей страницы
  const content = course?.content?.[currentPage]

  // Загрузка курса и пользователя
  useEffect(() => {
    fetchUser().then(setUser)
  }, [])

  useEffect(() => {
    if(id){
      fetchCourse(id).then(setCourse)
    }
  }, [id])

    const courseComplete = user?.completedCourses.includes(Number(id))
    
    // Открываем модалку когда дошли до последней страницы (только один раз)
    const totalPages = course?.content?.length || 0
    const isLastPage = currentPage === totalPages - 1
  

  // Обработчик нажатия "Вперёд"
  const handleNext = () => {
    if (course && currentPage < course.content.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Обработчик нажатия "Назад"
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }
  // Функция добавления пройденного курса в массив бекенд
  const handleComplete = async () => {
    try {
      const updatedUser = await patchUser({ courseId: Number(id) })
      setUser(updatedUser)
      setOpen(true)
    } catch (error) {
      console.error('Ошибка при завершении курса:', error)
      alert('Не удалось завершить курс')
    }
  }
  const currentPageNumber = currentPage + 1

  return (
    <>
      {courseComplete && (
        <h1>Вы уже прошли этот курс !</h1>
      )}
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
              navigate('/education')
            } else {
              handleComplete() 
            }
          } else {
            handleNext()
          }
        }}
        />
      </div>
      <Modal 
        isOpen={open}
        onClose={() => {setOpen(false)}}
        Name={'TheGedzie'} 
        XP={300} 
        Course={course?.name || 'Курс'}
        redirect = {true}
        navigates={'/education'}
      />

      <CodeEditor codeValue={content || 'Загрузка...'} />
    </>
  )
}