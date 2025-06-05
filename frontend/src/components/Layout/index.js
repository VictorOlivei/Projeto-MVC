import React from "react";
import styled from "styled-components";
import Header from "../Header";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const Main = styled.main`
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

const Footer = styled.footer`
  background-color: #333;
  color: white;
  padding: 16px;
  text-align: center;
`;

const Layout = ({ children }) => {
  return (
    <Container>
      <Header />
      <Main>{children}</Main>
      <Footer>
        &copy; {new Date().getFullYear()} API MVC - Arquitetura para Projetos
        Futuros
      </Footer>
    </Container>
  );
};

export default Layout;
