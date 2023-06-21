import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import ReCAPTCHA from 'react-google-recaptcha';

import React, { useContext, useEffect } from 'react';
import DetailsBlock from './DetailsBlock';
import FieldBlock from './FieldBlock';
import { AuthContext } from 'src/Context/AuthContext';
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from 'src/firebase-config';
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore'; // Importing necessary functions
import { updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { activityFields, artsList, commerceList, manufacturingList, marketingList } from 'src/utils/Arrays';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useTranslation } from 'react-i18next';
import { StyledTextarea } from '../EnterpriseDetails';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

function ProfileDetails() {
  const { currentUser, dispatch } = useContext(AuthContext);
  const [updateUserInfo, setupdateUserInfo] = useState(false);
  const [updateCredentials, setupdateCredentials] = useState(false);
  const { t, i18n } = useTranslation();

  const [updateParams, setupdateParams] = useState(false);

  const [updateSocialInfo, setupdateSocialInfo] = useState(false);
  const [image, setimage] = useState(null);
  const [url, seturl] = useState(currentUser?.photoURL);
  const [openComplaint, setopenComplaint] = React.useState(false);

  const [userInfo, setuserInfo] = useState({
    name: '',
    address: '',
    zipCode: '',
    city: '',
    neq: '',
    phoneNumber: '',
    email: '',
    website: '',
    activityField: '',
    services: '',
    visible: false
  });
  const [socialInfo, setsocialInfo] = useState({
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: ''
  });
  const uid = currentUser.uid;
  const [updatePhoto, setupdatePhoto] = useState(false);
  const [personName, setPersonName] = React.useState([]);
  const [checked, setChecked] = useState(false);
  const [servicesOptions, setservicesOptions] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [openSocialInfo, setOpenSocialInfo] = React.useState(false);
  const [openCredentials, setOpenCredentials] = React.useState(false);
  const [openVisible, setOpenVisible] = React.useState(false);
  const [openDeactiviate, setopenDeactiviate] = React.useState(false);

  const [refresh, setrefresh] = useState(false);
  const [age, setAge] = React.useState('');
  const [complaintErrors, setcomplaintErrors] = useState({
    firstname: '',
    lastname: '',
    name: '',
    subject: '',
    message: '',
    email: ''
  });

  const [complaintDetails, setComplaintDetails] = useState({
    firstname: '',
    lastname: '',
    name: '',
    subject: '',
    message: '',
    email: ''
  });
  const handleChangeAge = (event) => {
    setAge(event.target.value);
  };
  const handleCloseVisible = () => {
    setOpenVisible(false);
  };
  const handleCloseCredentials = () => {
    setOpenCredentials(false);
  };
  const handleCloseDeactivate = () => {
    setopenDeactiviate(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseSocialInfo = () => {
    setOpenSocialInfo(false);
  };
  function onChange(value) {
    console.log('Captcha value:', value);
  }
  const handleChangeService = (event) => {
    const {
      target: { value }
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    setuserInfo({
      ...userInfo,
      services: typeof value === 'string' ? value.split(',') : value
    });
  };
  function handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    setuserInfo({
      ...userInfo,
      [name]: value
    });
  }

  function handleSocialInfoChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    setsocialInfo({
      ...socialInfo,
      [name]: value
    });
  }

  function handleImageChange(e) {
    if (e.target.files[0]) {
      setimage(e.target.files[0]);
    }
  }

  function changePassword() {
    // const auth = getAuth();
    const emailAddress = userInfo.email;

    sendPasswordResetEmail(auth, emailAddress)
      .then(() => {
        // Password reset email sent successfully!
        alert('Email envoyé avec succès');
        setupdateCredentials(!updateCredentials);
      })
      .catch((error) => {
        // An error occurred while sending the password reset email.
        console.log(error);
      });
  }
  function updateProfilePicture() {
    const imageRef = ref(storage, `image-${currentUser.uid}`);
    const myDocRef = doc(db, 'companies', uid);
    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then(async (imageUrl) => {
            await updateDoc(myDocRef, {
              imageUrl: imageUrl
            })
              .then(() => {
                console.log('Successfully updated user info');
                seturl(imageUrl);
                updateProfile(auth.currentUser, {
                  photoURL: imageUrl
                })
                  .then(() => {
                    seturl(imageUrl);
                    console.log('User profile updated successfully!');
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              })
              .catch((err) => console.log(err));
          })
          .catch((error) => {
            console.log('Error downloading image');
          });
        setimage(null);
      })
      .catch((error) => {
        console.log('Error downloading image');
      });
  }
  function validateComplaint() {
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
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
    if (!complaintDetails.email && !pattern.test(complaintDetails.email)) {
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
    getUser();
    selectServicesArray(userInfo.activityField);
  }, [refresh]);

  async function getUser() {
    const docRef = doc(db, 'companies', uid); // Creating reference to the document with specified UID
    const docSnap = await getDoc(docRef); // Retrieving the document snapshot

    if (docSnap.exists()) {
      //@ts-ignore
      setuserInfo(docSnap.data());
      setsocialInfo({
        linkedin: docSnap.data()['linkedin'],
        facebook: docSnap.data()['facebook'],
        instagram: docSnap.data()['instagram'],
        twitter: docSnap.data()['twitter']
      });
    } else {
      console.log('No such document!');
    }
  }

  async function updateSocialInfoInDB() {
    const myDocRef = doc(db, 'companies', uid);
    await updateDoc(myDocRef, {
      linkedin: socialInfo.linkedin || null,
      facebook: socialInfo.facebook || null,
      instagram: socialInfo.instagram || null,
      twitter: socialInfo.twitter || null
    })
      .then(() => {
        console.log('Successfully updated user info');
        setupdateSocialInfo(false);
        handleCloseSocialInfo();
      })
      .catch((err) => console.log(err));
  }
  async function updateUserInfoInDB() {
    const myDocRef = doc(db, 'companies', uid);
    await updateDoc(myDocRef, userInfo)
      .then(() => {
        console.log('Successfully updated user info');
        setupdateUserInfo(false);
        handleClose();
      })
      .catch((err) => console.log(err));
  }
  async function updateParamsInDB() {
    const myDocRef = doc(db, 'companies', uid);
    await updateDoc(myDocRef, {
      visible: checked
    })
      .then(() => {
        console.log('Successfully updated user info');
        setupdateParams(false);
        setuserInfo({
          ...userInfo,
          visible: checked
        });
        setOpenVisible(false);
      })
      .catch((err) => console.log(err));
  }
  function handleSignOut(e) {
    e.preventDefault();
    auth
      .signOut()
      .then(() => {
        navigation('/');
      })
      .then(() => localStorage.removeItem('user'))
      .then(() => window.location.reload())

      .catch((error) => console.error(error));
  }
  const navigation = useNavigate();
  async function deleteUser(id) {
    // Deleting document with ID 'documentId' from collection 'collectionName'
    await deleteDoc(doc(db, 'companies', id))
      .then(() => {
        console.log('Successfully updated quote status');
        alert('Account successfully deleted');
        handleCloseDeactivate();
        setrefresh(!refresh);
        navigation('/');
        handleSignOut()
      })
      .catch((err) => console.log(err));
  }
  async function updateDeactivateState() {
    await deleteUser(uid);
  }
  const handleParamChange = (event) => {
    setChecked(event.target.checked);
  };
  function selectServicesArray(type) {
    switch (type) {
      case 'Fabrication':
        setservicesOptions(manufacturingList);
        return;
      case 'Arts':
        setservicesOptions(artsList);
        return;
      case 'Marketing':
        setservicesOptions(marketingList);
        return;
      case 'Commerce':
        setservicesOptions(commerceList);
        return;
      default:
        setservicesOptions([]);
        return;
    }
  }
  let services = userInfo.services;
  console.log('userInfo', userInfo, typeof userInfo);
  function handleChangeComplaint(event) {
    let name = event.target.name;
    let value = event.target.value;
    setComplaintDetails({
      ...complaintDetails,
      [name]: value
    });
  }
  const notifyError = () => toast.error(t('an error occured'));

  async function removeService(itemToRemove) {
    const docRef = doc(db, 'companies', uid);

    // Update the document by removing an item from the 'myArray' field
    await updateDoc(docRef, {
      services: arrayRemove(itemToRemove)
    })
      .then((response) => {
        setrefresh(!refresh);
        console.log('Successfully updated services array', response);
      })
      .catch((err) => console.log(err));
  }

  async function sendComplaint() {
    // Add a new document with a generated id
    let ref = doc(collection(db, 'complaints'));
    let data = {
      ...complaintDetails,
      companyId: uid,
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
          toast('Votre réclamation a été envoyée avec succès');
          alert('Votre réclamation a été envoyée avec succès');
        });
      } catch (error) {
        notifyError();
        console.log('An error occurred', error);
      }
    }
  }
  async function addElementToArray(element) {
    const docRef = doc(db, 'companies', uid);

    await updateDoc(docRef, {
      services: arrayUnion(element)
    })
      .then((response) => {
        setrefresh(!refresh);
        console.log('Successfully updated services array', response);
      })
      .catch((err) => console.log(err));
  }
  return (
    <Box flexGrow={1}>
      <Typography style={{ textAlign: 'center', fontWeight: '700', fontSize: '18px', margin: '20px 0px' }}>
        {t('welcome to your profile')} {currentUser.name}!
      </Typography>

      <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', flex: 1, height: '85%' }}>
        <Box style={{ flex: 1, margin: '0px 20px', height: '100%' }}>
          <DetailsBlock
            blockTitle={t('My company profile')}
            setter={setOpen}
            value={updateUserInfo}
            customText="update"
          >
            <Box
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              <Avatar src={url} sx={{ width: 150, height: 150 }} />
              {updatePhoto ? (
                <Box style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <input type="file" onChange={handleImageChange} accept="image/*" />
                  <Button variant="outlined" onClick={() => updateProfilePicture()} style={{ margin: '10px' }}>
                    {t('save')}
                  </Button>
                </Box>
              ) : (
                <Button variant="outlined" onClick={() => setupdatePhoto(true)} style={{ margin: '10px 0px' }}>
                  {t('change')}
                </Button>
              )}
            </Box>

            <Box>
              <FieldBlock fieldName={t('legal company name')} value={userInfo.name} />
              <FieldBlock fieldName={t('address')} value={userInfo.address} />
              <FieldBlock fieldName={t('zipcode')} value={userInfo.zipCode} />
              <FieldBlock fieldName={t('city')} value={userInfo.city} />
              <FieldBlock fieldName="NEQ :" value={userInfo.neq} />
              {/* <ReCAPTCHA sitekey="6LeBnp8mAAAAAHj0xnw-mcsowpsnyNCgaV7JRm0Q" onChange={onChange} /> */}
              <FieldBlock fieldName={t('phoneNumber')} value={userInfo.phoneNumber} />
              <FieldBlock fieldName={t('email')} value={userInfo.email} />
              <FieldBlock fieldName={t('website')} value={userInfo.website} />
              <FieldBlock fieldName={t('domaine')} value={userInfo.activityField} />
              <Typography style={{ color: 'black' }}>{t('prestations')} : </Typography>
              <Table sx={{}} aria-label="simple table">
                <TableHead>
                  <TableRow>{/* <TableCell>Services</TableCell> */}</TableRow>
                </TableHead>
                <TableBody>
                  {services &&
                    services.map((row, index) => (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {row}
                        </TableCell>
                        <TableCell align="right"> </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </DetailsBlock>
        </Box>
        <Box
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            height: '100%'
          }}
        >
          <DetailsBlock
            blockTitle={t('my credentials')}
            setter={setupdateCredentials}
            value={updateCredentials}
            customText=""
          >
            {updateCredentials ? (
              <Box>
                <Typography style={{ color: 'black', width: '80%', margin: '10px' }}>
                  {t('would you like to receive email')}
                </Typography>
                <Button variant="outlined" onClick={() => changePassword()}>
                  {t('send')}
                </Button>
              </Box>
            ) : (
              <Box>
                <FieldBlock fieldName={t('your email')} value={userInfo.email} />
                <FieldBlock fieldName={t('your password')} value="**********" />
              </Box>
            )}
          </DetailsBlock>
          <DetailsBlock
            blockTitle={t('My social accounts')}
            setter={setOpenSocialInfo}
            value={updateSocialInfo}
            customText=""
          >
            <Box>
              <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <LinkedInIcon style={{ color: '#00bd9a', padding: '0px 5px' }} />
                <FieldBlock fieldName="LinkedIN :" value={socialInfo.linkedin} clickable={true} />
              </Box>
              <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <FacebookIcon style={{ color: '#00bd9a', padding: '0px 5px' }} />
                <FieldBlock fieldName="Facebook :" value={socialInfo.facebook} clickable={true} />
              </Box>
              <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <InstagramIcon style={{ color: '#00bd9a', padding: '0px 5px' }} />
                <FieldBlock fieldName="Instagram :" value={socialInfo.instagram} clickable={true} />
              </Box>
              <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <TwitterIcon style={{ color: '#00bd9a', padding: '0px 5px' }} />
                <FieldBlock fieldName="Twitter :" value={socialInfo.twitter} clickable={true} />
              </Box>
            </Box>
          </DetailsBlock>
          <DetailsBlock blockTitle={t('settings')} setter={setOpenVisible} value={updateParams} customText="">
            <FieldBlock fieldName={t('manage visibility')} />
            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px 0px' }}>
              {userInfo.visible ? (
                <RemoveRedEyeIcon style={{ color: 'black' }} />
              ) : (
                <VisibilityOffIcon style={{ color: 'black' }} />
              )}

              <Typography style={{ margin: '0px 5px', color: 'black' }}>
                {userInfo.visible ? `${t('you are visible')}` : `${t('You are not visible')}`}
              </Typography>
            </Box>
          </DetailsBlock>
          <DetailsBlock blockTitle={t('deactivation')} setter={setopenDeactiviate} value={updateParams} customText="">
            <FieldBlock fieldName={t('manage activity')} />
            {userInfo.deactiviateRequest && (
              <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography>{t('Already sent deactivation request')} </Typography>
              </Box>
            )}
          </DetailsBlock>
          <DetailsBlock blockTitle={t('send complaint')} setter={setopenComplaint} value={openComplaint} customText="">
            <FieldBlock fieldName={t('you can complain')} />
          </DetailsBlock>
          {/* update profile info modal */}
          <Dialog open={open} onClose={handleClose} sx={{ padding: '0px 10px' }}>
            <DialogTitle>{t('update your info')}</DialogTitle>
            <DialogContent>
              <DialogContentText>{t('update you company infos')}</DialogContentText>
              <Box
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: '10px 0px'
                }}
              >
                {/* <TextField
                  label={t('legal company name')}
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  value={userInfo.name}
                  name="name"
                  onChange={handleChange}
                />
                <TextField
                  label={t('address')}
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  name="address"
                  value={userInfo.address}
                  onChange={handleChange}
                />
                <TextField
                  id="outlined-basic"
                  label={t('zipcode')}
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  value={userInfo.zipCode}
                  name="zipCode"
                  onChange={handleChange}
                />
                <TextField
                  id="outlined-basic"
                  label={t('city')}
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  value={userInfo.city}
                  name="city"
                  onChange={handleChange}
                />
                <TextField
                  id="outlined-basic"
                  label="NEQ"
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  value={userInfo.neq}
                  name="neq"
                  onChange={handleChange}
                />
                <TextField
                  label={t('phoneNumber')}
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  value={userInfo.phoneNumber}
                  name="phoneNumber"
                  onChange={handleChange}
                />
                <TextField
                  id="outlined-basic"
                  label={t('email')}
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  value={userInfo.email}
                  name="email"
                  onChange={handleChange}
                /> */}
                {/* <TextField
                  label={t('email')}
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  value={userInfo.website}
                  name="website"
                  onChange={handleChange}
                /> */}
                {/* <FormControl
                  fullWidth
                  style={{
                    width: '80%',
                    margin: '10px 0px'
                  }}
                >
                  <InputLabel id="demo-simple-select-label">{t('domaine')}</InputLabel>
                  <Select
                    value={userInfo.activityField}
                    name="activityField"
                    label={t('domaine')}
                    onChange={(e) => {
                      handleChange(e);
                      console.log('Selected activity', e.target.value);
                      selectServicesArray(e.target.value);
                    }}
                  >
                    {activityFields.map((activityField) => {
                      return <MenuItem value={activityField.value}>{activityField.label}</MenuItem>;
                    })}
                  </Select>
                </FormControl> */}

                <TableContainer component={Paper} sx={{ width: '80%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      backgroundColor: '#f2f3f4',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      flexDirection: 'row',
                      margin: '10px 0px'
                    }}
                  >
                    <FormControl fullWidth sx={{}}>
                      <InputLabel id="demo-simple-select-label">Service</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Service"
                        onChange={handleChangeAge}
                      >
                        {servicesOptions.map((name) => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton onClick={(row) => addElementToArray(age)}>
                      <AddCircleIcon style={{ color: '#00bd9a' }} />
                    </IconButton>
                  </Box>
                  <Table sx={{}} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {services &&
                        services.map((row, index) => (
                          <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                              {row}
                            </TableCell>
                            <TableCell align="right">
                              {' '}
                              <IconButton onClick={(row) => removeService(services[index])}>
                                <DeleteIcon style={{ color: 'red' }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>{t('cancel')}</Button>
              <Button onClick={updateUserInfoInDB} autoFocus>
                {t('confirm')}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openSocialInfo}
            onClose={handleCloseSocialInfo}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{t('update social info')}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">{t('please update social media')}</DialogContentText>
              <Box
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <TextField
                  label="LinkedIN"
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  value={socialInfo.linkedin}
                  name="linkedin"
                  onChange={handleSocialInfoChange}
                />

                <TextField
                  label="Facebook"
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  name="facebook"
                  value={socialInfo.facebook}
                  onChange={handleSocialInfoChange}
                />
                <TextField
                  label="Instagram"
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  name="instagram"
                  value={socialInfo.instagram}
                  onChange={handleSocialInfoChange}
                />
                <TextField
                  label="Twitter"
                  variant="outlined"
                  style={{ width: '80%', margin: '10px 0px' }}
                  name="twitter"
                  value={socialInfo.twitter}
                  onChange={handleSocialInfoChange}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSocialInfo}>{t('cancel')}</Button>
              <Button onClick={updateSocialInfoInDB} autoFocus>
                {t('confirm')}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openVisible} onClose={handleCloseVisible}>
            <DialogTitle id="alert-dialog-title">{t('manage visibility')}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Typography style={{ margin: '0px 5px', color: 'black' }}>
                  {userInfo.visible ? `${t('you are visible')}` : `${t('You are not visible')}`}
                </Typography>
              </DialogContentText>
              <Box
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={checked} onChange={handleParamChange} />}
                    label={userInfo.visible ? `${t('dont want visible')}` : `${t(' want visible')}`}
                  />
                </FormGroup>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseVisible}>{t('cancel')}</Button>
              <Button onClick={updateParamsInDB} autoFocus>
                {t('confirm')}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openDeactiviate} onClose={handleCloseDeactivate}>
            <DialogTitle id="alert-dialog-title">{t('deactivation request')}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Typography style={{ margin: '0px 5px', color: 'black' }}>{t('submit account deletion')}</Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeactivate}>{t('cancel')}</Button>
              <Button onClick={updateDeactivateState} autoFocus>
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
                  label={t('firstname')}
                  variant="outlined"
                  style={{ width: '100%', margin: '10px 0px' }}
                  value={complaintDetails.firstname}
                  name="firstname"
                  onChange={handleChangeComplaint}
                />
                <Typography style={{ color: 'red' }}>{complaintErrors.firstname}</Typography>
                <TextField
                  required={true}
                  label={t('lastname')}
                  variant="outlined"
                  style={{ width: '100%', margin: '10px 0px' }}
                  value={complaintDetails.lastname}
                  name="lastname"
                  onChange={handleChangeComplaint}
                />
                <Typography style={{ color: 'red' }}>{complaintErrors.lastname}</Typography>
                <TextField
                  required={true}
                  label={t('email')}
                  variant="outlined"
                  style={{ width: '100%', margin: '10px 0px' }}
                  value={complaintDetails.email}
                  name="email"
                  onChange={handleChangeComplaint}
                />
                <Typography style={{ color: 'red' }}>{complaintErrors.email}</Typography>
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
                  placeholder={t('describe your complaint')}
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
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileDetails;
