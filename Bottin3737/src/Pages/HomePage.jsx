import React, { useEffect, useState } from 'react';
import { auth, db } from 'src/firebase-config';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
// @ts-ignore
import { Autocomplete, Box, Button, PaginationItem, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import styled from '@emotion/styled';
import Pagination from '@mui/material/Pagination';
import { useTranslation } from 'react-i18next';
import Search from '@material-ui/icons/Search';
// @ts-ignore
import myVideo from '../images/videos/background.mp4';
import {
  activityFields,
  artsList,
  candianCities,
  commerceList,
  manufacturingList,
  marketingList
} from 'src/utils/Arrays';
import CustomAppBar from 'src/Components/AppBar/CustomAppBar';

import Footer from 'src/Components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

import EnterpriseItem from 'src/Components/Data/EnterpriseItem';
import { getAuth } from 'firebase/auth';
import usePagination from 'src/Components/Pagination/Pagination';
export const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    minWidth: '100px'
  },

  '&.Mui-focused fieldset': {
    borderColor: 'white'
  }
});
export const useStyles = makeStyles(() => ({
  selected: {
    backgroundColor: 'red',
    color: 'white'
  },
  ul: {
    '& .MuiPaginationItem-root': {
      color: '#fff'
    }
  }
}));
// @ts-ignore
export const ColorButton = styled(Button)(({ theme }) => ({
  color: 'white',
  borderRadius: '20px',
  width: '20%',
  backgroundColor: '#00bd9a',
  textTransform: 'capitalize',
  '&:hover': {
    color: '#00bd9a',
    backgroundColor: 'white',
    boxShadow: '5px 5px #00bd9a'
  }
}));

