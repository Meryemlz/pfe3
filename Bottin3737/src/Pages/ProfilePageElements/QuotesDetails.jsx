import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  Typography
} from '@mui/material';
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from 'src/Context/AuthContext';
import { db } from 'src/firebase-config';
import QuoteItem from './QuoteItem';
import usePagination from 'src/Components/Pagination/Pagination';
import { useStyles } from '../HomePage';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function QuotesDetails() {
  const { currentUser, dispatch } = useContext(AuthContext);
  const [quotesList, setquotesList] = useState([]);
  let [page, setPage] = useState(1);
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const PER_PAGE = 5;

  const count = Math.ceil(quotesList.length / PER_PAGE);
  const _DATA = usePagination(quotesList, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  async function fetchQuotes() {
    const conditions = [];

    console.log('Type', type);
    if (type == 0) {
      conditions.push(where('status', '!=', 'null'));
    }
    if (type == 1) {
      conditions.push(where('status', '==', 'null'));
    }
    const q = query(collection(db, 'quotes'), ...conditions);

    const querySnapshot = await getDocs(q);

    let result = [];
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data(), null, 4)}`);
      result.push({ ...doc.data(), uid: doc.id });
    });

    result.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    // @ts-ignore
    setquotesList(result);
    return result;
  }

  console.log('quotesList', quotesList);
  const [type, setType] = useState(1);
  const [refresh, setrefresh] = useState(false);
  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    fetchQuotes();
    console.log('Type ', type);
  }, [type, refresh]);

  return (
    <Box>
      <Box style={{ margin: '15px', color: 'black' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {quotesList.length > 0 ? (
            <Typography style={{ margin: '20px', display: 'flex', flexDirection: 'row' }}>
              {t('you have')}
              <Typography style={{ color: '#00bd9a', margin: '0px 5px' }}>
                <strong>{quotesList.length}</strong>
              </Typography>{' '}
              {t('quote request')} {type == 0 ? `${t('treated')}` : `${t('non treated')}`}
            </Typography>
          ) : (
            <Typography style={{ margin: '20px' }}>
              {t('quote request')} {type == 0 ? `${t('treated')}` : `${t('non treated')}`}{' '}
            </Typography>
          )}
          <FormControl sx={{ width: '200px' }}>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select autoWidth value={type} label="Type" onChange={handleChangeType}>
              <MenuItem value={0}>{t('answerd quotes')}</MenuItem>
              <MenuItem value={1}>{t('nonanswerd quotes')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {quotesList.length > 0 && (
          <Box>
            {quotesList.map((quote, index) => {
              return <QuoteItem quote={quote} key={index} type={type} setrefresh={setrefresh} refresh={refresh} />;
            })}
          </Box>
        )}
        <Box style={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
          <Pagination
            sx={{ button: { color: '#2a2a33' } }}
            renderItem={(item) => (
              <PaginationItem sx={{ color: '#2a2a33' }} {...item} classes={{ selected: classes.selected }} />
            )}
            count={count}
            size="large"
            page={page}
            variant="outlined"
            shape="rounded"
            onChange={handleChange}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default QuotesDetails;
