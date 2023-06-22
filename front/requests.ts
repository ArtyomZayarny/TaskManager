import { AUTH, BASE_API_STRING, CREATE, LOGIN, REGISTER, TASK } from "./constants";

export const REQUEST_LOGIN = `${BASE_API_STRING}/${AUTH}/${LOGIN}`;
export const REQUEST_REGISTER = `${BASE_API_STRING}/${AUTH}/${REGISTER}`;

export const CREATE_TASK = `${BASE_API_STRING}/${TASK}/${CREATE}`;
export const GET_ALL_TASK = `${BASE_API_STRING}/${TASK}`;
