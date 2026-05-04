import React, { useEffect, useState } from 'react'
import cls from './previewCourse.module.css'
import { Title } from '../../components/UI/Title'
import { Button } from '../../components/UI/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { getData } from '../../services/api'
import arrow from '../../assets/arrow.svg'
interface Course {
  id: number
  name: string
  difficult: string
  pages: number
}

export const PreviewCourse = () => {
    const navigate = useNavigate()
    const [course, setCourse] = useState<Course[] | null>(null);
    const { id } = useParams();
      useEffect(() => {
          getData(`http://localhost:3000/courses/${id}`)
              .then(response => {
                  setCourse(response.data) 
              })
              .catch(error => console.error(error))
      }, [])
  return (
    <div className={cls.PreviewCourse}>
        <div className={cls.hero}>
            <Title children={course?.name} color='green' size='large' level='h1'/>
            <Button children='Начать' animation size='large' onClick={() => navigate('/course')}/>
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
