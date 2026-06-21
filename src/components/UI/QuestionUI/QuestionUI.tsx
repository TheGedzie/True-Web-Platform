import cls from './QuestionUI.module.css'
import type { IQuestion } from '../../../types'
import { useNavigate } from 'react-router-dom'
import { Title } from '../Title'
import { Eye, MessageSquare, Calendar } from 'lucide-react';
import testAva from '../../../assets/images.jpg'


export const QuestionUI = ({id, title, createdAt, views, answers, authorAvatar, authorName, content} : IQuestion) => {
    const navigate = useNavigate()
  return (
    <div className={cls.Question} onClick={() => navigate(`/forum/${id}`)}>
        <div className={cls.questionCreateInfo}>
            <img src={testAva} alt="avatar" className={cls.avatar}/>
            <div className={cls.questionCreateInfoRight}>
                <p className={cls.authorName}>{authorName}</p>
                <span className={cls.dateCreateQuestion}><Calendar size={13} /> {new Date(createdAt).toLocaleDateString('ru-RU').replace(/\./g, '-')}</span>
            </div>
        </div>
        <div className={cls.questionInfo}>
            <Title customClass={cls.questInfoTitle} children={title} size='small' color='white' level='h2'/>
            <p className={cls.questInfoContent}>{content}</p>
        </div>
        <div className={cls.questionMetaData}>
            <span className={cls.viewsCount}><Eye size={16}/>{views}</span>
            <span className={cls.answerCount}><MessageSquare size={16}/>{answers.length}</span>
        </div>
    </div>
  )
}

