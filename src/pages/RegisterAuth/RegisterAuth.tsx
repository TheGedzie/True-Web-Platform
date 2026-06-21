import { useState } from 'react'
import cls from './RegisterAuth.module.css'
import { Button } from '../../components/UI/Button'
import { useForm } from 'react-hook-form'
import { Title } from '../../components/UI/Title'
import { Error } from '../../components/UI/Error'
import { useNavigate } from 'react-router-dom'
import { registerUser, loginUser } from '../../services/UsersService'
import mascotte from '../../assets/mascotte.svg'

interface IForm{
  userName?: string
  email: string
  password: string
  repeatPassword?: string 
}

export const RegisterAuth = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: {errors} } = useForm<IForm>({
    mode: 'onChange'
  })

  const password = watch('password')
  const [activeTab, setActiveTab] = useState("registr")

  // Регистрация
  const onRegister = async (data: IForm) => {
    try {
      const result = await registerUser({
        username: data.userName,
        email: data.email,
        password: data.password
      })

      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))

      navigate('/education')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка регистрации')
    }
  }

  // Авторизация
  const onLogin = async (data: IForm) => {
    try {
      const result = await loginUser({
        email: data.email,
        password: data.password
      })

      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))

      navigate('/education')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка входа')
    }
  }

  return (
    <div className={cls.container}>
      <div className={cls.formContainer}>
        <div className={cls.tabs}>
          <Button children="Регистрация" size='small' variant={activeTab === 'registr' ? "secondary" : "primary"} onClick={() => {
            if(activeTab != "registr"){
              setActiveTab("registr")
            }
          }}/>
          <Button children="Авторизация" size='small' variant={activeTab === 'auth' ? "secondary" : "primary"} onClick={() => {
            if(activeTab != "auth"){
              setActiveTab("auth")
            }
          }}/>
        </div>

        {/* Регистрация */}
        {activeTab === "registr" && (
          <form className={cls.form} onSubmit={handleSubmit(onRegister)}>
            <Title color='white' level='h2'>Регистрация</Title>
            <input className={cls.input} type="text" placeholder='Введите ник'
              {...register('userName', {
                required: "Это обязательное поле !",
                maxLength: {
                  value: 15,
                  message: "Ник максимум 15 символов"
                }
              })}
            />
            <input className={cls.input} type="email" placeholder='Введите эл.почту'
              {...register('email', {
                required: "Это обязательное поле !",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Неверный формат почты"
                }
              })}
            />
            <input className={cls.input} type="password" placeholder='Введите пароль' 
              {...register('password', {
                required: "Это обязательное поле !",
                minLength: {
                  value: 6,
                  message: "Минимальная длина пароля - 6 символов"
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*?]).+$/,
                  message: "Пароль должен содержать заглавную букву и спецсимвол (!@#$%^&*?)"
                }
              })}
            />
            <input className={cls.input} type="password" placeholder='Повторите пароль'
              {...register('repeatPassword', {
                required: "Это обязательное поле !",
                validate: value => value === password || "Пароли не совпадают"
              })}
            />
            {errors.userName && <Error children={errors.userName.message}/>}
            {errors.email && <Error children={errors.email.message}/>}
            {errors.password && <Error children={errors.password.message}/>}
            {errors.repeatPassword && <Error children={errors.repeatPassword.message}/>}
            <Button size='medium' type='submit' children="Зарегистрироваться" />
          </form>
        )}

        {/* Авторизация */}
        {activeTab === "auth" && (
          <form className={cls.form} onSubmit={handleSubmit(onLogin)}>
            <Title color='white' level='h2'>Авторизация</Title>
            <input type="email" className={cls.input} placeholder='Введите эл.почту'
              {...register("email", {
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Неправильный формат почты"
                },
                required: "Вы не ввели почту"
              })}
            />
            <input type="password" className={cls.input} placeholder='Введите пароль'
              {...register("password", {
                required: "Вы не ввели пароль !",
              })}
            />
            {errors.email && <Error children={errors.email.message}/>}
            {errors.password && <Error children={errors.password.message}/>} 
            <Button children="Авторизироваться" type='submit'/>
          </form>
        )}

        <div className={cls.helloContainer}>
          <div className={cls.line}></div>
          <Title children={"Добро пожаловать на платформу !"} color='green' level='h1'/>
          <img className={cls.mascotte} src={mascotte} alt="robot mascotte" />
        </div>
      </div>
    </div>
  )
}