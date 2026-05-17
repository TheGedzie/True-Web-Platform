import cls from './previewCourse.module.css'
import type { ICourse } from '../../types'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCourse } from '../../services/CourseService'
import { Title } from '../../components/UI/Title'
import { Button } from '../../components/UI/Button'
import arrow from '../../assets/arrow.svg'


export const PreviewCourse = () => {
    // Хук для роутинга 
    const navigate = useNavigate()
    // Получаем опциональный параметр id
    const { id } = useParams();
    // Состояние для массива курсов
    const [course, setCourse] = useState<ICourse | null>(null);
    // Получение курса по id 
    useEffect(() => {
        if(id){
            fetchCourse(id).then(setCourse)
        }
      },[id])

  return (
    <div className={cls.PreviewCourse}>
        <div className={cls.hero}>
            <Title children={course?.name} color='green' size='large' level='h1'/>
            <Button children='Начать' animation size='large' onClick={() => navigate(`/course/${id}`)}/>
            <img src={arrow} alt="arrow" className={cls.arrow}/>
        </div>
        <div className={cls.description}>
            <Title level='h2' size='medium' color='white'>{course?.name}</Title>
            <div className={cls.testVideo}>
                <span>video</span>
            </div>
            <p className={cls.descriptionText}>{course?.description}</p>
        </div>
       <div className={cls.intoCourse}>
        <Title color='white'>Что входит в курс</Title>
        <hr />
        {course?.intoCourse.map(contentInto => (  
            <p key={contentInto}>{contentInto}</p>
        ))}
        </div>
    </div>
  )
}
