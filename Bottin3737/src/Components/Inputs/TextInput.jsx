import { TextField, inputLabelClasses } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const DarkInput = styled(TextField)({
  '& label.Mui-focused': {
    color: 'white'
  },
  '& .MuiFormLabel-root.Mui-disabled': {
    color: '#00bd9a'
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white'
  },
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'white'
    },
    '&:hover fieldset': {
      borderColor: '#00bd9a'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white'
    }
  }
});
export const LightInput = styled(TextField)({
  '& label.Mui-focused': {
    color: '#4a5355'
  },
  '& .MuiFormLabel-root.Mui-disabled': {
    color: '#00bd9a'
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#4a5355'
  },
  '& .MuiOutlinedInput-root': {
    color: '#4a5355',
    '& fieldset': {
      borderColor: '#4a5355'
    },
    '&:hover fieldset': {
      borderColor: '#00bd9a'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4a5355'
    }
  }
});
function TextInput({ label, type, value, onChange, name, required, light }) {
  return (
    <>
      {light == true ? (
        <LightInput
          name={name}
          label={label}
          style={{ width: '100%', marginBottom: 15, marginTop: 15 }}
          variant="outlined"
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          InputLabelProps={{
            sx: {
              // set the color of the label when not shrinked
              color: '#00bd9a',
              [`&.${inputLabelClasses.shrink}`]: {
                // set the color of the label when shrinked (usually when the TextField is focused)
                color: '#4a5355'
              }
            }
          }}
        />
      ) : (
        <DarkInput
          //   focused
          name={name}
          label={label}
          style={{ width: '100%', marginBottom: 15, marginTop: 15 }}
          variant="outlined"
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          InputLabelProps={{
            sx: {
              // set the color of the label when not shrinked
              color: '#00bd9a',
              [`&.${inputLabelClasses.shrink}`]: {
                // set the color of the label when shrinked (usually when the TextField is focused)
                color: '#4a5355'
              }
            }
          }}
        />
      )}
    </>
  );
}

export default TextInput;
