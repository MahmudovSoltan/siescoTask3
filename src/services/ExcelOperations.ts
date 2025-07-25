
import axios from "axios";
import axiosInstance from "../helpers/instance";
import type { Field } from "../pages/userTable";
import { API_ENDPOINTS } from "./EndpointResources.g";




export const getTableName = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_TABLE_NAMES.GET());
        return response.data;
    } catch (error) {
        console.error('Error fetching table names:', error);
        throw error;
    }
}

export const getColumnNames = async (tableName: string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.COLUMN_NAME.GET(tableName));
        return response.data;
    } catch (error) {
        console.error(`Error fetching column names for table ${tableName}:`, error);
        throw error;
    }
};

export const getTableData = async (tableName: string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.TABLE_DATA.GET());
        return response.data;
    } catch (error) {
        console.error(`Error fetching data for table ${tableName}:`, error);
        throw error;
    }
};

export const exportExcel = async (data: Field) => {
    try {
        const response = await axiosInstance({
            method: 'POST',
            url: API_ENDPOINTS.EXPORT.POST(),
            data // Ensure the response is treated as a blob
        });
        return response.data;
    } catch (error) {
        console.error(`Error exporting data for table:`, error);
        throw error;
    }
};

export const downloadFile = async (fileName: string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.DOWNLOAD.GET(fileName));
        return response.data;
    } catch (error) {
        console.error(`Error downloading file ${fileName}:`, error);
        throw error;
    }
};

export const iportExcelUpload = async (data:any) => {
    console.log(data, "data");

    try {
        const response = await axios.post("https://localhost:7046/api/Import/Role/Upload", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data

    } catch (error) {
        console.log(error);
        throw new Error

    }
}

export const excelValidate = async (data: any) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.IMPORT.VALIDATE.POST(), data)
        console.log(response.data);

        return response.data
    } catch (error) {
        console.log(error);

    }
}