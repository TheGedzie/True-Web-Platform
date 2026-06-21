// Modal.tsx
import cls from './Modal.module.css'
import mascotte from '../../../assets/mascotte.svg'
import { Button } from '../Button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface IModal {
  type: 'accept' | 'courseComplete'
  Name?: string
  XP?: number
  Course?: string
  isOpen: boolean
  onClose: () => void  
  redirect?: boolean
  navigates?: string
  acceptText? : string
  onAccept?: ()  => void

}

export const Modal = ({isOpen,type, Name, XP, Course, onClose, onAccept, redirect, navigates, acceptText }: IModal) => {
  const navigate = useNavigate()
  if(!isOpen) return null
  return (
    <div className={cls.modal}>
      <div className={cls.modalContent}>
        {type === 'courseComplete' && (
          <>
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
          </>
        )} 
        {type === 'accept' && (
          <>
            <div className={cls.modalTop}>
              <p className={cls.modalText}>
                Подтвердите действие !<br />
                {acceptText}
              </p>
              <img src={mascotte} alt="robot mascotte" />
            </div>
          <div className={cls.modalBottom}>
            <Button  onClick={() => {
              onClose()
            }}>
              Отколнить
            </Button>
            <Button animation onClick={() => {
              onAccept()
            }}>
              Принять
            </Button>
          </div>
          </>
        )}
      </div>
    </div>
  )
}