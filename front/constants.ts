
const isProduction = process.env.NODE_ENV === "production";


export const BASE_URL = isProduction
  ? "https://task-manager-seven-coral-21.vercel.app"
  : "http://localhost";
export const BASE_PORT = isProduction ? "" : "3001";
export const BASE_PREFIX = "api";


export const BASE_API_STRING = isProduction
  ? `${BASE_URL}/${BASE_PREFIX}`
  : `${BASE_URL}:${BASE_PORT}/${BASE_PREFIX}`;

export const AUTH = "auth";
export const LOGIN = "login";
export const REGISTER = "register";

export const TASK = "task";
export const CREATE = "create";
