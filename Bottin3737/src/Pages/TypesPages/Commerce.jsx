import React, { useEffect, useState } from 'react';
import CustomAppBar from 'src/Components/AppBar/CustomAppBar';
import PageTemplate from './PageTemplate';
import { Box, Pagination, PaginationItem, Typography } from '@mui/material';
import EnterpriseItem from 'src/Components/Data/EnterpriseItem';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from 'src/firebase-config';
import { useParams } from 'react-router-dom';
import FilterComponent from 'src/Components/filters/FilterComponent';
import usePagination from 'src/Components/Pagination/Pagination';
import { useStyles } from '../HomePage';
function Commerce() {
  const { name, address } = useParams();
  let [page, setPage] = useState(1);

  const [companiesList, setCompaniesList] = useState([]);
  const [filters, setfilters] = useState({
    companyName: '',
    address: '',
    activityField: '',
    service: ''
  });
  async function fetchCompanies() {
    const conditions = [];
    conditions.push(where('activityField', '==', 'Commerce'));

    if (filters.address != '') {
      conditions.push(where('address', '==', filters.address));
    }

    if (filters.companyName != '') {
      conditions.push(where('companyName', '==', filters.companyName));
    }
    if (filters.service != '') {
      conditions.push(where('services', 'array-contains', filters.service));
    }
    const q = query(collection(db, 'companies'), ...conditions);

    const querySnapshot = await getDocs(q);

    let result = [];
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data(), null, 4)}`);
      result.push(doc.data());
    });
    setCompaniesList(result);
    return result;
  }

  useEffect(() => {
    fetchAllComapnies();
  }, []);

  async function fetchAllComapnies() {
    const conditions = [];
    conditions.push(where('activityField', '==', 'Commerce'));
    const q = query(collection(db, 'companies'), ...conditions);
    console.log('name', name);
    if (name !== '_') {
      setfilters({
        ...filters,
        companyName: name
      });
      conditions.push(where('companyName', '==', name));
    }
    if (address !== '_') {
      conditions.push(where('services', 'array-contains', address));
    }
    const querySnapshot = await getDocs(q);

    let result = [];
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data(), null, 4)}`);
      result.push({ ...doc.data(), uid: doc.id });
    });
    setCompaniesList(result);
    return result;
  }
  const PER_PAGE = 5;

  const count = Math.ceil(companiesList.length / PER_PAGE);
  const _DATA = usePagination(companiesList, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  const classes = useStyles();
  return (
    <PageTemplate>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          padding: '50px 0px', backgroundColor:"#2a2a33"

        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <FilterComponent
            type="Commerce"
            filters={filters}
            setfilters={setfilters}
            withActivityField={false}
            search={fetchCompanies}
          />
        </Box>
        <Box sx={{ alignItems: 'center', justifyContent: 'center', zIndex: 1, padding: '5%' }}>
          {companiesList.length > 0 &&
            companiesList.map((company, index) => {
              return (
                <EnterpriseItem
                  services={company.services}
                  uid={company.uid}
                  key={index}
                  companyName={company.companyName}
                  address={company.address}
                  activityField={company.activityField}
                  email={company.email}
                  imageUrl={company.imageUrl}
                />
              );
            })}
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
          <Pagination
            sx={{ button: { color: '#ffffff' } }}
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
    </PageTemplate>
  );
}

export default Commerce;
