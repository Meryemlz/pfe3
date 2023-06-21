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
  TextField,
  Typography
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { ActiviateButton, ComplaintButton, DeactivateButton, DeleteButton } from './EnterprisesList';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from 'src/firebase-config';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';
import { StyledTextarea } from '../EnterpriseDetails';

function ActiveCompanies() {
  const [companiesList, setCompaniesList] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [openComplaint, setopenComplaint] = React.useState(false);

  const [openActiviate, setOpenActiviate] = React.useState(false);
  const [selectedCompanyToActiviate, setselectedCompanyToActiviate] = useState({
    active: false,
    activityField: '',
    companyName: '',
    email: '',
    uid: '',
    visible: false
  });
  const { t, i18n } = useTranslation();
  const [complaintDetails, setComplaintDetails] = useState({
    firstname: '',
    lastname: '',
    name: '',
    subject: '',
    message: '',
    email: ''
  });
  const [complaintErrors, setcomplaintErrors] = useState({
    firstname: '',
    lastname: '',
    name: '',
    subject: '',
    message: '',
    email: ''
  });
  console.log('selectedCompanyToActiviate', selectedCompanyToActiviate);
  const [selectedCompany, setselectedCompany] = useState(null);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const notify = () => toast('Votre demande de devis a été envoyée avec succès');
  const notifyError = () => toast.error(t('an error occured'));
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
  }, [refresh, page]);

  function validateComplaint() {
    let errors = {
      firstname: '',
      lastname: '',
      name: '',
      subject: '',
      message: '',
      email: ''
    };
    if (!complaintDetails.name) {
      errors.name = t('please provide a title')
    }
    if (!complaintDetails.subject) {
      errors.subject = t('please provide a subject')
    }
    if (!complaintDetails.message) {
      errors.message = t('please provide a message')
    }
    
    setcomplaintErrors(errors);

    const isEmpty = Object.values(errors).every((value) => !value);
    return isEmpty;
  }
  async function sendComplaint() {
    // Add a new document with a generated id
    let ref = doc(collection(db, 'complaints'));
    let data = {
      ...complaintDetails,
      companyId: selectedCompany,
      status: 'null',
      createdAt: serverTimestamp()
    };
    setopenComplaint(false);
    if (validateComplaint()) {
      try {
        await setDoc(ref, data).then(() => {
          console.log('Complaint created successfully ');
          setComplaintDetails({
            firstname: '',
            lastname: '',
            name: '',
            subject: '',
            message: '',
            email: ''
          });
          // toast('Votre réclamation a été envoyée avec succès');
          alert('Votre réclamation a été envoyée avec succès');
        });
      } catch (error) {
        notifyError();
        console.log('An error occurred', error);
      }
    }
  }

  const notifyEmail = () => toast('Email envoyé avec succès');

  async function deleteUser(id) {
    // Deleting document with ID 'documentId' from collection 'collectionName'
    await deleteDoc(doc(db, 'companies', id))
      .then(() => {
        console.log('Successfully updated quote status');
        notify();
        setrefresh(!refresh);
      })
      .catch((err) => console.log(err));
  }
  async function fetchAllCompanies() {
    const q = query(collection(db, 'companies'), where('active', '==', true), where('visible', '==', true));

    const querySnapshot = await getDocs(q);

    let result = [];
    querySnapshot.forEach((doc) => {
      result.push({ ...doc.data(), uid: doc.id });
    });
    result.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    setCompaniesList(result);
    return result;
  }

  async function ChangeStatus(status, uid) {
    const myDocRef = doc(db, 'companies', uid);
    let data = {
      active: status
    };
    await updateDoc(myDocRef, data)
      .then(() => {
        console.log('Successfully updated quote status');
        setrefresh(!refresh);
      })
      .catch((err) => console.log(err));
  }

  const sendEmail = (e) => {
    // e.preventDefault(); // prevents the page from reloading when you hit “Send”

    emailjs
      .send(
        'service_bxxzia4',
        'template_yqp8edb',
        {
          to_name: selectedCompanyToActiviate.companyName,
          message: 'Votre compte a été désactivé',
          reply_to: selectedCompanyToActiviate.email
        },
        'DxLcEA7920DMgUR9s'
      )
      .then(
        (result) => {
          // show the user a success message
          console.log('Email envoyé avec successs');
          notifyEmail();
          alert('Email envoyé avec successs');
        },
        (error) => {
          // show the user an error
          console.log("Echec lors de l'envoi");
          notifyError();
        }
      );
  };

  function handleChangeComplaint(event) {
    let name = event.target.name;
    let value = event.target.value;
    setComplaintDetails({
      ...complaintDetails,
      [name]: value
    });
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
          padding: '15px 0px',
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
          {t('list of active companies')}
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90%' }}
        >
          <Table sx={{ miWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t('company name')}</TableCell>
                <TableCell align="center">{t('domaine')}</TableCell>
                <TableCell align="center">{t('address')}</TableCell>
                <TableCell align="center">{t('website')}</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">{t('status')}</TableCell>
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
                    {row.companyName}
                  </TableCell>
                  <TableCell align="center">{row.activityField}</TableCell>
                  <TableCell align="center">{row.address}</TableCell>
                  <TableCell align="center">{row.website}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  {row.active ? (
                    <TableCell align="center">{t('active')}</TableCell>
                  ) : (
                    <TableCell align="center">{t('inactive')}</TableCell>
                  )}

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
                      {row.active ? (
                        <DeactivateButton
                          onClick={() => {
                            // ChangeStatus(false, row.uid);
                            setselectedCompanyToActiviate(row);
                            setOpenActiviate(true);
                          }}
                        >
                          {t('deactivate')}
                        </DeactivateButton>
                      ) : (
                        <ActiviateButton
                          onClick={() => {
                            // ChangeStatus(true, row.uid);
                            setselectedCompanyToActiviate(row);
                            setOpenActiviate(true);
                          }}
                        >
                          {' '}
                          {t('activate')}
                        </ActiviateButton>
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
                      {/* <ComplaintButton
                        onClick={() => {
                          setopenComplaint(true);
                          setselectedCompany(row.uid);
                        }}
                      >
                        
                        {t('send complaint')}
                      </ComplaintButton> */}
                      {/*  */}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('of')} ${count}`}
          rowsPerPageOptions={[5, 10, 25]}
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
          <DialogContentText id="alert-dialog-description">{t('are you sure you want to delete')}?</DialogContentText>
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
      <Dialog
        open={openActiviate}
        onClose={() => setOpenActiviate(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('are you sure to deactivate this comapny')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{t('an email will be sent')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenActiviate(false)}> {t('cancel')}</Button>
          <Button
            onClick={(e) => {
              selectedCompanyToActiviate.active
                ? ChangeStatus(false, selectedCompanyToActiviate.uid)
                : ChangeStatus(true, selectedCompanyToActiviate.uid);
              sendEmail(e);
              setOpenActiviate(false);
            }}
            autoFocus
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openComplaint}
        onClose={() => setopenComplaint(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
          {t('send')} {t('a complaint')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{t('please fill these fields')}</DialogContentText>
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px' }}>
          <TextField
              required={true}
              label={t('complaint title')}
              variant="outlined"
              style={{ width: '100%', margin: '10px 0px' }}
              value={complaintDetails.name}
              name="name"
              onChange={handleChangeComplaint}
            />
            <Typography style={{ color: 'red' }}>{complaintErrors.name}</Typography>
            <TextField
              required={true}
              label={t('subject')}
              variant="outlined"
              style={{ width: '100%', margin: '10px 0px' }}
              value={complaintDetails.subject}
              name="subject"
              onChange={handleChangeComplaint}
            />
            <Typography style={{ color: 'red' }}>{complaintErrors.subject}</Typography>

            <StyledTextarea
              aria-label="minimum height"
              minRows={3}
              placeholder="Veuillez décrire votre réclamation avec plus de détails"
              style={{ width: '100%', maxWidth: '500px' }}
              onChange={handleChangeComplaint}
              name="message"
              value={complaintDetails.message}
            />
            <Typography style={{ color: 'red' }}>{complaintErrors.subject}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setopenComplaint(false)}> {t('cancel')}</Button>
          <Button
            onClick={() => {
              sendComplaint();
              setComplaintDetails({
                firstname: '',
                lastname: '',
                name: '',
                subject: '',
                message: '',
                email: ''
              });
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

export default ActiveCompanies;
