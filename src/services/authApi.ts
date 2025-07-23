
import axiosInstance from "../helpers/instance";
import type { IRegister } from "../types/auth.type";
import { API_ENDPOINTS } from "./EndpointResources.g";

export const registerFunc = async (data:IRegister)=>{
    try{
        const response = await axiosInstance({
            method:"POST",
            url:API_ENDPOINTS.AUTH.REGISTER.POST(),
            data
        })
        return  response.status
    }catch(error){
        console.log(error);
        
    }
}

export const loginFunc = async (data:Pick<IRegister, 'password' | 'email'>)=>{
    try{
        const response = await axiosInstance({
            method:"POST",
            url:API_ENDPOINTS.AUTH.LOGIN.POST(),
            data
        })
        return  response.data
    }catch(error){
        console.log(error);
        
    }
}