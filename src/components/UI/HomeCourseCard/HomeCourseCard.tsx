import { type ReactNode } from 'react'
import cls from './HomeCourseCard.module.css'

interface IHomeCourseCard{
    children : ReactNode
    onClick?: () => void
    customClass?: string
    color?: 'yellow' | 'blue' | 'orange'
    size?: 'small' | 'medium' | 'large'
}

export const HomeCourseCard = ({children, onClick, customClass, color = 'blue', size = 'medium'} : IHomeCourseCard) => {
  return (
    <div
        onClick={onClick}
        className={`
                ${cls.HomeCourseCard}
                ${cls[color]}
                ${cls[size]}
                ${customClass}
            `}
        data-color={color}
    >
        {children}
    </div>
  )
}
