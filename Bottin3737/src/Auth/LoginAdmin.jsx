import React, { useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from '../firebase-config';
import { Box, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../Components/Inputs/TextInput';
import MainButton from '../Components/MainButton';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from 'src/Context/AuthContext';
import { useTranslation } from 'react-i18next';

function LoginAdmin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { t, i18n } = useTranslation();
  const [connectedUser, setconnectedUser] = useState({});
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const [error, seterror] = useState(false);

  const navigation = useNavigate();
  const { currentUser, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setconnectedUser(user);
      } else {
        console.log('An error occured');
      }
    });

    return unsubscribe;
  }, []);

 

  async function getUser(uid) {
    const docRef = doc(db, 'users', uid); // Creating reference to the document with specified UID
    const docSnap = await getDoc(docRef); // Retrieving the document snapshot

    if (docSnap.exists()) {
      console.log("docSnap.data()['role']",docSnap.data()['role'])

      return docSnap.data()['role'];
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
        let userData = { ...user};
        console.log('User ____________', userData);

        let userRole = await getUser(user.uid);
        if (userRole == 'admin') {
          localStorage.setItem("role", 'admin');
          dispatch({ type: 'LOGIN', payload: userData });
          navigation('/enterprises-list');
        } else {
          seterror(true);
        }
        
      })
      .catch((error) => {
        seterror(true);
      });
  }
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
          {t('admin login')}
        </Typography>

        <TextInput
          label={t('email')}
          type="text"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e)}
          required={true}
          light={false}
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
        {error && <span style={{ color: 'red' }}> {t('login error')}  </span>}

        <Button onClick={() => changePassword()} style={{ textTransform: 'none', color: '#00bd9a' }}>
          {' '}
          {t('forgot password')} ?
        </Button>

        <MainButton onClick={(e) => login(e)} text={t('login')} />
        <Link to="/register" style={{ fontFamily: 'Trebuchet MS', color: '#00BD9A' }}>
          {' '}
          {t('dont have an account')}
        </Link>
      </Box>
    </Box>
  );
}

export default LoginAdmin;
