import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";

const RegisterContainer = styled.div`
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

const SuccessMessage = styled.div`
  color: #2e7d32;
  background-color: #edf7ed;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 16px;
`;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const result = await register(name, email, password);

      if (result.success) {
        setSuccess(
          "Cadastro realizado com sucesso! Redirecionando para o login..."
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Erro ao tentar fazer cadastro. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <Title>Cadastro</Title>

      <Card>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            required
          />

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

          <Input
            label="Confirmar Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua senha"
            required
          />

          <Button type="submit" disabled={loading || success}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

        <LoginLink>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </LoginLink>
      </Card>
    </RegisterContainer>
  );
};

export default Register;
