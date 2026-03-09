import { type ReactNode } from 'react'
import cls from './Title.module.css'

type formatTitle = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
type color = 'white' | 'black' |'green' | 'blue' | 'purple' | 'red' | 'yellow'
type size = 'small' | 'medium' | 'large'

type TitleType = {
    children: ReactNode
    level?: formatTitle
    color?: color
    size?: size
    onClick?: () => void
    customClass?: string

}

export const Title = ( { children, level = 'h1', color = 'black', size = 'medium', onClick, customClass=""} : TitleType) => {
    const Tag = level
  return (
    <Tag
    onClick={onClick} 
    className={`
            ${cls.Title}
            ${cls[size]}
            ${cls[color]}
            ${customClass}
        `} >{children}</Tag>
  )
}