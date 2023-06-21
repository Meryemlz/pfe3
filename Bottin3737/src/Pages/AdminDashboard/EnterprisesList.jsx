import React from 'react';
import PageTemplate from '../TypesPages/PageTemplate';
import {
  Box,
  Button,
  Pagination,
  PaginationItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import { db } from 'src/firebase-config';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import styled from '@emotion/styled';
import { useContext } from 'react';
import { AuthContext } from 'src/Context/AuthContext';
import CardComponent from './CardComponent';
import usePagination from 'src/Components/Pagination/Pagination';
import { useTranslation } from 'react-i18next';
export const useStyles = makeStyles(() => ({
  selected: {
    backgroundColor: 'red',
    color: 'green'
  },
  ul: {
    '& .MuiPaginationItem-root': {
      color: 'pink !important'
    }
  }
}));
export const DeactivateButton = styled(Button)(({ theme }) => ({
  color: 'white',
  width: '120px',
  margin: '0px 10px',
  backgroundColor: '#eb5436',
  '&:hover': {
    backgroundColor: '#eb5436',
    color: 'white'
  }
}));
export const ActiviateButton = styled(Button)(({ theme }) => ({
  color: 'white',
  width: '120px',
  margin: '0px 10px',
  backgroundColor: 'green',
  '&:hover': {
    backgroundColor: 'green',
    color: 'white'
  }
}));
export const DeleteButton = styled(Button)(({ theme }) => ({
  color: 'white',
  width: '120px',
  margin: '0px 10px',
  backgroundColor: '#0f3258',
  '&:hover': {
    backgroundColor: '#eb5436',
    color: 'white'
  }
}));
export const ComplaintButton = styled(Button)(({ theme }) => ({
  color: 'white',
  width: '120px',
  margin: '0px 10px',
  backgroundColor: '#00bd9a',
  '&:hover': {
    backgroundColor: '#00bd9a',
    color: 'white'
  }
}));

function EnterprisesList() {
  const [companiesList, setCompaniesList] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const [activeCompanies, setactiveCompanies] = useState(0);
  const [inActiveCompanies, setInActiveCompanies] = useState(0);
  const [admins, setAdmins] = useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { t, i18n } = useTranslation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const { currentUser, dispatch } = useContext(AuthContext);
  useEffect(() => {
    fetchAllCompanies();
    fetchStats();
  }, [refresh]);
  async function fetchAllCompanies() {
    const conditions = [];
    conditions.push(where('active', '==', true), where('visible', '==', true))
    const q = query(collection(db, 'companies'), ...conditions);

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

  async function fetchStats() {
    const active = query(collection(db, 'companies'), where('active', '==', true));
    const inactive = query(collection(db, 'companies'), where('active', '==', false));
    const admins = query(collection(db, 'users'), where('role', '==', 'admin'));

    const querySnapshotactive = await getDocs(active);
    const querySnapshotinactive = await getDocs(inactive);
    const querySnapshotadmins = await getDocs(admins);

    setactiveCompanies(querySnapshotactive.size);
    setInActiveCompanies(querySnapshotinactive.size);
    setAdmins(querySnapshotadmins.size);
  }

  const classes = useStyles();
  return (
    <PageTemplate>
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <Box
          sx={{
            width: '90%',
            display: 'flex',
            // flexWrap: 'wrap',
            margin: '50px ',
            justifyContent: 'space-between',
            height: 200,
            '& > :not(style)': {
              m: 1,
              width: 350
            }
          }}
        >
          <CardComponent value={activeCompanies} text={t('active companies')} route={'active-enterprises'} />
          <CardComponent value={inActiveCompanies} text={t('waiting companies')} route={'inactive-enterprises'} />
          <CardComponent value={admins} text={'Admins'} route={'admins-list'} />
          <CardComponent value={admins} text={'Complaints'} route={'complaints-list'} />

        </Box>
      </Box>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          //   height: '80vh',
          flexDirection: 'column',
          paddingBottom: '20px'
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
          {t('registered companies')}
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
                <TableCell align="center">{t('email')}</TableCell>
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

                  {row.active ? (
                    <TableCell align="center">
                      <DeactivateButton onClick={() => ChangeStatus(false, row.uid)}>
                        {t('deactivate')}
                      </DeactivateButton>
                    </TableCell>
                  ) : (
                    <TableCell align="center">
                      <ActiviateButton onClick={() => ChangeStatus(true, row.uid)}> {t('activate')}</ActiviateButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('of')} ${count}`}
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
    </PageTemplate>
  );
}

export default EnterprisesList;
