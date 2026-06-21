import React, { useState } from "react";
import cls from "./AsideMenu.module.css";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const AsideMenu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Бургер-кнопка */}
      <button className={cls.burgerBtn} onClick={toggleMenu}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Оверлей */}
      <div
        className={`${cls.overlay} ${isOpen ? cls.open : ""}`}
        onClick={toggleMenu}
      />

      {/* Меню */}
      <div className={`${cls.asideMenu} ${isOpen ? cls.open : ""}`}>
        <p
          className={cls.asideMenuElement}
          onClick={() => handleNavigate("/profile")}
        >
          👤 Профиль
        </p>
        <p
          className={cls.asideMenuElement}
          onClick={() => handleNavigate("/education")}
        >
          📚 Курсы
        </p>
        <p
          className={cls.asideMenuElement}
          onClick={() => handleNavigate("/challenges")}
        >
          ⚔️ Испытания
        </p>
        <p
          className={cls.asideMenuElement}
          onClick={() => handleNavigate("/forum")}
        >
          💬 Форум
        </p>
      </div>
    </>
  );
};
