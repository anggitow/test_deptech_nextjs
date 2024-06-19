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
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import MaterialTable from '@/components/table';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNotificationStore } from '@/stores/notification';

const product = () => {
  const baseUrl = 'http://localhost:3001/product';
  const [updateTable, setUpdateTable] = useState(false);
  const { setOpenNotification, setMessage } = useNotificationStore();
  const [optionCategories, setOptionCategories] = useState([]);
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'image_url',
        header: 'Image',
        enableSorting: false,
        enableGlobalFilter: false,
        enableColumnActions: false,
        Cell: ({ renderedCellValue }) => <img src={renderedCellValue} alt="" height={40} />
      },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'description', header: 'Description' },
      { accessorKey: 'category_name', header: 'Category' },
      { accessorKey: 'stock', header: 'Stock' }
    ],
    []
  );

  useEffect(() => {
    fetch(baseUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });

    fetch('http://localhost:3001/category')
      .then((res) => res.json())
      .then((data) => setOptionCategories(data));
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

  const dataProduct = { image_url: '', name: '', description: '', id_category: '', stock: '' };
  const [initialValue, setInitialValue] = useState(dataProduct);

  useEffect(() => {
    if (openFrom === 'edit' || openFrom === 'delete') {
      fetch(baseUrl + '/' + idRow)
        .then((res) => res.json())
        .then((data) => {
          const { birth_date } = data;
          setInitialValue(data);
        });
    } else {
      setInitialValue(dataProduct);
    }
  }, [openFrom]);

  const handleSubmitForm = async (values) => {
    const { id_category } = values;
    const category_name = await fetch('http://localhost:3001/category/' + id_category).then((res) => res.json());
    values.category_name = category_name.name;

    let url, method, message;

    if (openFrom === 'create') {
      url = baseUrl;
      method = 'POST';
      message = 'Product has been created';
    } else {
      url = baseUrl + '/' + idRow;
      method = 'PUT';
      message = 'Product has been updated';
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
      setMessage('Product has been deleted');
      handleClose();
    }
  };

  return (
    <div>
      <MaterialTable
        title="Data Product"
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
          <DialogTitle sx={{ textTransform: 'capitalize' }}>{openFrom} Data Product</DialogTitle>
          <DialogContent>
            <Formik
              enableReinitialize={true}
              initialValues={initialValue}
              validationSchema={Yup.object().shape({
                image_url: Yup.string().required('Image URL is required'),
                name: Yup.string().required('Name is required'),
                description: Yup.string().required('Description is required'),
                id_category: Yup.string().required('Category is required'),
                stock: Yup.number().required('Stock is required').min(0, 'Stock must be greater than or equal to 1')
              })}
              onSubmit={handleSubmitForm}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={{ xs: 2, md: 3 }} paddingTop={1}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(touched.image_url && errors.image_url)}>
                        <TextField
                          label="Image URL"
                          name="image_url"
                          value={values.image_url}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.image_url && errors.image_url)}
                        />
                        {touched.image_url && errors.image_url && <FormHelperText error>{errors.image_url}</FormHelperText>}
                      </FormControl>
                    </Grid>

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

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(touched.id_category && errors.id_category)}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          name="id_category"
                          label="Category"
                          value={values.id_category}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.id_category && errors.id_category)}
                        >
                          {optionCategories &&
                            optionCategories.map((category) => (
                              <MenuItem key={category.id} value={category.id}>
                                {category.name}
                              </MenuItem>
                            ))}
                        </Select>
                        {touched.id_category && errors.id_category && <FormHelperText error>{errors.id_category}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(touched.stock && errors.stock)}>
                        <TextField
                          label="Stock"
                          name="stock"
                          type="number"
                          InputProps={{ inputProps: { min: 1 } }}
                          value={values.stock}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.stock && errors.stock)}
                        />
                        {touched.stock && errors.stock && <FormHelperText error>{errors.stock}</FormHelperText>}
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
          <DialogTitle>Delete Data Product</DialogTitle>
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

export default product;
