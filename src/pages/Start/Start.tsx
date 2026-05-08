import React from 'react'
import cls from './Start.module.css'
import { Badge } from '../../components/UI/Badge'
import { Button } from '../../components/UI/Button'
import { Title } from '../../components/UI/Title'
import { useNavigate } from 'react-router-dom'

export const Start = () => {
    const navigate = useNavigate();
  return (
    <div className={cls.Start}>
        <div className={cls.hero}>
            <div className={cls.heroLeft}>
                <Badge children="Освой web-разработку" color='green' size='large'/>
                <Badge children="Практикуйся" color='blue' size='large'/>
                <Badge children="Соревнуйся" color='purple' size='large'/>
                <Badge children="Ломай голову" color='red' size='large'/>
                <Badge children="Получи поддержку" color='yellow' size='large'/>
            </div>
            <div className={cls.heroRight}>
                <Title children="TrueWebPlatform" size='large' color='white'/>
                <Button  children="Присоедениться" animation size='large' onClick={() => {
                    navigate('/register')
                }}/>
            </div>
        </div>
        <Title  children ="Coming soon ..." size='large' color='white'/> 
    </div>
  )
}
