import styled from '@emotion/styled';
import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const FiledTitle = styled(Typography)({
  color: '#2a2a33',
  fontSize: '16px',
  fontWeight: '600'
});
const EnterpriseItem = ({ companyName, address, activityField, email, uid, services, imageUrl }) => {
  const { t, i18n } = useTranslation();

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        width: '80%',
        margintop: '15px',
        marginBottom: '15px',
        borderRadius: '20px',
        padding: '20px',
        borderBottom: '2px solid #00bd9a',
        borderRight: '8px solid #00bd9a',
        display: 'flex',
        marginLeft: '5%'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '12%' }}>
        <Avatar alt="Remy Sharp" src={imageUrl} sx={{ width: 100, height: 100 }} variant="rounded" />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <FiledTitle>{t('company name')} :</FiledTitle>
          <Typography style={{ margin: '0px 10px' }}>{companyName}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <FiledTitle>{t('address')} :</FiledTitle>

          <Typography style={{ margin: '0px 10px' }}>{address}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <FiledTitle>{t('domaine')} :</FiledTitle>
          <Typography style={{ margin: '0px 10px' }}>{activityField}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '38%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <FiledTitle>{t('email')} :</FiledTitle>
          <Typography style={{ margin: '0px 10px' }}>{email}</Typography>
        </Box>
        {services && services.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', padding: '20px 0px' }}>
            <FiledTitle>Prestations :</FiledTitle>
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
              {services &&
                services.length > 0 &&
                services.map((service, index) => {
                  return (
                    <Typography style={{ margin: '0px 10px' }} key={index}>
                      {service}
                    </Typography>
                  );
                })}
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'row' }}></Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', padding: '20px 0px' }}>
          <Link to={`/enterprise-details/${uid}`}>{t('see more')} ...</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default EnterpriseItem;
