// Определяем окружение
const isProduction = process.env.NODE_ENV === "production";

// Настройки для разных окружений
export const BASE_URL = isProduction
  ? process.env.API_BASE_URL
  : "http://localhost";
export const BASE_PORT = isProduction ? "" : "3001";
export const BASE_PREFIX = "api";

// Формируем API строку в зависимости от окружения
export const BASE_API_STRING = isProduction
  ? `${BASE_URL}/${BASE_PREFIX}`
  : `${BASE_URL}:${BASE_PORT}/${BASE_PREFIX}`;

export const AUTH = "auth";
export const LOGIN = "login";
export const REGISTER = "register";

export const TASK = "task";
export const CREATE = "create";
