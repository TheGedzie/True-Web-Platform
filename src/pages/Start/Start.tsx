import React from 'react'
import cls from './Start.module.css'
import { Badge } from '../../components/UI/Badge'
import { Button } from '../../components/UI/Button'
import { Title } from '../../components/UI/Title'
import { useNavigate } from 'react-router-dom'
import GreenFire from '../../components/ParticleBackgound/ParticleBackground'

export const Start = () => {
  const navigate = useNavigate()

  return (
    <div className={cls.StartPg}>
      {/* <div className={cls.bg}>
        <GreenFire />
      </div> */}

      <section className={cls.hero}>
        <div className={cls.heroLeft}>
            <div className={cls.BadgeWrapper}>
                <Badge children="Освой web-разработку" color="green" size="large" />
                <Badge children="Практикуйся" color="blue" size="large" />
                <Badge children="Соревнуйся" color="purple" size="large" />
                <Badge children="Ломай голову" color="red" size="large" />
                <Badge children="Получи поддержку" color="yellow" size="large" />

                <Badge children="Освой web-разработку" color="green" size="large" />
                <Badge children="Практикуйся" color="blue" size="large" />
                <Badge children="Соревнуйся" color="purple" size="large" />
                <Badge children="Ломай голову" color="red" size="large" />
                <Badge children="Получи поддержку" color="yellow" size="large" />

                <Badge children="Освой web-разработку" color="green" size="large" />
                <Badge children="Практикуйся" color="blue" size="large" />
                <Badge children="Соревнуйся" color="purple" size="large" />
                <Badge children="Ломай голову" color="red" size="large" />
                <Badge children="Получи поддержку" color="yellow" size="large" />

                <Badge children="Освой web-разработку" color="green" size="large" />
                <Badge children="Практикуйся" color="blue" size="large" />
                <Badge children="Соревнуйся" color="purple" size="large" />
                <Badge children="Ломай голову" color="red" size="large" />
                <Badge children="Получи поддержку" color="yellow" size="large" />
            </div>
            </div>

        <div className={cls.heroRight}>
          <Title children="TrueWebPlatform" size="large" color="white" />
          <p>Прокачай себя до Senior через игру</p>

          <Button
            children="Начать"
            animation
            size="large"
            onClick={() => navigate('/register')}
          />
        </div>
      </section>

      <section className={cls.about}>
        <div className={cls.blur}></div>

        <h2>Учись как в игре</h2>

        <div className={cls.cards}>
          <div>⚔ PvP coding</div>
          <div>🔥 Реальные задачи</div>
          <div>🚀 Быстрый рост</div>
        </div>
      </section>

      <section className={cls.timeline}>
        <h2>Твой путь</h2>

        <div className={cls.line}></div>

        <div className={cls.steps}>
          <div>Junior</div>
          <div>Middle</div>
          <div>Senior</div>
          <div>Architect</div>
        </div>
      </section>

      <section className={cls.final}>
        <h2>Готов начать?</h2>

        <Button
          children="Присоединиться"
          animation
          size="large"
          onClick={() => navigate('/register')}
        />
      </section>
    </div>
  )
}