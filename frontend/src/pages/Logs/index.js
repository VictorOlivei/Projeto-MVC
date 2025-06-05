import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../services/api";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";

const LogsContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 24px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
`;

const LogsList = styled.div`
  background-color: #1e1e1e;
  color: #f0f0f0;
  border-radius: 4px;
  padding: 16px;
  font-family: "Courier New", monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
`;

const LogEntry = styled.div`
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #fdecea;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 24px;
  color: #666;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logType, setLogType] = useState("combined");
  const [limit, setLimit] = useState(10);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/logs?type=${logType}&limit=${limit}`);
      if (response.data.success) {
        setLogs(response.data.data.logs || []);
      } else {
        setError(response.data.message || "Erro ao obter logs.");
      }
    } catch (err) {
      setError(
        "Erro ao conectar com o servidor. Verifique se a API está em execução."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar logs ao carregar a página e quando os filtros mudarem
  useEffect(() => {
    fetchLogs();
  }, [logType, limit]);

  return (
    <LogsContainer>
      <Title>Logs do Sistema</Title>

      <Card>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FilterContainer>
          <FilterGroup>
            <label htmlFor="logType">Tipo de Log:</label>
            <select
              id="logType"
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            >
              <option value="combined">Combined</option>
              <option value="error">Error</option>
              <option value="access">Access</option>
            </select>
          </FilterGroup>

          <FilterGroup>
            <Input
              label="Limite"
              type="number"
              min="1"
              max="1000"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
            />
          </FilterGroup>

          <Button onClick={fetchLogs}>Atualizar</Button>
        </FilterContainer>

        {loading ? (
          <LoadingMessage>Carregando logs...</LoadingMessage>
        ) : (
          <LogsList>
            {logs.length > 0 ? (
              logs.map((log, index) => <LogEntry key={index}>{log}</LogEntry>)
            ) : (
              <p>Nenhum log encontrado.</p>
            )}
          </LogsList>
        )}

        <ButtonContainer>
          <Button onClick={fetchLogs}>Atualizar Logs</Button>
        </ButtonContainer>
      </Card>
    </LogsContainer>
  );
};

export default Logs;
