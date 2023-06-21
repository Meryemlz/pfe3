import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase-config';
import { Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../Components/Inputs/TextInput';
import MainButton from '../Components/MainButton';
import { doc, setDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
function RegisterAdmin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [currentUser, setcurrentUser] = useState({});
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const { t, i18n } = useTranslation();

  const navigation = useNavigate();
  const [error, seterror] = useState('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setcurrentUser(user);
      } else {
        console.log('An error occured');
      }
    });

    return unsubscribe;
  }, []);

  /**
   * * A function used to create a new user and log him in automatically
   */
  async function register() {
    if (formData.confirmPassword == formData.password) {
      /**
       * *Passing Auth variable and email & password
       */
      try {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password).then(async (userCredentials) => {
          console.log('user created successfully', userCredentials.user);
          let actualUser = userCredentials.user;
          await setDoc(doc(db, 'users', actualUser.uid), {
            role: 'admin',
            email: formData.email,
            visible: true,
            isActive: true
          }).then(() => {
            navigation('/login');
          });
        });
      } catch (error) {
        console.log('An error occurred', error);
      }
    } else {
      seterror(t('passwords dont match'));
    }
  }

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#4a5355',
        height: '100vh',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box
        style={{
          width: '40%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#4a5355',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography style={{ color: 'white', fontSize: 20, width: '100%', margin: '20px 0px', fontWeight: '600' }}>
          {t('admin register')}
        </Typography>

        <TextInput
          light={false}
          label={t('email')}
          type="text"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e)}
          required={true}
        />
        <TextInput
          light={false}
          required={true}
          label={t('password')}
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange(e)}
        />
        <TextInput
          light={false}
          required={true}
          label={t('confirm password')}
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleChange(e)}
        />
        {error.length > 0 && <span style={{ color: 'red' }}> {error} </span>}

        <MainButton onClick={(e) => register()} text={t('create my account')} />
        <Link to="/login" style={{ fontFamily: 'Trebuchet MS', color: '#00BD9A' }}>
          {' '}
          {t('already have an account')}
        </Link>
      </Box>
    </Box>
  );
}

export default RegisterAdmin;
