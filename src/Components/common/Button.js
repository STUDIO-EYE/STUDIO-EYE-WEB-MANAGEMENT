import React from 'react';
import styled from 'styled-components';
// import palette from '../../lib/styles/palette';

const StyledButton = styled.button`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  outline: none;
  cursor: pointer;
  
`;

const Button = props => <StyledButton {...props} />;

export default Button;