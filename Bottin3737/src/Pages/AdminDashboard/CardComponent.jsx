import { Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CardComponent({ value, text, route }) {
  const navigate = useNavigate();
  const handleClick = (route) => {
    // Navigate to desired route
    navigate(`/${route}`);
  };

  return (
    <Button onClick={() => handleClick(route)}>
      <Box
        // elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: (theme) => theme.palette.background.paper,
          width: '100%',
          height: '100%'
        }}
      >
        <Typography style={{ fontSize: '20px', color: '#283339', fontWeight: '600' }}>{value}</Typography>
        <Typography style={{ fontSize: '16px', color: '#283339', fontWeight: '500', textTransform: 'none' }}>
          {text}
        </Typography>
      </Box>
    </Button>
  );
}

export default CardComponent;
