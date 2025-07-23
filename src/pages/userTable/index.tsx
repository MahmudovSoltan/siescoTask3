import { useEffect, useState } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import { exportExcel, getTableData } from "../../services/ExcelOperations";
import Header from "../../components/header";
import Table from "../../components/tables";
import Modal from "../../components/modals";
import { v4 as uuidv4 } from 'uuid'
import axiosInstance from "../../helpers/instance";
import { ScaleLoader } from 'react-spinners'

export interface Field {
  [key: string]: string | any;
}
const UserTable = () => {

  const [fields, setFields] = useState<Field[]>([
    {
      frontendId: uuidv4(),
      dbColumnName: 'firstName',
      excelColumnName: 'Ad',
      isInclude: true,
    },
    {
      frontendId: uuidv4(),
      dbColumnName: 'lastName',
      excelColumnName: 'Soyad',
      isInclude: true,
    },
    {
      frontendId: uuidv4(),
      dbColumnName: 'email',
      excelColumnName: 'Email',
      isInclude: true,
    },
    {
      frontendId: uuidv4(),
      dbColumnName: 'phoneNumber',
      excelColumnName: 'Telefon',
      isInclude: true,
    },

  ]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
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
    if (fields.length > 0) {

      setLoading(true)
         await exportExcel(fields);
      await new Promise(res => setTimeout(res, 2000));
      const response = await axiosInstance.get(`/api/users/me/files`);

      const files = response.data;
      const lastFile = files[files.length - 1]; // array-in sonuncu elementi
      if (lastFile?.fileByte) {
        const byteCharacters = atob(lastFile.fileByte); // Base64 decode
        const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) =>
          byteCharacters.charCodeAt(i)
        );
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "User.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setShowModal(false)
        setLoading(false)
      } else {
        console.error("fileByte tapılmadı!");
      }


    }
  };



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const tableNames = await getTableData("User");
      setTableData(tableNames);
      setLoading(false);
    };
    fetchData();
  }, [])




  const columns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'actions',
      header: '',
      enableSorting: false,
      enableColumnActions: false,
      size: 8,
      enableResizing: false,
      enablePinning: true,
      enableColumnFilter: false,

    },
    { accessorKey: 'firstName', header: 'Ad', enableColumnFilter: true },
    { accessorKey: 'lastName', header: 'Soyad', enableColumnFilter: true },
    { accessorKey: 'email', header: 'Email', enableColumnFilter: true },
    { accessorKey: 'phoneNumber', header: 'Telefon', enableColumnFilter: true },
  ];

  if (loading) {
    return <div className="loading_container"><ScaleLoader style={{zIndex:"10"}} color="green" /></div>;
  }
  return (
    <div>
      <div className="container">
        <Header setShowModal={setShowModal} />
        <Table tableData={tableData} columns={columns} />
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
    </div>
  )
}

export default UserTable