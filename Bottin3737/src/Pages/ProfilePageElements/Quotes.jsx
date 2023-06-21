import { Box, Tab, Tabs, Typography } from '@mui/material';
import React from 'react';
import { TabPanel, a11yProps } from '../EnterpriseProfile';
import { useState } from 'react';

function Quotes() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box style={{ backgroundColor: 'white', height: '50%', justifyContent: 'center', display: 'flex', flex: 1 }}>
      <Box sx={{ width: '80%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Devis traités" {...a11yProps(0)} />
            <Tab label="Devis non traités" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {/* <ProfileDetails /> */}
          <Typography>Hello</Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography>Hello</Typography>
        </TabPanel>
      </Box>
    </Box>
  );
}

export default Quotes;
