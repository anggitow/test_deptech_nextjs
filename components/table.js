import { MaterialReactTable } from 'material-react-table';
import { Typography } from '@mui/material';

const MaterialTable = ({ title, columns, data, ...others }) => {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableHiding={false}
        enableDensityToggle={false}
        enableColumnFilters={false}
        initialState={{ showGlobalFilter: true }}
        muiPaginationProps={{ rowsPerPageOptions: [10, 20, 50] }}
        enableRowActions
        positionActionsColumn="last"
        defaultColumn={{ size: 50 }}
        {...others}
      />
    </>
  );
};

export default MaterialTable;
