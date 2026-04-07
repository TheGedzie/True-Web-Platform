import React from 'react'
import cls from './Education.module.css'
import mascotte from '../../assets/mascotte.svg'
import { Title } from '../../components/UI/Title'
import { HomeCourseCard } from '../../components/UI/HomeCourseCard'
import { ProgressBar } from '../../components/UI/ProgressBar'
import { Button } from '../../components/UI/Button'

const testData = {
  userName: "TheGedzie",
}

export const Education = () => {
  return (
    <div className={cls.education}>
      <div className={cls.helloUser}>
        <span>WELCOME,<br />{testData.userName}</span>
        <img src={mascotte} alt="masscotte robot" />
      </div>
      <div className={cls.courseWrapper}>
        <div className={cls.course}>
          <Title children={"ОСНОВЫ WEB"} level={"h3"} size='large' color='white'/>
          <HomeCourseCard children={"WEB"}/>
        </div>
        <div className={cls.course}>
          <Title children={"ОСНОВЫ ВЕРСТКИ"} level={"h3"} size='large' color='white'/>
          <HomeCourseCard children={"HTML | CSS"} color='orange'/>
        </div>
        <div className={cls.course}>
          <Title children={"ОСНОВЫ JS"} level={"h3"} size='large' color='white'/>
          <HomeCourseCard children={"JS"} color='yellow'/>
        </div>
      </div>
      <div className={cls.progressBarAndBtn}>
        <ProgressBar currentProgress={1} totalProgress={3}/>
        <Button children={"Завершить"} size='large' animation={false} disabled/>
      </div>
    </div>
  )
}
