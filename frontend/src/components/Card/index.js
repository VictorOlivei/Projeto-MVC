import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h2`
  color: #333;
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const CardContent = styled.div`
  margin-top: 12px;
`;

const Card = ({ title, children }) => {
  return (
    <CardContainer>
      {title && <CardTitle>{title}</CardTitle>}
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};

export default Card;
