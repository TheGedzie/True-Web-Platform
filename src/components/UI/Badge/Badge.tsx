import { type ReactNode } from "react"
import cls from './Badge.module.css'
type BadgeType = {
    children : ReactNode
    size : 'small' | 'medium' | 'large'
    color : 'green' | 'blue' | 'purple' | 'red' | 'yellow'
    customClass ?: string

}


export const Badge = ({children, size = "medium", color = "green", customClass} : BadgeType) => {
  return (
    <div className={`
        ${cls.Badge}
        ${cls[size]}
        ${cls[color]}
        ${customClass}
    `}>{children}</div>
  )
}

export default Badge