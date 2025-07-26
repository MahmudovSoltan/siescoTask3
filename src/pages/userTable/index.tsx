import { useEffect, useState } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import { exportExcel, getTableData } from "../../services/ExcelOperations";
import Header from "../../components/header";
import Table from "../../components/tables";
import Modal from "../../components/modals";
import { v4 as uuidv4 } from 'uuid'
import { ScaleLoader } from 'react-spinners'
import ExcelModal from "../../components/excelModal/Index";
import { connection } from "./signalrConnection";

export interface Field {
  [key: string]: string | any;
}
const UserTable = () => {
  const [excelModal, setExcelModal] = useState(false)
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





  // ✅ Excel export istəyi göndərilir
  const handleExport = async () => {
    if (fields.length > 0) {
      const selectedFields = fields
        .filter(f => f.isInclude)
        .map(({ dbColumnName, excelColumnName }) => ({
          dbColumnName,
          excelColumnName,
        }));

      setLoading(true);

      try {
        await exportExcel(selectedFields); // server faylı hazırlayır
        console.log("Export request göndərildi");
        setLoading(false);
        // Fayl hazır olduqda "FileReady" ilə gəldikdə yüklənəcək
      } catch (error) {
        console.error("Export zamanı xəta:", error);
        setLoading(false);
      }
    }
  };



  useEffect(() => {
    const startSignalR = async () => {
      try {
         const response = await connection.start();
        console.log("SignalR bağlantısı başladı.");
           console.log(response,"response");
           
        // ✅ "FileReady" event-i gələndə faylı yüklə
        connection.on("FileReady", (fileName: string) => {
          console.log("File hazırdır:", fileName);
          const a = document.createElement('a');
          a.href = `https://localhost:7046/${fileName}`;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();

          setShowModal(false);
          setLoading(false);
        });
      } catch (err) {
        console.error("SignalR bağlantı xətası:", err);
      }
    };

    startSignalR();

    // 🧹 Cleanup - komponent unmount olanda bağlantını dayandır
    return () => {
      connection.stop();
    };
  }, []);


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
    return <div className="loading_container"><ScaleLoader style={{ zIndex: "10" }} color="green" /></div>;
  }


  return (
    <div>
      <div className="container">
        <Header setShowModal={setShowModal} openModal={() => setExcelModal(true)} />
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
        {
          excelModal && <ExcelModal onClose={() => setExcelModal(false)} />
        }

      </div>
    </div>
  )
}

export default UserTable