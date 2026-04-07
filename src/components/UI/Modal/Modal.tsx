import cls from './Modal.module.css'
import mascotte from '../../../assets/mascotte.svg'
import { Button } from '../Button'
import React from 'react'

interface IModal {
  isOpen : boolean,
  Name: string,
  XP: number,
  Course: string
}

export const Modal = ({isOpen = true, Name, XP, Course} : IModal) => {
  const [open, setOpen] = React.useState(isOpen)

  if(!open) return null
  return (
    <div className={cls.modal}>
      <div className={cls.modalContent}>
          <div className={cls.modalTop}>
              <p className={cls.modalText}>Поздравляю {Name}, <br />Вы прошли курс: <br /> `{Course}`</p>
              <img src={mascotte} alt="robot mascotte" />
          </div>
          <div className={cls.modalBottom}>
            <span>Вам будет начислено {XP}XP</span>
            <Button 
            animation
            onClick={() => {
              setOpen(false)
            }}
            >Принять</Button>
          </div>
      </div>
    </div>
  )
}
