import { LoginResponseType, loginType, registerType } from "@/types/api.type";
import API from "./axios-client";

export const registerMutationFn = async (
  data: registerType
): Promise<{ message: string }> => {
  const res = await API.post("/api/auth/register", data);
  return res.data;
};

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/api/auth/login", data);
  return response.data;
};
