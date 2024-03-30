import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  outline: none;
  cursor: pointer;
`;

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
    <StyledButton {...props} />
);

export default Button;
