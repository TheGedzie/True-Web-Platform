import { useEffect, useState } from 'react'
import {getData} from '../../services/api'
import cls from './Education.module.css'
import mascotte from '../../assets/mascotte.svg'
import { Title } from '../../components/UI/Title'
import { HomeCourseCard } from '../../components/UI/HomeCourseCard'
import { ProgressBar } from '../../components/UI/ProgressBar'
import { Button } from '../../components/UI/Button'
import { Modal } from '../../components/UI/Modal'
import { useNavigate } from 'react-router-dom'
import { AsideMenu } from '../../components/UI/AsideMenu'

const testData = {
  userName: "TheGedzie",
}
interface Course {
  id: number
  name: string
  difficult: string
  pages: number
}

export const Education = () => {

  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const currentProgress : number = 1;
  const totalProgress : number = 3;
  const [state, setState] = useState(currentProgress);
  const isProgressComplete : boolean = state === totalProgress;
  
  useEffect(() => {
      getData('http://localhost:3000/courses')
          .then(response => {
              setCourses(response.data) 
          })
          .catch(error => console.error(error))
  }, [])
  return (

    <div className={cls.education}>
      <AsideMenu />
      {isProgressComplete && <Modal XP={800} Name='TheGedzie' Course='React' isOpen/>}
      <div className={cls.helloUser}>
        <span>WELCOME,<br />{testData.userName}</span>
        <img src={mascotte} alt="masscotte robot" />
      </div>
      <div className={cls.courseWrapper}>
        { 
          courses!=null ? (
            courses.map(course => {
              let color : string = course.name;
              if(color === "HTML | CSS") color = 'orange';
              else if(color === 'JS') color = 'yellow';
              else color = 'blue';
             return (
                <div className={cls.course}>
                  <Title children={`${course.name}`} level={"h3"} size='large' color='white'/>
                  <HomeCourseCard children={`${course.name}`} color ={`${color}`} onClick={() => {
                    console.log(course.id)
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
        <ProgressBar currentProgress={state} totalProgress={totalProgress}/>
        <Button children={"Завершить"} size='large' animation={false}  onClick={() => {
          if(state < totalProgress){
            setState(state + 1)
          }
        }}/>
      </div>
    </div>
  )
}
