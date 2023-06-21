import React from 'react';
import PageTemplate from './TypesPages/PageTemplate';
import { Avatar, Box, Tab, Tabs, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ProfileDetails from './ProfilePageElements/ProfileDetails';
import QuotesDetails from './ProfilePageElements/QuotesDetails';
import { getAuth, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import ComplaintsDetails from './ProfilePageElements/ComplaintsDetails';
import { useTranslation } from 'react-i18next';

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && <Box sx={{ p: 3, flex: 1, height: '100%' }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};
export function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
function EnterpriseProfile() {
  const [value, setValue] = useState(0);
  const { t, i18n } = useTranslation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const auth = getAuth();
  const currentUser = auth.currentUser;

  return (
    <PageTemplate>
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box style={{ backgroundColor: 'white', height: '50%', justifyContent: 'center', display: 'flex', flex: 1 }}>
          <Box sx={{ width: '80%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label={t('profile details')} {...a11yProps(0)} />
                <Tab label={t('quotes details')} {...a11yProps(1)} />
                {/* <Tab label={t('complaint details')} {...a11yProps(2)} /> */}
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <ProfileDetails />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <QuotesDetails />
            </TabPanel>
            {/* <TabPanel value={value} index={2}>
              <ComplaintsDetails />
            </TabPanel> */}
          </Box>
        </Box>
      </Box>
    </PageTemplate>
  );
}

export default EnterpriseProfile;
