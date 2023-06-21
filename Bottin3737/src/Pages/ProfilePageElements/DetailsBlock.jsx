import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function DetailsBlock({ blockTitle, children, setter, value, customText }) {
  // const [activeUpdate, setactiveUpdate] = useState(false)
  const { t, i18n } = useTranslation();

  return (
    <Box style={{ backgroundColor: '#F2F3F4', flex: 1, margin: '10px 0px', padding: '10px' }}>
      <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Box style={{ flex: 5 }}>
          <Typography style={{ fontSize: '18px', fontWeight: '600', color: '#04101B' }}>{blockTitle}</Typography>
        </Box>
        <Box style={{ flex: 1 , minWidth:"150px", display:"flex", flexDirection:"row", justifyContent:"flex-end"}}>
          {customText != '' ? (
            <Button
              variant="text"
              style={{ color: '#026d90', textTransform: 'none' }}
              onClick={() => {
                setter(!value);
              }}
            >
              {t('update service')}
            </Button>
          ) : (
            <Button
              variant="text"
              style={{ color: '#026d90', textTransform: 'none' }}
              onClick={() => {
                setter(!value);
              }}
            >
              {!value ? `${t('update')}` : `${t('cancel')}`}
            </Button>
          )}
        </Box>
      </Box>
      <Box style={{ margin: '10px 0px' }}>{children}</Box>
    </Box>
  );
}

export default DetailsBlock;
