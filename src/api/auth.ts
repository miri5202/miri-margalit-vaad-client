import api from "./client";
import type {User} from "../types";

export interface AuthResponse{
    token:string;
    user:User
}

export async function login(login:string, password:string) :Promise<AuthResponse>{
    const response = await api.post<AuthResponse>("/auth/login", {login, password});
    return response.data;
}

export async function register(fullName:string, email:string, password:string, phone?:string) :Promise<AuthResponse>{
    const response = await api.post<AuthResponse>("/auth/register", {fullName, email, password, phone});
    return response.data;
}

export async function getMe():Promise<User>{
    const response = await api.get<{user:User}>("/auth/me");
    return response.data.user;
}