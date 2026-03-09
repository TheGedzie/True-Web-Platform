import cls from './Button.module.css'
import { type ReactNode } from 'react'

type IButton = {
    children : ReactNode
    onClick?: () => void
    size? : 'large' | 'medium' | 'small'
    variant?: 'primary' | 'secondary'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    animation? : boolean
    customClass? : string
}

export const Button = ({children, onClick, size = 'medium', variant = 'primary', disabled = false, type = 'button', animation = false, customClass} : IButton) => {
  return (
    <button className={`
      ${cls.button} 
      ${cls[size]}
      ${cls[variant]}
      ${disabled ? cls.disabled : ''}
      ${animation ? cls.animate : ''}
      ${customClass}
      `} 
      onClick={onClick}
      type={type}
      disabled={disabled}
      >{children}</button>
  )
}
