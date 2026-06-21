import cls from './ParticleBackground.module.css'
const ParticleBackground = () => {
  return (
    <div className={cls.background}>
        <div className={cls.blob1} />
        <div className={cls.blob2} />
        <div className={cls.blob3} />
    </div>
  )
};
export default ParticleBackground