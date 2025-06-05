import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";

const HeaderContainer = styled.header`
  background-color: #4caf50;
  color: white;
  padding: 16px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-left: 24px;
  font-weight: 500;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: 24px;
  font-weight: 500;
  font-size: 1rem;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  margin-right: 12px;
  font-weight: 500;
`;

const Header = () => {
  const { signed, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">API MVC</Logo>
        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/health">Health Check</NavLink>
          {signed && user?.role === "admin" && (
            <NavLink to="/logs">Logs</NavLink>
          )}

          {signed ? (
            <UserInfo>
              <UserName>Olá, {user?.name}</UserName>
              <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
            </UserInfo>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Cadastro</NavLink>
            </>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
