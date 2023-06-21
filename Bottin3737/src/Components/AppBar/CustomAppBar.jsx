import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import myImage from '../../images/logo.png';
import TextInput, { LightInput } from '../Inputs/TextInput';
import MainButton from '../MainButton';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from 'src/Context/AuthContext';
import { makeStyles, withStyles } from '@mui/styles';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from 'src/firebase-config';
import CloseIcon from '@material-ui/icons/Close';
import { usePlacesWidget } from 'react-google-autocomplete';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import i18n from 'src/i18n';
import { useTranslation } from 'react-i18next';
import { activityFields, artsList, commerceList, manufacturingList, marketingList } from 'src/utils/Arrays';
import { StyledTextarea } from 'src/Pages/EnterpriseDetails';
import { use } from 'i18next';

const AntTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: '#00bd9a'
  }
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  color: 'rgba(0, 0, 0, 0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  '&:hover': {
    color: '#00bd9a',
    opacity: 1
  },
  '&.Mui-selected': {
    color: '#00bd9a'
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff'
  }
}));
const selectFieldStyles = {
  minWidth: '50px',
  color: 'white',
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
    color: 'white'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
    borderWidth: 'thin',
    color: 'white'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
    borderWidth: 'thin'
  },
  '& .MuiFilledInput-root': {
    borderRadius: 4,
    borderColor: 'transparent'
  },
  '& .MuiSvgIcon-root': {
    color: 'white'
  }
};
const selectActivityFieldStyles = {
  width: '100%',
  color: '#00bd9a',
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: 'gray',
    color: '#00bd9a'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'gray',

    borderWidth: 'thin',
    color: '#00bd9a'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'gray',
    borderWidth: 'thin',
    color: '#00bd9a'
  },
  '& .MuiFilledInput-root': {
    borderRadius: 4,
    color: '#00bd9a',
    borderColor: 'black'
  },
  '& .MuiSvgIcon-root': {
    color: '#00bd9a'
  }
};
export const useStyles = makeStyles(() => ({
  inputProps: {
    underline: {
      '&:after': {
        border: '2px solid red'
      }
    }
  }
}));
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
function CustomAppBar() {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const [openLogin, setopenLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setregisterData] = useState({
    email: '',
    password: '',
    companyName: '',
    address: '',
    zipCode: '',
    city: '',
    neq: '',
    phoneNumber: '',
    website: '',
    activityField: '',
    services: '',
    visible: false,
    description: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    companyName: '',
    address: '',
    zipCode: '',
    city: '',
    neq: '',
    phoneNumber: '',
    website: '',
    activityField: '',
    services: '',
    visible: '',
    description: ''
  });
  const [language, setlanguage] = useState(i18n.resolvedLanguage);
  const [connectedUser, setconnectedUser] = useState({});
  const { currentUser, dispatch } = useContext(AuthContext);
  const [error, seterror] = useState(false);
  const navigation = useNavigate();
  const [valueTab, setValueTab] = React.useState(0);
  const [success, setsuccess] = useState(false);
  const [connectedUserRole, setconnectedUserRole] = useState('');
  const [servicesOptions, setservicesOptions] = useState([]);
  const [role, setrole] = useState('');
  const [isActive, setisActive] = useState(false);
  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleChangeRegister = (event) => {
    setregisterData({ ...registerData, [event.target.name]: event.target.value });
  };

  async function getUser(uid) {
    const docRef = doc(db, 'companies', uid); // Creating reference to the document with specified UID
    const docSnap = await getDoc(docRef); // Retrieving the document snapshot

    if (docSnap.exists()) {
      console.log("docSnap.exists()['active'] ", docSnap.data()['active']);

      if (docSnap.data()['active'] == true) {
        return true;
      }
      if (docSnap.data()['active'] != true) {
        return false;
      }
    } else {
      return null;
    }
  }
  async function login(e) {
    e.preventDefault();
    /**
     * *Passing Auth variable and email & password
     */

    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        let userData = { ...user };
        let status = await getUser(user.uid);
        localStorage.setItem('role', "company");
        if (status == true) {
          dispatch({ type: 'LOGIN', payload: userData });
          navigation('/enterprise-profile');
          setopenLogin(false);
          setFormData({
            email: '',
            password: ''
          });
        } else {
          seterror(true);
        }

        // console.log('user created successfully', user);
      })
      .catch((error) => {
        seterror(true);
      });
  }
  function handleSignOut(e) {
    e.preventDefault();
    auth
      .signOut()
      .then(() => {
        localStorage.removeItem("role");
        setconnectedUser(null);
        navigation('/');
      })
      .then(() => localStorage.removeItem('user'))
      .then(() => window.location.reload())

      .catch((error) => console.error(error));
  }

  function validateEnterprise() {
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    let errors = {
      email: '',
      password: '',
      companyName: '',
      address: '',
      zipCode: '',
      city: '',
      neq: '',
      phoneNumber: '',
      website: '',
      activityField: '',
      services: '',
      visible: '',
      description: ''
    };
    if (!registerData.email && !pattern.test(registerData.email)) {
      errors.email = t('please provide an email');
    }
    if (!registerData.password) {
      errors.password = t('please provide a password');
    }

    if (!registerData.address) {
      errors.address = t('please provide an address');
    }

    if (!registerData.phoneNumber) {
      errors.phoneNumber = t('please provide a comany phone');
    }
    if (!registerData.companyName) {
      errors.companyName = t('please provide a comany name');
    }
    if (!registerData.zipCode) {
      errors.zipCode = t('please provide a zipcode');
    }
    if (!registerData.activityField) {
      errors.activityField = t('please provide activityField');
    }
    if (!registerData.city) {
      errors.city = t('please provide a city');
    }
    if (!registerData.description) {
      errors.description = t('please provide a description');
    }
    setErrors(errors);
    const isEmpty = Object.values(errors).every((value) => !value);
    return isEmpty;
  }
  /**
   * * A function used to create a new user and log him in automatically
   */
  async function register() {
    /**
     * *Passing Auth variable and email & password
     */
    if (validateEnterprise()) {
      try {
        await createUserWithEmailAndPassword(auth, registerData.email, registerData.password).then(
          async (userCredentials) => {
            console.log('user created successfully', userCredentials.user);
            let actualUser = userCredentials.user;

            await setDoc(doc(db, 'companies', actualUser.uid), {
              ...registerData,
              visible: true,
              role: 'company',
              active: false,
              createdAt: serverTimestamp()
            }).then(() => {
              setsuccess(!success);
            });
          }
        );
      } catch (error) {
        console.log('An error occurred', error);
      }
    }
  }

  useEffect(() => {}, [role, isActive]);

  function changePassword() {
    const emailAddress = formData.email;

    sendPasswordResetEmail(auth, emailAddress)
      .then(() => {
        // Password reset email sent successfully!
        alert('Email envoyé avec succès');
      })
      .catch((error) => {
        // An error occurred while sending the password reset email.
        console.log(error);
      });
  }

  // console.log("Role from tab bar *********************************", role )
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setconnectedUser(user);
        getUser(user.uid);
      } else {
        console.log('An error occured');
        setconnectedUser(null);
      }
    });

    return unsubscribe;
  }, []);
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
  useEffect(() => {
    let connectedRole = localStorage.getItem('role');
    if (connectedRole) {
      setrole(connectedRole);
    }

    console.log('Role:  ______________' + connectedRole);
  }, []);

  useEffect(() => {
    selectServicesArray(registerData.activityField);
  }, [role, isActive]);
  return (
    <Box sx={{ flexGrow: 1, zIndex: 2, width: '100%', left: 0, position: 'static' }}>
      <AppBar position="static" style={{ background: '#283339', width: '100%' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flexGrow: 1 }}>
            <Button
              color="inherit"
              onClick={(e) => navigation('/')}
              style={{ color: '#00bd9a', fontSize: '16px', fontWeight: '500' }}
            >
              <img src={myImage} alt="My Image" style={{ maxHeight: 50, maxWidth: 50 }} />
            </Button>
          </div>
          <FormControl sx={{ minWidth: '50px' }} variant="standard">
            {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
            <Select
              sx={selectFieldStyles}
              variant="outlined"
              defaultValue={i18n.resolvedLanguage}
              value={i18n.resolvedLanguage}
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
              }}
            >
              <MenuItem value={'fr'}>fr</MenuItem>
              <MenuItem value={'en'}>en</MenuItem>
            </Select>
          </FormControl>
          {currentUser != null ? (
            <>
              {!role.includes('admin') && (
                <Button
                  color="inherit"
                  onClick={(e) => navigation('/enterprise-profile')}
                  style={{ color: '#00bd9a', fontSize: '16px', fontWeight: '500' }}
                >
                  {t('profile')}
                </Button>
              )}

              <Button
                color="inherit"
                onClick={(e) => handleSignOut(e)}
                style={{ color: '#00bd9a', fontSize: '16px', fontWeight: '500' }}
              >
                {t('logout')}
              </Button>
            </>
          ) : (
            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Button
                color="inherit"
                onClick={() => {
                  setopenLogin(true);
                  setsuccess(false);
                }}
                style={{ color: '#00bd9a', fontSize: '16px', fontWeight: '500' }}
              >
                {t('login')}
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Dialog
        open={openLogin}
        onClose={() => {
          setopenLogin(false);
          setsuccess(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0px 10px'
              }}
            >
              <AntTabs value={valueTab} onChange={handleChangeTab} aria-label="ant example">
                <AntTab label={t('connection')} {...a11yProps(0)} />
                <AntTab label={t('create an account')} {...a11yProps(1)} />
              </AntTabs>
              <IconButton
                onClick={() => {
                  setopenLogin(false);
                  setsuccess(!success);
                  setregisterData({
                    email: '',
                    password: '',
                    companyName: '',
                    address: '',
                    zipCode: '',
                    city: '',
                    neq: '',
                    phoneNumber: '',
                    website: '',
                    activityField: '',
                    services: '',
                    visible: false,
                    description: ''
                  });
                  setFormData({
                    email: '',
                    password: ''
                  });
                }}
                style={{ backgroundColor: 'red' }}
              >
                <CloseIcon style={{ color: 'white', fontSize: '15px' }} />
              </IconButton>
            </Box>
          </Box>
          <TabPanel value={valueTab} index={0}>
            <Box
              sx={{ maxWidth: 'md' }}
              style={{
                // width: '80%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '50px'
              }}
            >
              <TextInput
                light={true}
                required={true}
                label={'Email'}
                type="text"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e)}
              />
              <TextInput
                light={true}
                required={true}
                label={t('password')}
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange(e)}
              />
              {error && <span> {t('login error')}</span>}

              <Button onClick={() => changePassword()} style={{ textTransform: 'none', color: '#00bd9a' }}>
                {' '}
                {t('forgot password')} ?
              </Button>
              <MainButton onClick={(e) => login(e)} text={t('login')} />
            </Box>
          </TabPanel>
          <TabPanel value={valueTab} index={1}>
            {success == false ? (
              <Box
                sx={{ maxWidth: 'md' }}
                style={{
                  // width: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '50px'
                }}
              >
                <TextInput
                  label={t('legal company name')}
                  light={true}
                  value={registerData.companyName}
                  name="companyName"
                  onChange={(e) => handleChangeRegister(e)}
                  type="text"
                  required={true}
                />
                <Typography style={{ color: 'red' }}>{errors.companyName}</Typography>
                <TextInput
                  light={true}
                  label={'Email'}
                  type="text"
                  name="email"
                  value={registerData.email}
                  onChange={(e) => handleChangeRegister(e)}
                  required={true}
                />
                <Typography style={{ color: 'red' }}>{errors.email}</Typography>

                <TextInput
                  light={true}
                  required={true}
                  label={t('password')}
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={(e) => handleChangeRegister(e)}
                />
                <Typography style={{ color: 'red' }}>{errors.password}</Typography>

                <TextInput
                  label={t('address')}
                  light={true}
                  name="address"
                  value={registerData.address}
                  onChange={(e) => handleChangeRegister(e)}
                  type="text"
                  required={true}
                />
                <Typography style={{ color: 'red' }}>{errors.address}</Typography>

                <TextInput
                  light={true}
                  label={t('zipcode')}
                  value={registerData.zipCode}
                  name="zipCode"
                  type="text"
                  onChange={(e) => handleChangeRegister(e)}
                  required={true}
                />
                <Typography style={{ color: 'red' }}>{errors.zipCode}</Typography>

                <TextInput
                  light={true}
                  label={t('city')}
                  value={registerData.city}
                  name="city"
                  onChange={(e) => handleChangeRegister(e)}
                  type="text"
                  required={true}
                />
                <Typography style={{ color: 'red' }}>{errors.city}</Typography>

                <TextInput
                  type="text"
                  light={true}
                  label="NEQ"
                  value={registerData.neq}
                  name="neq"
                  onChange={(e) => handleChangeRegister(e)}
                  required={false}
                />
                <Typography style={{ color: 'red' }}>{errors.neq}</Typography>

                <TextInput
                  type="text"
                  label={t('phoneNumber')}
                  light={true}
                  value={registerData.phoneNumber}
                  name="phoneNumber"
                  onChange={(e) => handleChangeRegister(e)}
                  required={true}
                />
                <Typography style={{ color: 'red' }}>{errors.phoneNumber}</Typography>

                <TextInput
                  light={true}
                  type="text"
                  label={t('website')}
                  required={false}
                  value={registerData.website}
                  name="website"
                  onChange={(e) => handleChangeRegister(e)}
                />
                <Typography style={{ color: 'red' }}>{errors.website}</Typography>

                <FormControl
                  fullWidth
                  style={{
                    width: '100%',
                    margin: '10px 0px'
                  }}
                >
                  <InputLabel id="demo-simple-select-label">{t('domaine')}</InputLabel>
                  <Select
                    required={true}
                    sx={selectActivityFieldStyles}
                    value={registerData.activityField}
                    name="activityField"
                    label={t('domaine')}
                    onChange={(e) => {
                      handleChangeRegister(e);
                      console.log('Selected activity', e.target.value);
                      selectServicesArray(e.target.value);
                    }}
                  >
                    {activityFields.map((activityField) => {
                      return <MenuItem value={activityField.value}>{activityField.label}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
                <Typography style={{ color: 'red' }}>{errors.activityField}</Typography>
                <StyledTextarea
                  aria-label="minimum height"
                  minRows={3}
                  placeholder={registerData.description}
                  style={{ width: '100%', maxWidth: '300px' }}
                  onChange={(e) => handleChangeRegister(e)}
                  name="description"
                  value={registerData.description}
                />
                <Typography style={{ color: 'red' }}>{errors.description}</Typography>
                <MainButton onClick={(e) => register()} text={t('create my account')} />
              </Box>
            ) : (
              <Box
                sx={{ maxWidth: 'md' }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '50px'
                }}
              >
                <Typography style={{}}>{t('account created successfully')} </Typography>
              </Box>
            )}
          </TabPanel>
        </Box>
      </Dialog>
    </Box>
  );
}

export default CustomAppBar;
