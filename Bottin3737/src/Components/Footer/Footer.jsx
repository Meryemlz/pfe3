import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import myImage from '../../images/logo.png';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import PlaceOutlinedIcon from '@material-ui/icons/PlaceOutlined';
import PhoneInTalkOutlinedIcon from '@material-ui/icons/PhoneInTalkOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {
    display: 'inline-block',
    color: '#fff',
    position: 'relative',
    cursor: 'pointer'
  },
  text: {
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateX(15px)',
      color: 'white'
    },
    display: 'inline-block',
    color: '#00bd9a',
    position: 'relative',
    cursor: 'pointer',
    margin: '10px 0px'
  },
  iconButton: {
    color: '#2a2a33',
    backgroundColor: 'white',
    borderRadius: '2px',
    padding: '5px',
    '&:hover': {
      color: 'white',
      backgroundColor: '#00bd9a'
    }
  },
  Arrowroot: {
    display: 'flex',
    alignItems: 'center'
    // padding: '10px 0px',
    // '&:hover': {
    //   cursor: 'pointer',
    //   '& $arrow': {
    //     opacity: 1,
    //     marginLeft: '-10px'
    //   }
    // }
  },
  arrow: {
    opacity: 0,
    transitionDuration: '300ms',
    color: '#00bd9a'
  },
  infoIcons: {
    color: '#00bd9a'
  }
}));
function Footer() {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        backgroundColor: '#2a2a33',
        flexDirection: 'row',
        paddingTop: '100px',
        paddingRight: '80px',
        justifyContent: 'center',
        paddingLeft: '90px'
      }}
    >
      <Box sx={{ flex: 4, backgroundColor: '#2a2a33' }}>
        <img src={myImage} alt="My Image" style={{ maxHeight: 80, maxWidth: '30%' }} />
        <Typography style={{ paddingTop: '3em', color: 'white', width: '75%' }}>{t('bottin description')}</Typography>
        <Box sx={{ margin: '20px 10px 0px 0px' }}>
          <Link to="">
            <IconButton>
              <FacebookIcon className={classes.iconButton} />
            </IconButton>
          </Link>
          <Link to="">
            <IconButton>
              <TwitterIcon className={classes.iconButton} />
            </IconButton>
          </Link>
          <Link to="">
            <IconButton>
              <InstagramIcon className={classes.iconButton} />
            </IconButton>
          </Link>
          <Link to="">
            <IconButton>
              <LinkedInIcon className={classes.iconButton} />
            </IconButton>
          </Link>
        </Box>
      </Box>
      <Box sx={{ flex: 3, paddingTop: '2em', display: 'flex', flexDirection: 'column' }}>
        <Typography
          style={{ fontSize: '20px', color: '#00bd9a', fontWeight: '500', lineHeight: '1.2', marginBottom: '30px' }}
        >
          {t('about')}
        </Typography>

        <div className={classes.Arrowroot}>
          <span className={classes.arrow}>˂</span>
          <Link to="" className={classes.text} style={{ fontSize: '18px' }}>
            {t('about group3737')}
          </Link>
        </div>
        <div className={classes.Arrowroot}>
          <span className={classes.arrow}>˂</span>
          <Link to="/" className={classes.text}>
            {t('homepage')}
          </Link>
        </div>

        <div className={classes.Arrowroot}>
          <span className={classes.arrow}></span>
          <Link to="" className={classes.text} style={{ paddingLeft: '10px' }}>
            {t('privacy policy')}
          </Link>
        </div>
      </Box>
      <Box sx={{ flex: 2, paddingTop: '2em' }}>
        <Typography
          style={{ fontSize: '20px', color: '#00bd9a', fontWeight: '500', lineHeight: '1.2', marginBottom: '25px' }}
        >
          {t('Contact information')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', margin: '20px 0px' }}>
          <PlaceOutlinedIcon className={classes.infoIcons} />
          <Typography style={{ color: '#666666', fontSize: '16px', padding: '0px 10px' }}>
            {' '}
            3737 Crémazie Est, Montréal, Québec, H1Z 2K4
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', margin: '20px 0px' }}>
          <PhoneInTalkOutlinedIcon className={classes.infoIcons} />
          <Typography style={{ color: 'white', fontSize: '16px', padding: '0px 10px' }}> (514) 544-3737</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', margin: '20px 0px' }}>
          <EmailOutlinedIcon className={classes.infoIcons} />
          <Typography style={{ color: 'white', fontSize: '16px', padding: '0px 10px' }}>
            {' '}
            contact@groupe3737.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
