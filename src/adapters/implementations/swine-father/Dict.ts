import { ISwineDict } from "../../interfaces/ISwineDict";

export class Dict implements ISwineDict {
  SWINE_NOT_EXISTS = 'у тебя ещё нет свина, но ты можешь его завести прямо сейчас! Введи /name <имя_твоего_свина>';
  SWINE_RENAMED = 'теперь твоего 🐽 зовут {0}, носи новое имя с гордостью!';
  SWINE_OVERVIEW = 'твоего 🐖 зовут {0}, его возраст {1} {2}';
  SWINE_GROW = 'твой 🐽 {0} поправился на {1} кг сала! Теперь хряк весит: {2} кг';

  // top
  SWINES_NOT_EXISTS = 'в этой комнате нет ни одного хряка';
  SWINES_TOP_ROW = '{0} {1} - {2} кг';
  SWINES_TOP = 'Самые жирные 🐖 в этом свинарнике:\n\n{0}';
}