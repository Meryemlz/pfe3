import { Autocomplete, Box, TextField } from '@mui/material';
import React from 'react';
import { ColorButton, CssTextField } from 'src/Pages/HomePage';
import Search from '@material-ui/icons/Search';
import { artsList, candianCities, commerceList, domaines, manufacturingList, marketingList } from 'src/utils/Arrays';
import { useState } from 'react';
import { useEffect } from 'react';

function FilterComponent({ filters, setfilters, withActivityField, search, type }) {
  const [places, setplaces] = useState([]);
 
  const [servicesOptions, setservicesOptions] = useState([]);
  function handleCompanyName(e) {
    setfilters({
      ...filters,
      companyName: e.target.value
    });
    console.log('filters applied', filters);
  }

  function formatResults(array) {
    let formatResults = [];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      formatResults.push({ label: element.label, value: element.label });
    }
    return formatResults;
  }


  const [value, setvalue] = useState('');

  useEffect(() => {
    selectServicesArray(type);
  }, [type, filters]);

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
  return (
    <Box
      sx={{
        width: '90%',
        borderRadius: '20px',
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-evenly',
        // margintop: '10%',
        // marginBottom: '20%',
        zIndex: 1,
        marginBottom: '130px'
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          borderRadius: '30px',
          width: '20%',
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '5px 5px #00bd9a'
        }}
      >
        <CssTextField
          hiddenLabel
          variant="standard"
          placeholder={'Mots clés'}
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
          onChange={(e) => handleCompanyName(e)}
          value={filters.companyName}
        />
      </Box>
      {withActivityField && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            borderRadius: '30px',
            width: '20%',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '5px 5px #00bd9a'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '90%' }}>
            <Search style={{ color: '#757575' }} />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={domaines}
              sx={{ width: 300, justifyContent: 'center', display: 'flex' }}
              onChange={(event, newValue) => {
                setfilters({
                  ...filters,
                  activityField: newValue.value
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label=""
                  placeholder="{t('domaine')}"
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
      )}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          borderRadius: '30px',
          width: '18%',
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '5px 5px #00bd9a'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '90%', zIndex: 10 }}>
          <Search style={{ color: '#757575' }} />
          <Autocomplete
            value={filters.service}
            ListboxProps={{ style: { maxHeight: 160 } }}
            disablePortal
            disableClearable
            id="combo-box-demo"
            options={servicesOptions}
            sx={{ width: 300, justifyContent: 'center', display: 'flex' }}
            onChange={(event, newValue) => {
              console.log('newValue:  from services ' + newValue);

              setfilters({
                ...filters,
                service: newValue
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label=""
                placeholder="Services"
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
          width: '18%',
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '5px 5px #00bd9a'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '90%' }}>
          <Search style={{ color: '#757575' }} />

          <Autocomplete
            disablePortal
            options={candianCities.sort((a, b) => -b.province_name.localeCompare(a.province_name))}
            groupBy={(option) => option.province_name}
            getOptionLabel={(option) => option.city}
            sx={{ width: 300 }}
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
                placeholder="Lieu"
                variant="standard"
                value={value}
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
      {/* <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                borderRadius: '30px',
                width: '20%',
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '5px 5px #00bd9a'
              }}
            >
              <TextField
                variant="standard"
                ref={ref}
                hiddenLabel
                placeholder={'Lieu'}
                style={{ minWidth: '80%' }}
                InputProps={{
                  disableUnderline: true, // <== added this
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected) {
                      return <Typography style={{ color: '#BABABA' }}>Lieu</Typography>;
                    }

                    // @ts-ignore
                    return selected.label;
                  }
                }}
                value={{t('address')}}
                onChange={(event) => {
                  set{t('address')}(event.target.value);
                  setfilters({
                    ...filters,
                    address: event.target.value
                  });
                }}
              />
            </Box> */}
      {/* <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '90%' }}>
              <Search style={{ color: '#757575' }} />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={places}
                sx={{ width: 300, justifyContent: 'center', display: 'flex' }}
                onChange={(event, newValue) => {
                  setfilters({
                    ...filters,
                    activityField: newValue.value
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=""
                    placeholder="{t('domaine')}"
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
            </Box> */}
      <ColorButton onClick={() => search()}>Chercher</ColorButton>
    </Box>
  );
}

export default FilterComponent;
