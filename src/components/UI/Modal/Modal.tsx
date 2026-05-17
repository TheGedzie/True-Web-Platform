// Modal.tsx
import cls from './Modal.module.css'
import mascotte from '../../../assets/mascotte.svg'
import { Button } from '../Button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface IModal {
  isOpen: boolean
  Name: string
  XP: number
  Course: string
  onClose: () => void  
  redirect?: boolean
  navigates?: string

}

export const Modal = ({ isOpen, Name, XP, Course, onClose, redirect, navigates }: IModal) => {
  if (!isOpen) return null
  const navigate = useNavigate()

  return (
    <div className={cls.modal}>
      <div className={cls.modalContent}>
        <div className={cls.modalTop}>
          <p className={cls.modalText}>
            Поздравляю {Name}, <br />
            Вы прошли курс: <br /> {Course}
          </p>
          <img src={mascotte} alt="robot mascotte" />
        </div>
        <div className={cls.modalBottom}>
          <span>Вам будет начислено {XP} XP</span>
          <Button animation onClick={() => {
            onClose()
            if(redirect === true){
              navigate(`${navigates}`)
            }
          }}>
            Принять
          </Button>
        </div>
      </div>
    </div>
  )
}