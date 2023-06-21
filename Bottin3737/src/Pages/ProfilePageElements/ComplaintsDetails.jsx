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
import ComplaintItem from './ComplaintItem';
import { useTranslation } from 'react-i18next';

function ComplaintsDetails() {
  const { currentUser, dispatch } = useContext(AuthContext);
  const [quotesList, setquotesList] = useState([]);
  let [page, setPage] = useState(1);
  const classes = useStyles();

  const PER_PAGE = 5;

  const count = Math.ceil(quotesList.length / PER_PAGE);
  const _DATA = usePagination(quotesList, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  async function fetchQuotes() {
    const conditions = [];

    if (type == 0) {
      conditions.push(where('status', '!=', 'null'));
    }
    if (type == 1) {
      conditions.push(where('status', '==', 'null'));
    }
    const q = query(collection(db, 'complaints'), ...conditions);

    const querySnapshot = await getDocs(q);

    let result = [];
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data(), null, 4)}`);
      result.push({ ...doc.data(), uid: doc.id });
    });
    // @ts-ignore
    setquotesList(result);
    return result;
  }
  const [type, setType] = useState(1);
  const [refresh, setrefresh] = useState(false);
  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    fetchQuotes();
  }, [type, refresh]);
  const { t, i18n } = useTranslation();

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
              {t('complaint')} {type == 0 ? `${t('treated')}` : `${t('non treated')}`}
            </Typography>
          ) : (
            <Typography style={{ margin: '20px' }}>
              {t('you dont have complaints')} {type == 0 ? `${t('treated')}` : `${t('non treated')}`}{' '}
            </Typography>
          )}
          <FormControl sx={{ width: '300px' }}>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select autoWidth value={type} label="Type" onChange={handleChangeType}>
              <MenuItem value={0} sx={{ width: '300px' }}>
                {t('treated complaints')}
              </MenuItem>
              <MenuItem value={1} sx={{ width: '300px' }}>
                {t('nontreated complaints')}
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        {quotesList.length > 0 && (
          <Box>
            {quotesList.map((quote, index) => {
              return <ComplaintItem quote={quote} key={index} type={type} setrefresh={setrefresh} refresh={refresh} />;
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

export default ComplaintsDetails;
