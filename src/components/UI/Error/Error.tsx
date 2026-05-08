import cls from './Error.module.css'
import cross from '../../../assets/cross.svg'
import { useState } from 'react'
interface IError{
    children: string | undefined
}

export const Error = ({children} : IError) => {
    const [visible, setVivisble] = useState<boolean>(true)
    if (!visible) return null
  return (
    <div className={cls.error}>
        <p className={cls.text}>{children}</p>
        <img className={cls.cross} src={cross} alt="cross" onClick={() => {
            setVivisble(false)
        }}/>
    </div>
  )
}
