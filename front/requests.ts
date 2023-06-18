import { AUTH, BASE_API_STRING, LOGIN, REGISTER } from "./constants";

export const REQUEST_LOGIN = `${BASE_API_STRING}/${AUTH}/${LOGIN}`;
export const REQUEST_REGISTER = `${BASE_API_STRING}/${AUTH}/${REGISTER}`;
