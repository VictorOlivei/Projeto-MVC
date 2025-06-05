import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";

const LoginContainer = styled.div`
  max-width: 500px;
  margin: 40px auto;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 24px;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #fdecea;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 16px;
`;

const Login = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Erro ao tentar fazer login. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Title>Login</Title>

      <Card>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
            required
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <RegisterLink>
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </RegisterLink>
      </Card>
    </LoginContainer>
  );
};

export default Login;
