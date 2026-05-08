import React, { useEffect, useState } from 'react'
import cls from './Course.module.css'
import CodeEditor from '../../components/CodeEditor/CodeEditor'
import { getData } from '../../services/api'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/UI/Button'

interface Course {
  id: number
  name: string
  difficult: string
  pages: number
  content: string[]
}

export const Course = () => {
  const { id } = useParams()
  const [course, setCourse] = useState<null | Course>(null) 
  const [courseContent, setCourseContent] = useState<null | string>(null)
  const [paginationContent, setPaginationContent] = useState<number>(0)

  useEffect(() => {
    if (!id) return
    
    getData(`http://localhost:3000/courses/${id}`)
      .then(response => {
        setCourse(response.data)
      })
      .catch(error => console.error(error))
  }, [id])

  useEffect(() => {
    if (course?.content?.[paginationContent]) {
      setCourseContent(course.content[paginationContent])
    }
  }, [course])

  useEffect(() => {
    if (course?.content?.[paginationContent]) {
      setCourseContent(course.content[paginationContent])
    }
  }, [paginationContent, course])

  return (
    <>
      <CodeEditor codeValue={`<h1>${courseContent || ''}</h1>`}/>
      <div className={cls.buttonContainer}>
        <Button 
          children="⇦ Назад" 
          onClick={() => {
            if (paginationContent > 0) {
              setPaginationContent(paginationContent - 1)
              
            }
          }}
        />
        <Button 
          children="Вперёд ⇨" 
          onClick={() => {
            if (course && paginationContent < course.content.length - 1) {
              setPaginationContent(paginationContent + 1)
            }
          }}
        />
      </div>
    </>
  )
}