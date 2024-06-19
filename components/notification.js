import { useNotificationStore } from '@/stores/notification';
import { Alert, Snackbar } from '@mui/material';

const Notification = () => {
  const { openNotification, setOpenNotification, message } = useNotificationStore();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenNotification(false);
  };

  return (
    <Snackbar open={openNotification} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
