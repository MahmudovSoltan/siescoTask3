import {
  MRT_Table,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
type GenericObject = Record<string, any>;

interface TableProps {
  tableData: GenericObject[];
  columns?: MRT_ColumnDef<GenericObject>[];
}

const Table = ({ tableData, columns }: TableProps) => {

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
