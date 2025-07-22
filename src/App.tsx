import { useEffect, useState } from "react";
import Header from "./components/header"
import Table from "./components/tables"
import Modal from "./components/modals";
import { exportExcel, getColumnNames, getTableData, getTableName } from "./services/ExcelOperations";
import instance from "./helpers/instance";


export interface Field {
  [key: string]: string | any;
}



const App = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [choosenTable, setChosenTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<Field[]>([]);

  const handleCheckedChange = (frontendId: string, checked: boolean) => {
    setFields(prev =>
      prev.map(f => (f.frontendId === frontendId ? { ...f, isInclude: checked } : f))
    );
  };

  const handleValueChange = (frontendId: string, value: string) => {
    setFields(prev =>
      prev.map(f => (f.frontendId === frontendId ? { ...f, excelColumnName: value } : f))
    );
  };






  const handleExport = async () => {
    const selectedFields = fields
      .filter(f => f.isInclude)
      .map(({ dbColumnName, excelColumnName, isInclude }) => ({
        dbColumnName,
        excelColumnName,
        isInclude
      }));
    console.log(selectedFields, 'selectedFields');

    if (choosenTable && selectedFields.length > 0) {
      const response = await exportExcel(choosenTable, selectedFields);
      console.log(response);

      await new Promise(res => setTimeout(res, 2000));

      const responseData = await instance.get(`/api/Export/Download?fileName=${response}`,
        {
          responseType: 'blob',
        }
      );


      const contentDisposition = responseData.headers['content-disposition'];
      const actualFileName = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replaceAll('"', '')
        : responseData;

      // Faylı blob obyektinə çevir
      const blob = new Blob([responseData.data], { type: responseData.headers['content-type'] });
      console.log(blob, 'blob');

      // Faylı yükləmək üçün müvəqqəti URL yaradın
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = actualFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Əlavə olaraq URL obyektini sərbəst buraxın
      window.URL.revokeObjectURL(url);

      console.log(responseData, 'responseData');
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      const tableNames = await getTableName();
      setTableNames(tableNames);
    };
    fetchData();
  }, [])

  const handleChooseTable = async (tableName: string) => {
    setChosenTable(tableName);
    const columnNames = await getColumnNames(tableName);
    const response = await getTableData(tableName);
    const mappedFields = columnNames.map((col: string, index: number) => ({
      frontendId: `${index}`, // Yalnız lokal üçün
      dbColumnName: col,
      excelColumnName: col,
      isInclude: true,
    }));
    setFields(mappedFields);
    setTableData(response);
  }


  console.log(fields, 'fields');

  return (
    <div className="container">
      <Header setShowModal={setShowModal} />
      <div>
        Please choose the fields you want to export:
        <ul>
          {tableNames.map((field, i) => (
            <li key={i}>
              <button onClick={() => handleChooseTable(field)}>{field}</button>
            </li>
          ))}
        </ul>
      </div>
      {
        tableData.length > 0 && <Table tableData={tableData} />
      }
      {showModal && (
        <Modal
          fields={fields}
          onChangeChecked={handleCheckedChange}
          onChangeValue={handleValueChange}
          onClose={() => setShowModal(false)}
          onExport={handleExport}
        />
      )}
    </div>
  )
}

export default App