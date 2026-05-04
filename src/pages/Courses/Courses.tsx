import React from 'react'
import { useEffect, useState } from 'react'
import cls from './Courses.module.css'
import { getData } from '../../services/api'
import { Button } from '../../components/UI/Button'
import { Title } from '../../components/UI/Title'
import { HomeCourseCard } from '../../components/UI/HomeCourseCard'

export const Courses = () => {
    interface Course {
  id: number
  name: string
  difficult: string
  pages: number
}
    const [courses, setCourses] = useState<Course[] | null>(null)
    const [disabled, setDisabled] = useState(false)
      useEffect(() => {
          getData('http://localhost:3000/courses')
              .then(response => {
                  setCourses(response.data) 
              })
              .catch(error => console.error(error))
      }, [])
      console.log(courses)
    let [pagination, setPagination] = useState(3)
    const displayedCourses = courses ? courses.slice(0, pagination) : []

  return (
    <>
        <div className={cls.courses}>
        { 
          displayedCourses!=null ? (
            displayedCourses.map(course => {
              let color : string = course.name;
              if(color === "HTML | CSS") color = 'orange';
              else if(color === 'JS') color = 'yellow';
              else color = 'blue';
             return (
                <div className={cls.course}>
                  <Title children={`${course.name}`} level={"h3"} size='large' color='white'/>
                  <HomeCourseCard children={`${course.name}`} onClick={() => {
                    console.log(course.id)
                  }}/>
              </div>
             )
            })
          ) : (
             <div>Загрузка...</div>
          )
        }
            <Button children="Загрузить еще" disabled = {disabled} onClick={() => {
                if (courses!=null&& pagination < courses.length){
                    setPagination(pagination + 3)
                    console.log(pagination)
                }
                else{
                    setDisabled(true)
                }
            }}/>
        </div>
    </>
  )
}
