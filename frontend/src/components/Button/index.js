import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${(props) =>
    props.variant === "secondary" ? "#6c757d" : "#4CAF50"};
  border: none;
  color: white;
  padding: 10px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.variant === "secondary" ? "#5a6268" : "#45a049"};
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Button = ({ children, variant, ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