function HomePage() {
  const navigation = useNavigate();
  let [page, setPage] = useState(1);
  const { t, i18n } = useTranslation();
  const [filters, setfilters] = useState({
    companyName: '',
    address: '',
    activityField: '',
    service: ''
  });
  const [servicesOptions, setservicesOptions] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  const [value, setvalue] = useState('');

  async function fetchCompaniesWithName() {
    const conditions = [];
    conditions.push(where('active', '==', true), where('visible', '==', true));
    if (filters.address != '') {
      conditions.push(where('address', '==', filters.address));
    }

    if (filters.companyName != '') {
      conditions.push(where('companyName', '==', filters.companyName));
    }
    if (filters.service != '') {
      conditions.push(where('services', 'array-contains', filters.service));
    }

    if (filters.activityField != '') {
      conditions.push(where('activityField', '==', filters.activityField));
    }
    const q = query(collection(db, 'companies'), ...conditions);

    const querySnapshot = await getDocs(q);

    let result = [];
    querySnapshot.forEach((doc) => {
      result.push(doc.data());
    });
    result.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    setCompaniesList(result);
    if (result.length > 0) {
      setSearchResult('Votre recherche correspond à ' + result.length + ' éléments');
    } else {
      setSearchResult('Votre recherche ne correspond à aucun élément');
    }

    return result;
  }

  useEffect(() => {
    fetchAllComapnies();
  }, [filters.service, filters.address, filters.activityField]);
  async function fetchAllComapnies() {
    const conditions = [];
    conditions.push(where('active', '==', true), where('visible', '==', true));
    if (filters.service != '') {
      conditions.push(where('services', 'array-contains', filters.service));
    }
    if (filters.address != '') {
      conditions.push(where('address', '==', filters.address));
    }
    if (filters.activityField != '') {
      conditions.push(where('activityField', '==', filters.activityField));
    }
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
  function handleSearch() {
    fetchCompaniesWithName();
  }

  function handleFiltersAndSearch() {
    if (filters.companyName != '') {
      handleSearch();
    }
  }

  function handleSearchAndRedirect() {
    let name = '_';
    // @ts-ignore
    let address = '_';
    let service = '_';

    if (filters.companyName != '') {
      name = filters.companyName;
    }
    if (filters.service != '') {
      service = filters.service;
    }
    if (filters.address != '') {
      address = filters.address;
    }
    if (filters.service != '') {
      address = filters.address;
    }
    if (filters.activityField == 'Fabrication') {
      navigation('/manufacturing/' + name + '/' + service);
    }
    if (filters.activityField == 'Arts') {
      navigation('/arts/' + name + '/' + service);
    }
    if (filters.activityField == 'Commerce') {
      navigation('/commerce/' + name + '/' + service);
    }
    if (filters.activityField == 'Marketing') {
      navigation('/marketing/' + name + '/' + service);
    } else if (filters.activityField == '') {
    }
  }
  function formatResults(array) {
    let formatResults = [];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      formatResults.push({ label: element.label, value: element.label });
    }
    return formatResults;
  }

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
    async function fetchCanadianCities() {
      const groupedCities = candianCities.reduce((acc, city) => {
        if (!acc[city.province_name]) {
          acc[city.province_name] = [];
        }
        acc[city.province_name].push(city);
        return acc;
      }, {});
    }

    fetchCanadianCities();
  }, []);

  const PER_PAGE = 5;

  const count = Math.ceil(companiesList.length / PER_PAGE);
  const _DATA = usePagination(companiesList, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  const classes = useStyles();

  return (
    <>
      <CustomAppBar />

      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#2a2a33',
          height: '100%',
          // width: '100%',
          alignItems: 'center',
          paddingTop: '60px',
          paddingBottom: '0px'
        }}
      >
        <video
          autoPlay
          muted
          loop
          style={{
            position: 'absolute',
            top: 65,
            left: 0,
            right: 0,
            height: '50vh',
            width: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 0.4
          }}
        >
          <source src={myVideo} type="video/mp4" />
        </video>
        <Box
          sx={{
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            height: '100%'

            // backgroundColor: 'green',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              zIndex: 1
            }}
          >
            <Typography style={{ fontSize: '50px', color: 'white', zIndex: 1 }}>{t('welcome bottin')}</Typography>
            <Typography
              style={{
                fontSize: '18px',
                color: 'white',
                margin: '15px 0px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline'
              }}
            >
              {t('find enterprise')}
            </Typography>
          </Box>
          <Box
            sx={{
              width: '95%',
              borderRadius: '20px',
              flexDirection: 'column',
              display: 'flex',
              margintop: '10%',
              marginBottom: '3%',
              zIndex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                width: '95%',
                borderRadius: '20px',
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: '10px',
                zIndex: 1
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  borderRadius: '30px',
                  width: '18%',
                  maxwidth: '18%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '5px 5px #00bd9a'
                }}
              >
                <CssTextField
                  hiddenLabel
                  variant="standard"
                  placeholder={t('key words')}
                  sx={{
                    width: '90%',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    display: 'inline-block',
                    justifyContent: 'center',
                    paddingLeft: '20px'
                  }}
                  InputProps={{
                    disableUnderline: true // <== added this,
                  }}
                  onChange={(e) => setfilters({ ...filters, companyName: e.target.value })}
                  value={filters.companyName}
                />
              </Box>

              <Box
                sx={{
                  borderRadius: '30px',
                  width: '18%',
                  maxwidth: '18%'
                }}
              >
                <ColorButton style={{ width: '100%', height: '100%' }} onClick={() => handleFiltersAndSearch()}>
                  {t('search')}
                </ColorButton>
              </Box>
            </Box>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                height: '50px',
                width: '65%',
                justifyContent: 'space-between'
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  borderRadius: '30px',
                  width: '30%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '5px 5px #00bd9a'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '90%', zIndex: 90 }}>
                  <Search style={{ color: '#757575' }} />
                  <Autocomplete
                    ListboxProps={{ style: { maxHeight: 80, zIndex: 90 } }}
                    disableClearable
                    disablePortal
                    options={activityFields}
                    sx={{ width: 300, justifyContent: 'center', display: 'flex', zIndex: 90 }}
                    // @ts-ignore
                    onChange={(event, newValue) => {
                      setfilters({
                        ...filters,
                        activityField: newValue.value
                      });
                      selectServicesArray(newValue.value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=""
                        placeholder={t('domaine')}
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:before': { borderBottomColor: 'transparent' },
                          '& .MuiInput-underline:after': { borderBottomColor: 'gray' },
                          '& .MuiInput-underline': { borderBottomColor: 'transparent' },
                          width: '90%'
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  borderRadius: '30px',
                  width: '30%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '5px 5px #00bd9a'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '90%', zIndex: 90 }}>
                  <Search style={{ color: '#757575' }} />
                  <Autocomplete
                    ListboxProps={{ style: { maxHeight: 160 } }}
                    disablePortal
                    disableClearable
                    id="combo-box-demo"
                    options={servicesOptions}
                    sx={{ width: 300, justifyContent: 'center', display: 'flex', zIndex: 90 }}
                    // @ts-ignore
                    onChange={(event, newValue) => {
                      setfilters({
                        ...filters,
                        service: newValue
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=""
                        placeholder={t('services')}
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:before': { borderBottomColor: 'transparent' },
                          '& .MuiInput-underline:after': { borderBottomColor: 'gray' },
                          '& .MuiInput-underline': { borderBottomColor: 'transparent' },
                          width: '90%',
                          zIndex: 90
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  borderRadius: '30px',
                  width: '30%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '5px 5px #00bd9a',
                  zIndex: 90
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '90%', zIndex: 30 }}>
                  <Search style={{ color: '#757575' }} />

                  <Autocomplete
                    // PopperProps={{
                    //   zIndex: 2000
                    // }}
                    // disablePortal
                    options={candianCities.sort((a, b) => -b.province_name.localeCompare(a.province_name))}
                    groupBy={(option) => option.province_name}
                    getOptionLabel={(option) => option.city}
                    sx={{ width: 300, zIndex: 90 }}
                    ListboxProps={{ style: { minHeight: 250 } }}
                    onChange={(e) => {
                      // @ts-ignore
                      console.log('e.target.value', e.target.innerText);
                      // @ts-ignore
                      setvalue(e.target.innerText);
                      setfilters({
                        ...filters,
                        // @ts-ignore
                        address: e.target.innerText
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=""
                        placeholder={t('region city')}
                        variant="standard"
                        value={value}
                        sx={{
                          '& .MuiInput-underline:before': { borderBottomColor: 'transparent' },
                          '& .MuiInput-underline:after': { borderBottomColor: 'gray' },
                          '& .MuiInput-underline': { borderBottomColor: 'transparent' },
                          width: '90%',
                          zIndex: 10
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>
            <Typography style={{ fontSize: '14px', color: 'white', margin: '10px', width: '65%' }}>
              {t('narrow search')}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: '#2a2a33',
            width: '80%',
            zIndex: 2,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            marginTop: 0
          }}
        >
          <Box sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', zIndex: 1, padding: '1%' }}>
            <Typography
              style={{
                width: '80%',
                justifyContent: 'center',
                padding: '0px 80px 15px',
                color: 'white',
                fontSize: '20px'
              }}
            >
              {searchResult}
            </Typography>
            {companiesList.length > 0 &&
              _DATA.currentData().map((company, index) => {
                return (
                  // @ts-ignore
                  <EnterpriseItem
                    key={index}
                    companyName={company.companyName}
                    address={company.address}
                    activityField={company.activityField}
                    email={company.email}
                    uid={company.uid}
                    imageUrl={company.imageUrl}
                  />
                );
              })}
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
        </Box>
        <Box
          sx={{
            backgroundColor: '#2a2a33',
            width: '100%',
            zIndex: 5,
            justifyContent: 'center',
            display: 'flex',
            height: '100%'
          }}
        >
          <Footer />
        </Box>
      </Box>
    </>
  );
}

export default HomePage;
