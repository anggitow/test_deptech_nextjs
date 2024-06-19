'use client';
import { useState, useEffect, useMemo } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import MaterialTable from '@/components/table';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNotificationStore } from '@/stores/notification';

const admin = () => {
  const baseUrl = 'http://localhost:3001/admin';
  const [updateTable, setUpdateTable] = useState(false);
  const { setOpenNotification, setMessage } = useNotificationStore();
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      { accessorKey: 'first_name', header: 'First Name' },
      { accessorKey: 'last_name', header: 'Last Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'birth_date', header: 'Birth Date' },
      { accessorKey: 'gender', header: 'Gender' }
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
  const [showPassword, setShowPassword] = useState(false);

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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const dataAdmin = { first_name: '', last_name: '', email: '', password: '', birth_date_dayjs: null, gender: '' };
  const [initialValue, setInitialValue] = useState(dataAdmin);

  useEffect(() => {
    if (openFrom === 'edit' || openFrom === 'delete') {
      fetch(baseUrl + '/' + idRow)
        .then((res) => res.json())
        .then((data) => {
          const { birth_date } = data;
          setInitialValue({ ...data, birth_date_dayjs: dayjs(birth_date) });
        });
    } else {
      setInitialValue(dataAdmin);
    }
  }, [openFrom]);

  const handleSubmitForm = async (values) => {
    values.birth_date = dayjs(new Date(values.birth_date_dayjs)).format('DD-MMM-YYYY');

    let { birth_date_dayjs, ...body } = values;
    let url, method, message;

    if (openFrom === 'create') {
      url = baseUrl;
      method = 'POST';
      message = 'Admin has been created';
    } else {
      url = baseUrl + '/' + idRow;
      method = 'PUT';
      message = 'Admin has been updated';
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
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
      setMessage('Admin has been deleted');
      handleClose();
    }
  };

  return (
    <div>
      <MaterialTable
        title="Data Admin"
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
          <DialogTitle sx={{ textTransform: 'capitalize' }}>{openFrom} Data Admin</DialogTitle>
          <DialogContent>
            <Formik
              enableReinitialize={true}
              initialValues={initialValue}
              validationSchema={Yup.object().shape({
                first_name: Yup.string().required('First name is required'),
                last_name: Yup.string().required('Last name is required'),
                email: Yup.string().email('Email must be a valid email address').required('Email is required'),
                password: Yup.string().required('Password is required'),
                birth_date_dayjs: Yup.string().required('Birth date is required'),
                gender: Yup.string().required('Gender is required')
              })}
              onSubmit={handleSubmitForm}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={{ xs: 2, md: 3 }} paddingTop={1}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(touched.first_name && errors.first_name)}>
                        <TextField
                          label="First Name"
                          name="first_name"
                          value={values.first_name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.first_name && errors.first_name)}
                        />
                        {touched.first_name && errors.first_name && <FormHelperText error>{errors.first_name}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(touched.last_name && errors.last_name)}>
                        <TextField
                          label="Last Name"
                          name="last_name"
                          value={values.last_name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.last_name && errors.last_name)}
                        />
                        {touched.last_name && errors.last_name && <FormHelperText error>{errors.last_name}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                        <TextField
                          label="Email"
                          type="email"
                          name="email"
                          value={values.email}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.email && errors.email)}
                        />
                        {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                          name="password"
                          value={values.password}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type={showPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                        {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={Boolean(touched.birth_date_dayjs && errors.birth_date_dayjs)}>
                          <DatePicker
                            label="Birth Date"
                            format="DD-MMM-YYYY"
                            minDate={dayjs('1950-01-01')}
                            maxDate={dayjs()}
                            value={values.birth_date_dayjs}
                            onChange={(value) => setFieldValue('birth_date_dayjs', value)}
                            slotProps={{
                              textField: {
                                name: 'birth_date_dayjs',
                                error: Boolean(touched.birth_date_dayjs && errors.birth_date_dayjs),
                                helperText: touched.birth_date_dayjs && errors.birth_date_dayjs
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </LocalizationProvider>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(touched.gender && errors.gender)}>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup row name="gender" value={values.gender} onBlur={handleBlur} onChange={handleChange}>
                          <FormControlLabel value="Male" control={<Radio />} label="Male" />
                          <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        </RadioGroup>
                        {touched.gender && errors.gender && <FormHelperText error>{errors.gender}</FormHelperText>}
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
          <DialogTitle>Delete Data Admin</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete data{' '}
              <b>
                {initialValue?.first_name} {initialValue?.last_name}
              </b>
              ?
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

export default admin;
