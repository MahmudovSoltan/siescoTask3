export const API_ENDPOINTS = {
  COLUMN_NAME: {
    GET: (tableName: string) => `/api/Export/GetColumnNames?tableName=${tableName}`,
  },
  TABLE_DATA: {
    GET: (tableName: string) =>
      `/api/Export/GetTableData?tableName=${tableName}`,
  },
  GET_TABLE_NAMES: {
    GET: () => '/api/Export/GetTableNames',
    },
  EXPORT: {
    POST: (tableName: string) => `/api/Export/ExportExcel/${tableName}`,
  },
  DOWNLOAD:{
    GET: (fileName: string) => `/api/Export/Download?fileName=${fileName}`,
  }
};