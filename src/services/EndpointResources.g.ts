export const API_ENDPOINTS = {
  COLUMN_NAME: {
    GET: (tableName: string) => `/api/Export/GetColumnNames?tableName=${tableName}`,
  },
  TABLE_DATA: {
    GET: () =>
      `/api/Tables/User/data?SelectedColumnNames=firstName,lastName,phoneNumber,email`,
  },
  GET_TABLE_NAMES: {
    GET: () => '/api/Export/GetTableNames',
    },
  EXPORT: {
    POST: () => `/api/Export/ExportExcel/User`
  },
  DOWNLOAD:{
    GET: (fileName: string) => `/api/Export/Download?fileName=${fileName}`,
  },
  AUTH:{
    REGISTER :{
      POST:()=>"/api/Auth/Register"
    },
    LOGIN:{
      POST:()=>"/api/Auth/Login"
    }
  },
  IMPORT :{
    UPLOAD:{
      POST:()=>"/api/Import/Role/Upload"
    },
    VALIDATE:{
      POST:()=>"/api/Import/Role/Validate"
    },
    TODO:{
      PSOT:()=>"/api/Import/Role/ToDb"
    }
  }
};