import { ISwineDict } from "../../interfaces/ISwineDict";

export class Dict implements ISwineDict {
  SWINE_NOT_EXISTS = 'у тебя ещё нет свина, но ты можешь его завести прямо сейчас! Введи /name <имя_твоего_свина>';
  SWINE_RENAMED = 'теперь твоего 🐽 зовут {0}, носи новое имя с гордостью!';
  SWINE_NAME_ERROR = 'так называть свина нельзя: {0}';
  SWINE_OVERVIEW = 'твоего 🐖 зовут {0}, его возраст {1} {2}';
  SWINE_GROWTH = 'твой 🐽 {0} поправился на {1} кг сала! Масса вашей свиньи: {2} кг';
}