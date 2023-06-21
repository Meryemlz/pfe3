import React from 'react';

import styled from 'styled-components';

const Button = styled.button`
  min-height: 10px;
  display: block;
  width: 100%;
  padding: 15px 0px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background-color: #00bd9a;
  margin: 20px 0px;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  &:hover {
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.16);
    background-color: #2a2a33;
  }
`;
export function MainButton({ onClick, text }) {
  return <Button onClick={onClick}>{text}</Button>;
}

export default MainButton;
