import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import cls from './Questions.module.css'
import { QuestionUI } from '../../components/UI/QuestionUI'
import { fetchQuestions, postQuestion } from '../../services/QuestionService'
import { fetchUser } from '../../services/UsersService'
import type { IQuestion, IUser } from '../../types'
import { Title } from '../../components/UI/Title'
import { useForm } from 'react-hook-form'
import { Error } from '../../components/UI/Error'
import { Button } from '../../components/UI/Button'
import { MessageCircle, Plus, Send, X, Sparkles} from 'lucide-react'
import ParticleBackground from '../../components/ParticleBackgound/ParticleBackground'

interface IFormAskQuestion {
  title: string 
  content: string 
}

// Варианты анимаций для каскада
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: { type: "spring", stiffness: 300 }
  }
}

const titleVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
}

export const Questions = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([])
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [user, setUser] = useState<IUser | null>(null)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormAskQuestion>({
    mode: 'onChange'
  })
  
  useEffect(() => {
    fetchUser().then(setUser).catch(console.error)
  }, [])
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions()
        if (data && Array.isArray(data)) {
          setQuestions(data)
        }
      } catch (error) {
        console.error('Ошибка загрузки вопросов:', error)
      }
    }
    loadQuestions()
  }, [])
  
  const onSubmit = async (data: IFormAskQuestion) => {
    if (!user?.id) {
      alert("Авторизуйтесь, чтобы задать вопрос")
      return
    }
    
    try {
      const newQuestion = await postQuestion({
        title: data.title,
        content: data.content,
        authorId: user.id,
        authorName: user.username,
        authorAvatar: user.avatar
      })
      
      setQuestions(prev => [newQuestion, ...prev])
      reset()
      setOpenForm(false)
      alert("Вопрос успешно создан!")
      
    } catch (error) {
      console.error("Ошибка:", error)
      alert("Не удалось создать вопрос")
    }
  }
  
  return (
    <motion.div 
      className={cls.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ParticleBackground />
      
      <motion.div 
        className={cls.heroContainer}
        variants ={titleVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={cls.titleContainer}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MessageCircle size={45} className={cls.messageCircle}/>
          </motion.div>
          <Title children="Открытый форум" color='white' size='large' customClass={cls.title}/>
        </div>
        <motion.span 
          className={cls.description}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Задавай вопросы и помогай другим разработчикам
        </motion.span>
      </motion.div>
      
      <div className={cls.askQuestion}>
                <AnimatePresence mode="wait">
          {!openForm ? (
            <motion.div
              key="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                customClass={cls.askButton}
                size='medium' 
                onClick={() => setOpenForm(true)}
              >
                <Plus size={25} className={cls.btnIcon} />
                Задать вопрос
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={cls.form}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={cls.formTitle}>
                <motion.div
                  animate={{rotate:360}}
                  transition={{duration: 0.5}}
                >
                  <Sparkles className={cls.SparklesIcon}/>
                </motion.div>
                <Title size='small' color='white'>Новый вопрос</Title>
              </div>
              <input 
                type="text" 
                className={cls.input} 
                placeholder='Введите тему вопроса...'
                {...register('title', {
                  required: "Заполните все поля",
                  maxLength: { value: 60, message: "Длина темы максимум 60 символов" }
                })}
              />
              <textarea 
                className={cls.textarea} 
                placeholder='Введите вопрос...'
                rows={4}
                {...register('content', {
                  required: "Заполните все поля",
                  maxLength: { value: 300, message: "Длина вопроса максимум 300 символов" }
                })}
              />
              {errors.title && <Error children={errors.title.message} />}
              {errors.content && <Error children={errors.content.message} />}
              <div className={cls.formButtons}>
                <Button customClass={cls.submitBtn} size='medium' type='submit'>
                  <Send size={20}/>
                  Отправить
                </Button>
                <Button 
                  customClass={cls.cancelBtn}
                  size='medium' 
                  type='button' 
                  onClick={() => setOpenForm(false)}
                >
                  <X size={20} />
                  Отмена
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      
      <motion.div 
        className={cls.forum}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {questions.length === 0 ? (
          <motion.div 
            className={cls.noQuestions}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            Пока нет вопросов. Будь первым!
          </motion.div>
        ) : (
          questions.map(elem => (
            <motion.div
              key={elem.id}
              variants={itemVariants}
              whileHover="hover"
              className={cls.div}
            >
              <QuestionUI {...elem} />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  )
}