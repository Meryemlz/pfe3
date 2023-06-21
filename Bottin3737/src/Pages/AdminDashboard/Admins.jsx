import React from 'react';
import PageTemplate from '../TypesPages/PageTemplate';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import { useState } from 'react';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { ActiviateButton, DeactivateButton, DeleteButton } from './EnterprisesList';
import { auth, db } from 'src/firebase-config';
import { deleteUser } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function Admins() {
  const [companiesList, setCompaniesList] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [selectedCompany, setselectedCompany] = useState(null);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const { t, i18n } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    fetchAllCompanies();
  }, [refresh]);

  console.log('companiesList: ' + JSON.stringify(companiesList, null, 4));
  async function fetchAllCompanies() {
    const q = query(collection(db, 'users'), where('role', '==', 'admin'));

    const querySnapshot = await getDocs(q);

    let result = [];
    querySnapshot.forEach((doc) => {
      result.push({ ...doc.data(), uid: doc.id });
    });
    setCompaniesList(result);
    return result;
  }

  async function ChangeStatus(status, uid) {
    const myDocRef = doc(db, 'users', uid);
    let data = {
      isActive: status
    };
    await updateDoc(myDocRef, data)
      .then(() => {
        console.log('Successfully updated quote status');
        setrefresh(!refresh);
      })
      .catch((err) => console.log(err));
  }
  const notify = () => toast('Votre demande de devis a été envoyée avec succès');

  async function deleteUser(id) {
    // Deleting document with ID 'documentId' from collection 'collectionName'
    await deleteDoc(doc(db, 'users', id))
      .then(() => {
        console.log('Successfully updated quote status');
        notify();

        setrefresh(!refresh);
      })
      .catch((err) => console.log(err));
  }

  return (
    <PageTemplate>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          //   height: '80vh',
          flexDirection: 'column',
          minHeight: '80vh'
        }}
      >
        <Typography
          style={{
            textAlign: 'start',
            width: '90%',
            fontWeight: '600',
            color: '#0f3258',
            margin: '20px 0px',
            fontSize: '18px'
          }}
        >
          {t('list of admins')}
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90%' }}
        >
          <Table sx={{ miWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t('admin email')}</TableCell>

                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? companiesList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : companiesList
              ).map((row) => (
                <TableRow key={row.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.email}
                  </TableCell>

                  {/* {row.isActive ? (
                    <TableCell align="center">
                      <DeactivateButton onClick={() => ChangeStatus(false, row.uid)}>{t('deactivate')}</DeactivateButton>
                      <ActiviateButton onClick={() => deleteUser(row.uid)}> {t('delete')}</ActiviateButton>
                    </TableCell>
                  ) : (
                    <TableCell align="center">
                      <ActiviateButton onClick={() => ChangeStatus(true, row.uid)}> {t('activate')}</ActiviateButton>
                      <ActiviateButton onClick={() => ChangeStatus(true, row.uid)}> {t('activate')}</ActiviateButton>
                    </TableCell>
                  )} */}
                  <TableCell align="center">
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                        // maxWidth:300
                      }}
                    >
                      {row.isActive ? (
                        <DeactivateButton onClick={() => ChangeStatus(false, row.uid)}>
                          {t('deactivate')}
                        </DeactivateButton>
                      ) : (
                        <ActiviateButton onClick={() => ChangeStatus(true, row.uid)}> {t('activate')}</ActiviateButton>
                      )}
                      <DeleteButton
                        onClick={() => {
                          handleClickOpen();
                          setselectedCompany(row.uid);
                        }}
                      >
                        {' '}
                        {t('delete')}
                      </DeleteButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={companiesList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('number of elements per page')}
        />
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('confirm deletion')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de bien vouloir {t('delete')} cet élément ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}> {t('cancel')}</Button>
          <Button
            onClick={() => {
              deleteUser(selectedCompany);
              handleClose();
            }}
            autoFocus
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageTemplate>
  );
}

export default Admins;
