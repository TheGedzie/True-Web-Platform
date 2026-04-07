import { useState } from 'react'
import cls from './Education.module.css'
import mascotte from '../../assets/mascotte.svg'
import { Title } from '../../components/UI/Title'
import { HomeCourseCard } from '../../components/UI/HomeCourseCard'
import { ProgressBar } from '../../components/UI/ProgressBar'
import { Button } from '../../components/UI/Button'
import { Modal } from '../../components/UI/Modal'

const testData = {
  userName: "TheGedzie",
}

export const Education = () => {
  const currentProgress = 1;
  const totalProgress = 3;
  const [state, setState] = useState(currentProgress);
  const isProgressComplete = state === totalProgress;
  return (
    <div className={cls.education}>
      {isProgressComplete && <Modal XP={800} Name='TheGedzie' Course='React' isOpen/>}
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
