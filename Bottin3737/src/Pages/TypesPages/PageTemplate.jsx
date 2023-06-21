import { Box } from '@mui/material';
import React from 'react';
import CustomAppBar from 'src/Components/AppBar/CustomAppBar';
import Footer from 'src/Components/Footer/Footer';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // set minimum height to full viewport height
  },
  content: {
    // flexGrow: 1, // grow to fill remaining space
    padding: '0px', // add some padding for content spacing
    backgroundColor:"#F2F3F4",
    minHeight: '100vh'
  },
  footer: {
    flexShrink: 0, // don't allow footer to shrink when there's extra space
    marginTop: 'auto' // push footer to bottom by setting margin-top auto
  }
}));
function PageTemplate({ children }) {
  const classes = useStyles();
  return (
    <>
      {/* <CustomAppBar />
      <Box sx={{}} flexGrow={1}>
        {children}
      </Box>
      <Box
        sx={{
          backgroundColor: '#2a2a33',
          width: '100%',
          zIndex: 5,
          justifyContent: 'center',
          display: 'flex',
          height: '50%'
        }}
      >
        <Footer />
      </Box> */}
      <CustomAppBar />
      <div className={classes.root}>
        <main className={classes.content}> {children}</main>
        <footer className={classes.footer}>
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default PageTemplate;
