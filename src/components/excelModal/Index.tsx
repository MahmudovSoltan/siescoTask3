import { useEffect, useRef, useState } from 'react';
import styles from './excel.module.css';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { excelValidate, iportExcelUpload } from '../../services/ExcelOperations';
import { FaDownload } from "react-icons/fa";

import { toast } from 'react-toastify';

interface ExcelModalProps {
  onClose: () => void;
}
export interface ITableData {
  [key: string]: string[] | [];
}

interface RowType {
  rowData: { [key: string]: string };
}


interface IDataType {
  errors: { [key: string]: string },
  rowData:{ [key: string]: string }

}
interface IErrorType {
  data: IDataType[],
  errors?:string
}
const ExcelModal = ({ onClose }: ExcelModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorData, setErrorData] = useState<IErrorType[] | []>([])
  const [excerResponse, setExcelResponse] = useState(null)
  const [tableData, setTableData] = useState<ITableData[]>([])
  const [dbColumnName, setDbColumunName] = useState([])
  const [excelColumnName, setExcelColomunName] = useState([])
  const [columnMapping, setColumnMapping] = useState<{ [excelCol: string]: string }>({});
  const [eptyRow, setEptyRow] = useState(false)
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  const handleChooseFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        console.log(formData, "formdata");

        const response = await iportExcelUpload(formData)


        setExcelResponse(response)
        setDbColumunName(response?.dbColumnNames)
        setExcelColomunName(response?.excelColumnNames)
        const allRows = response?.rows?.flatMap((item: RowType) => item.rowData) ?? [];
        setTableData(allRows);
      } catch (error) {
        console.error("Fayl göndərmə xətası:", error);
      }
    }
  }


  const handleSubmit = async () => {
    const formattedRows = tableData.map(row => ({
      rowData: row
    }));

    const payload = {
      columnMappings: columnMapping,
      rows: formattedRows
    };

    const response = await excelValidate(payload)
    if (!response.isValid) {
      setErrorData(response.data)
    } else if (response?.isValid) {
      onClose()
      toast.success("Məlumat göndərildi")
    }
  };


  useEffect(() => {
    if (dbColumnName.length > 0 && excelColumnName.length > 0) {
      const initialMapping: { [key: string]: string } = {};
      for (let i = 0; i < dbColumnName.length; i++) {
        const dbCol = dbColumnName[i];
        const excelCol = excelColumnName[i];
        if (dbCol && excelCol) {
          initialMapping[excelCol] = dbCol;
        }
      }
      setColumnMapping(initialMapping);
    }

  }, [dbColumnName, excelColumnName]);


  useEffect(() => {
    const hasEmpty = excelColumnName.some(col => columnMapping[col] == " ")
    setEptyRow(hasEmpty);
  }, [columnMapping, excelColumnName]);




  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.close_icon}>
          <IoIosCloseCircleOutline onClick={onClose} size={24} />
        </div>
        <div className={styles.excel_input_div}>
          <h3>Excel Fayl Yüklə</h3>
          <div><FaDownload size={24} onClick={handleImportClick} />
          </div>

        </div>
        <input type="file" ref={fileInputRef} onChange={handleChooseFile} style={{ display: "none" }} accept=".xlsx, .xls" />
        {
          excerResponse && <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {excelColumnName?.map((item, i) => (
                    <th key={i}>
                      <div>
                        <div>
                          {item}
                        </div>
                        <select
                          value={columnMapping[item]}
                          onChange={(e) => {
                            const selectedDbColumn = e.target.value;
                            setColumnMapping((prev) => ({
                              ...prev,
                              [item]: selectedDbColumn,
                            }));
                          }}
                        >
                          <option value={" "}>Secin</option>
                          {dbColumnName?.map((dbItem, j) => {
                            const isSelectedInOther = Object.entries(columnMapping).some(
                              ([key, val]) => key !== item && val === dbItem
                            );
                            return (
                              <option key={j} value={dbItem} disabled={isSelectedInOther}>
                                {dbItem}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {excelColumnName.map((colName, colIndex) => (
                      <td key={colIndex}>
                        <input
                          type="text"
                          value={row[colName] ?? ""}
                          className={errorData[rowIndex]?.errors?.[colName] ? styles.errorInput : ""}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setTableData(prevData => {
                              const newData = [...prevData];
                              const updatedRow = { ...newData[rowIndex], [colName]: newValue };
                              newData[rowIndex] = updatedRow;
                              return newData;
                            });
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button disabled={eptyRow} style={{ backgroundColor: eptyRow ? "gray" : "" }} onClick={handleSubmit}>Save</button>
          </div>
        }

      </div>

    </div>
  );
};

export default ExcelModal;
