import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material';
import React from 'react';
import { useState } from 'react';
import MainButton from 'src/Components/MainButton';
import { StyledTextarea } from '../EnterpriseDetails';
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from 'src/firebase-config';
import { useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { DeleteButton } from '../AdminDashboard/EnterprisesList';
import { useTranslation } from 'react-i18next';
let seen = 'consulté';
let processing = 'En cours de traitement';
let processed = 'traité';

function ComplaintItem({ quote, type, refresh, setrefresh }) {
  const [quoteProgress, setquoteProgress] = useState(0);
  const [response, setresponse] = useState('');
  const [quoteStatus, setquoteStatus] = useState(null);
  const [currentQuoteId, setcurrentQuoteId] = useState('');
  const [selectedQuote, setselectedQuote] = useState(null);

  async function setFirstState(status, uid) {
    handleClickOpen();
    setquoteProgress(1);
    setquoteStatus(status);
    await SaveQuoteRequest(status, uid);
  }

  /**
   * @param {string} status
   * @param {string} [uid]
   */
  async function SaveQuoteRequest(status, uid) {
    const myDocRef = doc(db, 'complaints', uid);
    let data = {
      status: status,
      message: response
    };
    await updateDoc(myDocRef, data)
      .then(() => {
        console.log('Successfully updated quote status');
      })
      .catch((err) => console.log(err));
  }
  const { t, i18n } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const [openDelete, setopenDelete] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendEmail = (e) => {
    e.preventDefault(); // prevents the page from reloading when you hit “Send”

    emailjs
      .send(
        'service_pt78wff',
        'template_mjh3d6t',
        { to_name: quote.firstname, message: response, reply_to: quote.email },
        'vpOkpOZeoKn683Wci'
      )
      .then(
        (result) => {
          // show the user a success message
          console.log('Email envoyé avec successs');
          alert('Email envoyé avec success');
        },
        (error) => {
          // show the user an error
          console.log("Echec lors de l'envoi");
        }
      );
  };
  const notify = () => toast('Votre réclamation a été supprimée avec succès');

  async function deleteQuote(id) {
    // Deleting document with ID 'documentId' from collection 'collectionName'
    await deleteDoc(doc(db, 'complaints', id))
      .then(() => {
        console.log('Successfully updated quote status');
        notify();
        setrefresh(!refresh);
      })
      .catch((err) => console.log(err));
  }
  async function setSecondState(status, uid) {
    setquoteProgress(2);
    setquoteStatus(status);
    await SaveQuoteRequest(status, uid);
    handleClose();
  }

  async function handleQuoteMessage(e, uid) {
    let inputValue = e.target.value;
    setcurrentQuoteId(uid);
    setresponse(inputValue);
    if (inputValue.length == 1) {
      await SaveQuoteRequest(processing, uid);
    }
  }
  return (
    <Box
      style={{
        margin: '20px',
        padding: '15px',
        backgroundColor: '#f2f3f4',
        borderRadius: '15px',
        borderRight: '#00bd9a 2px solid'
      }}
    >
      <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography style={{ fontSize: '17px', fontWeight: '600', marginRight: '5px' }}>
            {t('complaint name')}:{' '}
          </Typography>
          <Typography style={{ fontSize: '17px', fontWeight: '600' }}>{quote.name}</Typography>
        </Box>
        <Box sx={{ width: '20%' }}>
          {type == 0 && (
            <DeleteButton
              onClick={() => {
                setselectedQuote(quote.uid);
                setopenDelete(true);
              }}
              autoFocus
            >
              {t('delete')}
            </DeleteButton>
          )}
          {type == 1 && <MainButton text="Consulter" onClick={() => setFirstState(seen, quote.uid)} />}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}></Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" sx={{ padding: '50px' }}>
        {quote.name ? (
          <DialogTitle id="alert-dialog-title">{quote.name}</DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">{t('complaint')}</DialogTitle>
        )}
        <DialogContent>
          <Box
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', width: 'fit-content' }}
            display="inline-block"
            width="fit-content"
          >
            <Box style={{ flex: 1 }} display="inline-block" width="fit-content">
              <Box
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                display="inline-block"
                width="fit-content"
              >
                <Typography style={{ padding: '5px' }}>{t('name')} :</Typography>
                <Typography>{quote.lastname}</Typography>
              </Box>
            </Box>
            
          </Box>
          {quoteProgress > 0 && (
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography style={{ margin: '5px' }}>Message :</Typography>
              <Typography style={{ margin: '5px' }}>{quote.message}</Typography>
            </Box>
          )}

          {quoteProgress > 0 && (
            <StyledTextarea
              aria-label="minimum height"
              minRows={3}
              placeholder={t('please write an answer')}
              style={{ maxWidth: '95%', width: '94%' }}
              onChange={async (e) => await handleQuoteMessage(e, quote.uid)}
              name="message"
              value={response}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}> {t('cancel')}</Button>

          <Button
            onClick={(e) => {
              setSecondState(processed, quote.uid);
              sendEmail(e);
            }}
            autoFocus
          >
            {t('answer')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelete}
        onClose={() => setopenDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title"> {t('confirm deletion')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{t('confirm deletion')} ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setopenDelete(false)}> {t('cancel')}</Button>
          <Button
            onClick={() => {
              deleteQuote(selectedQuote);
              setopenDelete(false);
            }}
            autoFocus
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ComplaintItem;
