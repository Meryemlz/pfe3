import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase-config';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../Components/Inputs/TextInput';
import MainButton from '../Components/MainButton';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: ''
  });
  const [currentUser, setcurrentUser] = useState({});
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const navigation = useNavigate();

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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  /**
   * * A function used to create a new user and log him in automatically
   */
  async function register() {
    /**
     * *Passing Auth variable and email & password
     */
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password).then(async (userCredentials) => {
        console.log('user created successfully', userCredentials.user);
        let actualUser = userCredentials.user;
        await setDoc(doc(db, 'companies', actualUser.uid), {
          email: formData.email,
          companyName: formData.companyName,
          visible: true
        }).then(() => {
          navigation('/');
        });
      });
    } catch (error) {
      console.log('An error occurred', error);
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
          Inscription d'entreprise
        </Typography>
        <TextInput
          light={false}
          label={"{t('company name')} "}
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={(e) => handleChange(e)}
          required={true}
        />
        <TextInput
          light={false}
          label={'Email'}
          type="text"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e)}
          required={true}
        />
        <TextInput
          light={false}
          required={true}
          label={'Mot de passe'}
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange(e)}
        />

        <MainButton onClick={(e) => register()} text="Créer mon compte" />
        <Link to="/" style={{ fontFamily: 'Trebuchet MS', color: '#00BD9A' }}>
          {' '}
          Vous avez déja un compte? Connectez-vous !
        </Link>
      </Box>
    </Box>
  );
}

export default Register;
