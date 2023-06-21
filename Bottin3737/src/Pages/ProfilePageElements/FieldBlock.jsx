import { Box, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

FieldBlock.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.string,
  clickable: PropTypes.bool
};
function FieldBlock({ fieldName, value, clickable }) {
  return (
    <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Typography style={{ fontSize: 16, fontWeight: '500', margin: '0px 5px 0px 0px', color: 'black' }}>
        {fieldName}{' '}
      </Typography>
      {value && !clickable && <Typography style={{ fontWeight: '600', color: 'black' }}>{value}</Typography>}
      {value && clickable && (
        <Link to={value}>
          <Typography style={{ fontWeight: '600', color: 'black', textDecoration:"none" }}>{value}</Typography>
        </Link>
      )}
    </Box>
  );
}

export default FieldBlock;
