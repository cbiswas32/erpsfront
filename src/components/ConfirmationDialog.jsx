import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export default function ConfirmationDialog({openDialog, dialogText, handleClose, aggreeFunction}) {
  const onClickAggree = () => {
    aggreeFunction()
  }
  //Test
  return (
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {dialogText || ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleClose}>No</Button>
          <Button  onClick={onClickAggree} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
  );
}