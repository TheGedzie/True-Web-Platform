import React from "react";
import cls from "./AsideMenu.module.css";
import { useNavigate } from "react-router-dom";
export const AsideMenu = () => {
  const navigate = useNavigate();
  return (
    <div className={cls.asideMenu}>
      <p className={cls.asideMenuElement} onClick={() => navigate("/profile")}>
        PROFILE
      </p>
      <p
        className={cls.asideMenuElement}
        onClick={() => navigate("/education")}
      >
        COURSES
      </p>
      <p
        className={cls.asideMenuElement}
        onClick={() => navigate("/challenges")}
      >
        CHELLENGES
      </p>
      <p className={cls.asideMenuElement} onClick={() => navigate("/forum")}>
        FORUM
      </p>
    </div>
  );
};
