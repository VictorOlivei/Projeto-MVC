import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/Card";
import Button from "../../components/Button";

const HomeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 24px;
`;

const Description = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 32px;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CardDescription = styled.p`
  color: #666;
  margin-bottom: 16px;
  flex-grow: 1;
`;

const ButtonContainer = styled.div`
  margin-top: auto;
`;

const Home = () => {
  const { signed, user } = useAuth();

  return (
    <HomeContainer>
      <Title>API MVC - Arquitetura para Projetos Futuros</Title>

      <Description>
        Bem-vindo à interface de demonstração da API MVC. Esta aplicação permite
        testar os endpoints da API e visualizar os dados retornados de forma
        amigável.
      </Description>

      <CardGrid>
        <Card title="Health Check">
          <CardContent>
            <CardDescription>
              Verifique o status de saúde do sistema, incluindo tempo de
              atividade, uso de memória e outras métricas.
            </CardDescription>
            <ButtonContainer>
              <Link to="/health">
                <Button>Verificar Saúde</Button>
              </Link>
            </ButtonContainer>
          </CardContent>
        </Card>

        {signed && user?.role === "admin" && (
          <Card title="Logs do Sistema">
            <CardContent>
              <CardDescription>
                Acesse os logs do sistema para monitorar atividades e
                identificar possíveis problemas. (Apenas para administradores)
              </CardDescription>
              <ButtonContainer>
                <Link to="/logs">
                  <Button>Ver Logs</Button>
                </Link>
              </ButtonContainer>
            </CardContent>
          </Card>
        )}

        {!signed && (
          <Card title="Autenticação">
            <CardContent>
              <CardDescription>
                Faça login para acessar recursos protegidos ou registre-se para
                criar uma nova conta.
              </CardDescription>
              <ButtonContainer>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary" style={{ marginLeft: "8px" }}>
                    Cadastro
                  </Button>
                </Link>
              </ButtonContainer>
            </CardContent>
          </Card>
        )}
      </CardGrid>
    </HomeContainer>
  );
};

export default Home;
