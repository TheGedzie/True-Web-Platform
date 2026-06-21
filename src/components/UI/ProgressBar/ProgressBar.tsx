import cls from "./ProgressBar.module.css";

interface IProgressBar {
  currentProgress: number;
  totalProgress: number;
  size?: "small" | "medium" | "large";
  customClass?: string;
}

export const ProgressBar = ({
  currentProgress,
  totalProgress,
  size = "medium",
  customClass = "",
}: IProgressBar) => {
  const currentProgressPercent = (currentProgress / totalProgress) * 100;
  const clampedPercent = Math.min(100, Math.max(0, currentProgressPercent));

  return (
    <div
      className={`
    ${cls.ProgressBarContainer} 
    ${customClass}`}
    >
      <span>
        ПРОГРЕСС: {currentProgress}/{totalProgress}
      </span>
      <div
        className={`
            ${cls.ProgressBar}
            ${cls[size]}
            `}
      >
        <div
          className={cls.ProgressBarProgress}
          style={{ width: `${clampedPercent}%` }}
        ></div>
      </div>
    </div>
  );
};
