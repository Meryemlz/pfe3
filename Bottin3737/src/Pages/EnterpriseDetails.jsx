import React from 'react';
import PageTemplate from './TypesPages/PageTemplate';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  Typography
} from '@mui/material';
import LocalPhoneIcon from '@material-ui/icons/LocalPhone';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import FacebookOutlinedIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneNumberInput from 'material-ui-phone-number';
import { db } from 'src/firebase-config';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from 'src/Context/AuthContext';
import { artsList, commerceList, manufacturingList, marketingList } from 'src/utils/Arrays';
import styled from '@emotion/styled';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input/input';
import flags from 'react-phone-number-input/flags';
import { useTranslation } from 'react-i18next';
export const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 320px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px 12px 0 12px;
  color: ${'gray'};
  &:hover {
    border-color: #f2f3f4;
  }

  &:focus {
    border-color: #f2f3f4;
    box-shadow: 0 0 0 1px #f2f3f4;
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

function EnterpriseDetails() {
  const { uid } = useParams();
  const { currentUser, dispatch } = useContext(AuthContext);
  const [url, seturl] = useState('');
  console.log('uid ', uid);
  useEffect(() => {
    getUser();
  }, []);
  const [servicesOptions, setservicesOptions] = useState([]);
  console.log('serverTimestamp()', serverTimestamp());
  const [open, setOpen] = React.useState(false);
  const { t, i18n } = useTranslation();

  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    zipCode: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
    service: '',
    message: '',
    quoteTitle: ''
  });

  const [complaintErrors, setcomplaintErrors] = useState({
    firstname: '',
    lastname: '',
    name: '',
    subject: '',
    message: '',
    email: ''
  });
  const [quoteDetails, setquoteDetails] = useState({
    firstname: '',
    lastname: '',
    zipCode: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
    service: '',
    message: '',
    quoteTitle: ''
  });
  const [complaintDetails, setComplaintDetails] = useState({
    firstname: '',
    lastname: '',
    name: '',
    subject: '',
    message: '',
    email: ''
  });
  const [userInfo, setuserInfo] = useState({
    companyName: '',
    address: '',
    zipCode: '',
    city: '',
    neq: '',
    phoneNumber: '',
    email: '',
    website: '',
    activityField: '',
    services: [],
    visible: false,
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: '',
    imageUrl: '',
    description: ''
  });
  async function getUser() {
    const docRef = doc(db, 'companies', uid); // Creating reference to the document with specified UID
    const docSnap = await getDoc(docRef); // Retrieving the document snapshot

    if (docSnap.exists()) {
      //@ts-ignore
      setuserInfo(docSnap.data());
      selectServicesArray(docSnap.data()['activityField']);
      console.log("docSnap.data()['imageUrl']", docSnap.data()['imageUrl']);
      seturl(docSnap.data()['imageUrl']);
    } else {
      console.log('No such document!');
    }
  }
  const notify = () => toast(t('your quote request is sent'));
  const notifyError = () => toast.error(t('an error occured'));
  function handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    setquoteDetails({
      ...quoteDetails,
      [name]: value
    });
  }
  function handleChangeComplaint(event) {
    let name = event.target.name;
    let value = event.target.value;
    setComplaintDetails({
      ...complaintDetails,
      [name]: value
    });
  }
  const handlePhoneNumberChange = (event) => {
    // Remove all non-digit characters from the input value
    const phoneNumber = event.target.value.replace(/\D/g, '');
    console.log('event.target.value', event.target.value);
    setquoteDetails({
      ...quoteDetails,
      phoneNumber: phoneNumber
    });
  };
  async function SaveQuoteRequest() {
    // Add a new document with a generated id
    let ref = doc(collection(db, 'quotes'));
    let data = {
      ...quoteDetails,
      companyId: uid,
      status: 'null',
      createdAt: serverTimestamp()
    };
    console.log('validateQuotes()====', validateQuotes());
    if (validateQuotes()) {
      try {
        await setDoc(ref, data).then(() => {
          console.log('Quote created successfully ');
          setquoteDetails({
            firstname: '',
            lastname: '',
            zipCode: '',
            address: '',
            city: '',
            phoneNumber: '',
            email: '',
            service: '',
            message: '',
            quoteTitle: ''
          });
          notify();
        });
      } catch (error) {
        notifyError();
        console.log('An error occurred', error);
      }
    }
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function selectServicesArray(type) {
    console.log('Received type: ' + type);
    switch (type) {
      case 'Fabrication':
        setservicesOptions(manufacturingList);
        break;
      case 'Arts':
        setservicesOptions(artsList);
        break;
      case 'Marketing':
        setservicesOptions(marketingList);
        break;
      case 'Commerce':
        setservicesOptions(commerceList);
        break;
      default:
        setservicesOptions([]);
        break;
    }
  }

  function validateQuotes() {
    let errors = {
      firstname: '',
      lastname: '',
      zipCode: '',
      address: '',
      city: '',
      phoneNumber: '',
      email: '',
      service: '',
      message: '',
      quoteTitle: ''
    };
    if (!quoteDetails.firstname) {
      errors.firstname = 'Veuillez renseigner votre prénom';
    }
    if (!quoteDetails.lastname) {
      errors.lastname = 'Veuillez renseigner votre nom';
    }

    if (!quoteDetails.address) {
      errors.address = 'Veuillez renseigner votre addresse';
    }

    if (!quoteDetails.phoneNumber) {
      errors.phoneNumber = 'Veuillez renseigner votre numéro de téléphone';
    }
    if (!quoteDetails.email) {
      errors.email = 'Veuillez renseigner votre email';
    }
    if (!quoteDetails.quoteTitle) {
      errors.quoteTitle = 'Veuillez renseigner un titre pour votre demande de devis';
    }
    if (!quoteDetails.message) {
      errors.message = 'Veuillez décrire votre besoin';
    }
    setErrors(errors);
    console.log('errors ============>', errors);
    const isEmpty = Object.values(errors).every((value) => !value);
    return isEmpty;
  }
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
      errors.name = t('please provide a title');
    }
    if (!complaintDetails.subject) {
      errors.subject = t('please provide a subject');
    }
    if (!complaintDetails.message) {
      errors.message = 'Veuillez renseigner un message';
    }
    if (!complaintDetails.email) {
      errors.email = 'Veuillez renseigner un email ';
    }
    if (!complaintDetails.firstname) {
      errors.firstname = t('please provide a message');
    }
    if (!complaintDetails.lastname) {
      errors.lastname = t('please provide a message');
    }
    setcomplaintErrors(errors);

    const isEmpty = Object.values(errors).every((value) => !value);
    return isEmpty;
  }
  useEffect(() => {
    selectServicesArray(userInfo.activityField);
  }, [userInfo.activityField]);

  return (
    <PageTemplate>
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0px 0px 150px' }}>
        {userInfo && (
          <>
            <Box
              style={{
                flex: 1,
                height: '100%',
                backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/bottin-37-37.appspot.com/o/banner-bckg.png?alt=media&token=180719d5-36a6-4e40-b7cd-430f8dd5606c)`,
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box
                style={{
                  padding: '50px 0px 50px 100px ',
                  width: '80%',
                  backgroundColor: 'rgb(40, 51, 57,0.85)',
                  margin: '50px 0px',
                  borderRight: '#00bd9a 1px solid'
                }}
              >
                <Avatar variant="rounded" src={userInfo.imageUrl} sx={{ width: 150, height: 150 }} />
                <Typography style={{ fontSize: '18px', padding: '10px 0px', color: 'white', fontWeight: '600' }}>
                  {userInfo.companyName}
                </Typography>
              </Box>
            </Box>
            <Box
              style={{ backgroundColor: '#F2F3F4', height: '50%', justifyContent: 'center', display: 'flex', flex: 1 }}
            >
              <Box
                flexGrow={1}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Box
                  style={{
                    display: 'flex',
                    // alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '80%'
                  }}
                >
                  <Box style={{ flex: 3, padding: '30px', margin: '0px 10px' }}>
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '20px 0px',
                        borderRadius: 15,
                        padding: 15,
                        backgroundColor: 'white'
                      }}
                    >
                      <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px' }}>
                        <LocalPhoneIcon style={{ color: '#00bd9a', marginRight: '5px' }} />
                        <Typography style={{ margin: '0px 5px' }}>{userInfo.phoneNumber}</Typography>
                      </Box>
                      <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px' }}>
                        <AlternateEmailIcon style={{ color: '#00bd9a', marginRight: '5px' }} />
                        <Typography style={{ margin: '0px 5px' }}>{userInfo.email}</Typography>
                      </Box>
                      <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px' }}>
                        <LinkIcon style={{ color: '#00bd9a', marginRight: '5px' }} />
                        <Typography style={{ margin: '0px 5px' }}>{userInfo.website}</Typography>
                      </Box>
                    </Box>
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        margin: '20px 0px',
                        borderRadius: 15,
                        padding: 15,
                        backgroundColor: 'white'
                      }}
                    >
                      <Typography>{userInfo.description}</Typography>
                    </Box>
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        margin: '0px 0px',
                        borderRadius: 15,
                        padding: 15,
                        backgroundColor: 'white'
                      }}
                    >
                      <Box style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography style={{ margin: '0px 0px', fontSize: '18px', fontWeight: '600' }}>
                          {t('prestations')}
                        </Typography>
                        <Box style={{ padding: '10px', display: 'flex', flexDirection: 'row' }}>
                          <Typography style={{ fontSize: '16px' }}>{t('domaine')} :</Typography>
                          <Typography style={{ fontSize: '16px', margin: '0px 5px' }}>
                            {userInfo.activityField}
                          </Typography>
                        </Box>
                        {userInfo.services && (
                          <Box style={{ margin: '20px 0px', padding: '10px' }}>
                            <Typography>Services : </Typography>
                            {userInfo.services.map((service, index) => {
                              return (
                                <Box
                                  key={index}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: '5px'
                                  }}
                                >
                                  <CheckCircleIcon style={{ color: '#00bd9a', marginRight: '5px' }} />
                                  <Typography style={{ fontSize: '15px', textAlign: 'center' }}>{service}</Typography>;
                                </Box>
                              );
                            })}
                          </Box>
                        )}
                      </Box>
                    </Box>
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        margin: '20px 0px',
                        borderRadius: 15,
                        padding: 15,
                        backgroundColor: 'white'
                      }}
                    >
                      <Box style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Typography style={{ margin: '0px 0px', fontSize: '18px', fontWeight: '600' }}>
                          Contact
                        </Typography>
                        <Box
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Box style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <Box
                              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px' }}
                            >
                              <FacebookOutlinedIcon style={{ color: '#00bd9a', marginRight: '5px' }} />
                              <Typography style={{ margin: '0px 5px' }}>{userInfo.facebook}</Typography>
                            </Box>
                            <Box
                              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px' }}
                            >
                              <TwitterIcon style={{ color: '#00bd9a', marginRight: '5px' }} />
                              <Typography style={{ margin: '0px 5px' }}>{userInfo.twitter}</Typography>
                            </Box>
                          </Box>
                          <Box style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <Box
                              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px' }}
                            >
                              <InstagramIcon style={{ color: '#00bd9a', marginRight: '5px' }} />
                              {/* <Typography style={{ margin: '0px 5px' }}>Instagram :</Typography> */}
                              <Typography style={{ margin: '0px 5px' }}>{userInfo.instagram}</Typography>
                            </Box>
                            <Box
                              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px' }}
                            >
                              <LinkedInIcon style={{ color: '#00bd9a', marginRight: '5px' }} />
                              {/* <Typography style={{ margin: '0px 5px' }}>Linkedin :</Typography> */}
                              <Typography style={{ margin: '0px 5px' }}>{userInfo.linkedin}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box style={{ flex: 2, backgroundColor: '#F2F3F4', padding: '30px', margin: '0px 10px' }}>
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '20px 0px',
                        borderRadius: 15,
                        padding: 15,
                        backgroundColor: 'white'
                      }}
                    >
                      <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px' }}>
                        <LocationOnIcon style={{ color: '#00bd9a', marginRight: '5px' }} />
                        <Typography style={{ margin: '0px 5px' }}>{userInfo.address}</Typography>
                      </Box>
                      <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px' }}>
                        <LocationCityIcon style={{ color: '#00bd9a', marginRight: '5px' }} />
                        <Typography style={{ margin: '0px 5px' }}>
                          {userInfo.city}, {userInfo.zipCode}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '60px 0px',
                        borderRadius: 15,
                        padding: 15,
                        backgroundColor: 'white'
                      }}
                    >
                      <Typography style={{ margin: '0px 0px', fontSize: '18px', fontWeight: '600' }}>
                        {t('ask for a quote')}
                      </Typography>
                      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px' }}>
                        <TextField
                          required={true}
                          label={t('firstname')}
                          variant="outlined"
                          style={{ width: '100%', margin: '10px 0px' }}
                          value={quoteDetails.firstname}
                          name="firstname"
                          onChange={handleChange}
                        />
                        <Typography style={{ color: 'red' }}>{errors.firstname}</Typography>
                        <TextField
                          required={true}
                          label={t('name')}
                          variant="outlined"
                          style={{ width: '100%', margin: '10px 0px' }}
                          value={quoteDetails.lastname}
                          name="lastname"
                          onChange={handleChange}
                        />
                        <Typography style={{ color: 'red' }}>{errors.lastname}</Typography>

                        <TextField
                          required={true}
                          label={t('email')}
                          variant="outlined"
                          style={{ width: '100%', margin: '10px 0px' }}
                          value={quoteDetails.email}
                          name="email"
                          onChange={handleChange}
                        />
                        <Typography style={{ color: 'red' }}>{errors.email}</Typography>

                        <TextField
                          label={t('address')}
                          variant="outlined"
                          style={{ width: '100%', margin: '10px 0px' }}
                          value={quoteDetails.address}
                          name="address"
                          onChange={handleChange}
                        />
                        <Typography style={{ color: 'red' }}>{errors.address}</Typography>

                        <TextField
                          required={true}
                          label={t('phoneNumber')}
                          variant="outlined"
                          style={{ width: '100%', margin: '10px 0px' }}
                          value={quoteDetails.phoneNumber}
                          onChange={(e) => handlePhoneNumberChange(e)}
                          placeholder="Enter your phone number"
                          InputProps={{
                            inputComponent: PhoneMaskCustom,
                            style: { fontSize: '16px' }
                            // maxLength: 14
                          }}
                        />
                        <Typography style={{ color: 'red' }}>{errors.phoneNumber}</Typography>

                        <TextField
                          required={true}
                          label={t('quote title')}
                          variant="outlined"
                          style={{ width: '100%', margin: '10px 0px' }}
                          value={quoteDetails.quoteTitle}
                          name="quoteTitle"
                          onChange={handleChange}
                        />
                        <Typography style={{ color: 'red' }}>{errors.quoteTitle}</Typography>

                        <StyledTextarea
                          aria-label="minimum height"
                          minRows={3}
                          placeholder={t('describe your complaint')}
                          style={{ width: '100%', maxWidth: '300px' }}
                          onChange={handleChange}
                          name="message"
                          value={quoteDetails.message}
                        />
                        <Typography style={{ color: 'red' }}>{errors.message}</Typography>

                        <Button variant="outlined" onClick={SaveQuoteRequest} style={{ margin: '50px 0px' }}>
                          {t('send')}
                        </Button>
                      </Box>
                    </Box>
                    {/* <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '20px 0px',
                        borderRadius: 15,
                        padding: 15,
                        backgroundColor: 'white'
                      }}
                    >
                      <Typography style={{ margin: '0px 0px', fontSize: '18px', fontWeight: '600' }}>
                        {t('send')} {t('a complaint')}
                      </Typography>
                      <Typography style={{ margin: '0px 0px', fontWeight: '500' }}>
                        {t('you can send a complaint')}
                      </Typography>
                      <Box
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={handleClickOpen}
                          style={{ margin: '50px 0px', width: '40%' }}
                        >
                          {t('send')}
                        </Button>
                      </Box>
                    </Box> */}
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>

      <ToastContainer />
    </PageTemplate>
  );
}

export default EnterpriseDetails;

function PhoneMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <input
      {...other}
      ref={(ref) => {
        if (inputRef) {
          if (typeof inputRef === 'function') {
            inputRef(ref);
          } else {
            inputRef.current = ref;
          }
        }
      }}
      type="tel"
      pattern="\d{3}-\d{3}-\d{4}"
      maxLength="14"
      placeholder="(123)-456-7890"
    />
  );
}
