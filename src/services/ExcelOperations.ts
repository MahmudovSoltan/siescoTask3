import instance from "../helpers/instance";
import { API_ENDPOINTS } from "./EndpointResources.g";

export const getTableName = async () => {
    try {
        const response = await instance.get(API_ENDPOINTS.GET_TABLE_NAMES.GET());
        return response.data;
    } catch (error) {
        console.error('Error fetching table names:', error);
        throw error;
    }
}

export const getColumnNames = async (tableName: string) => {
    try {
        const response = await instance.get(API_ENDPOINTS.COLUMN_NAME.GET(tableName));
        return response.data;
    } catch (error) {
        console.error(`Error fetching column names for table ${tableName}:`, error);
        throw error;
    }
};

export const getTableData = async (tableName: string) => {
    try {
        const response = await instance.get(API_ENDPOINTS.TABLE_DATA.GET(tableName));
        return response.data;
    } catch (error) {
        console.error(`Error fetching data for table ${tableName}:`, error);
        throw error;
    }
};

export const exportExcel = async (tableName: string, data) => {
    try {
        const response = await instance({
            method: 'POST',
            url: API_ENDPOINTS.EXPORT.POST(tableName),
            data // Ensure the response is treated as a blob
        });
        return response.data;
    } catch (error) {
        console.error(`Error exporting data for table ${tableName}:`, error);
        throw error;
    }
};

export const downloadFile = async (fileName: string) => {
    try {
        const response = await instance.get(API_ENDPOINTS.DOWNLOAD.GET(fileName));
        return response.data;
    } catch (error) {
        console.error(`Error downloading file ${fileName}:`, error);
        throw error;
    }
};