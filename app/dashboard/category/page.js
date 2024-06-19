'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import MaterialTable from '@/components/table';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNotificationStore } from '@/stores/notification';

const category = () => {
  const baseUrl = 'http://localhost:3001/category';
  const [updateTable, setUpdateTable] = useState(false);
  const { setOpenNotification, setMessage } = useNotificationStore();
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'description', header: 'Description' }
    ],
    []
  );

  useEffect(() => {
    fetch(baseUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, [updateTable]);

  const [open, setOpen] = useState(false);
  const [openFrom, setOpenFrom] = useState('');
  const [idRow, setIdRow] = useState('');

  const handleOpen = (openFrom, idRow = '') => {
    setOpen(true);
    setOpenFrom(openFrom);
    setIdRow(idRow);
  };
  const handleClose = () => {
    setOpen(false);
    setOpenFrom('');
    setIdRow('');
  };

  const dataCategory = { name: '', description: '' };
  const [initialValue, setInitialValue] = useState(dataCategory);

  useEffect(() => {
    if (openFrom === 'edit' || openFrom === 'delete') {
      fetch(baseUrl + '/' + idRow)
        .then((res) => res.json())
        .then((data) => {
          const { birth_date } = data;
          setInitialValue(data);
        });
    } else {
      setInitialValue(dataCategory);
    }
  }, [openFrom]);

  const handleSubmitForm = async (values) => {
    let url, method, message;

    if (openFrom === 'create') {
      url = baseUrl;
      method = 'POST';
      message = 'Category has been created';
    } else {
      url = baseUrl + '/' + idRow;
      method = 'PUT';
      message = 'Category has been updated';
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    });

    if (res.ok) {
      setUpdateTable(!updateTable);
      setOpenNotification(true);
      setMessage(message);
      handleClose();
    }
  };

  const handleDelete = async () => {
    const res = await fetch(baseUrl + '/' + idRow, {
      method: 'DELETE'
    });

    if (res.ok) {
      setUpdateTable(!updateTable);
      setOpenNotification(true);
      setMessage('Category has been deleted');
      handleClose();
    }
  };

  return (
    <div>
      <MaterialTable
        title="Data Category"
        columns={columns}
        data={data}
        renderTopToolbarCustomActions={() => (
          <Button variant="contained" size="small" onClick={() => handleOpen('create')}>
            Create
          </Button>
        )}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button variant="contained" size="small" color="info" onClick={() => handleOpen('edit', row.original.id)}>
              Edit
            </Button>
            <Button variant="contained" size="small" color="error" onClick={() => handleOpen('delete', row.original.id)}>
              Delete
            </Button>
          </Box>
        )}
      />

      {(openFrom === 'create' || openFrom === 'edit') && (
        <Dialog fullWidth={true} maxWidth="md" open={open} onClose={handleClose}>
          <DialogTitle sx={{ textTransform: 'capitalize' }}>{openFrom} Data Category</DialogTitle>
          <DialogContent>
            <Formik
              enableReinitialize={true}
              initialValues={initialValue}
              validationSchema={Yup.object().shape({
                name: Yup.string().required('Name is required'),
                description: Yup.string().required('Description is required')
              })}
              onSubmit={handleSubmitForm}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={{ xs: 2, md: 3 }} paddingTop={1}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(touched.name && errors.name)}>
                        <TextField
                          label="Name"
                          name="name"
                          value={values.name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.name && errors.name)}
                        />
                        {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(touched.description && errors.description)}>
                        <TextField
                          label="Description"
                          name="description"
                          value={values.description}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.description && errors.description)}
                        />
                        {touched.description && errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                      <Button variant="outlined" color="error" disabled={isSubmitting} onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button variant="contained" type="submit" color="primary" disabled={isSubmitting}>
                        Save
                        {isSubmitting && <CircularProgress sx={{ marginLeft: '10px' }} size={20} />}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      )}

      {openFrom === 'delete' && (
        <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
          <DialogTitle>Delete Data Category</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete data <b>{initialValue?.name}</b>?
            </Typography>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <Button variant="outlined" color="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default category;
