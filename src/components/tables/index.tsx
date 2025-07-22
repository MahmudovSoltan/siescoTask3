import { useMemo } from 'react';
import {
  MRT_Table,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
type GenericObject = Record<string, any>;

interface TableProps {
  tableData: GenericObject[];
  tableColumns?: MRT_ColumnDef<GenericObject>[];
}

const Table = ({ tableData }: TableProps) => {
  const columns = useMemo<MRT_ColumnDef<GenericObject>[]>(() => {
  

    const allKeys = Array.from(
      new Set(tableData.flatMap((item) => Object.keys(item)))
    );

    return allKeys.map((key) => ({
      accessorKey: key,
      accessorFn: (row) => {
        const value = key.split('.').reduce((acc, part) => acc?.[part], row);
        return typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : value;
      },
      header: key.charAt(0).toUpperCase() + key.slice(1),
      size: 150,
    }));
  }, [tableData]);

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enablePagination: false,
    enableBottomToolbar: false,
    editDisplayMode: 'modal',
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 'bold',
        color:"green"
      },
    },
  });

  return <MRT_Table table={table} />;
};

export default Table;
