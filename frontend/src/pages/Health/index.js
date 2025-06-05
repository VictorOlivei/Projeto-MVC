import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../services/api";
import Card from "../../components/Card";
import Button from "../../components/Button";

const HealthContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 24px;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const StatusIndicator = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.status === "OK" ? "#4CAF50" : "#d32f2f"};
  margin-right: 8px;
`;

const StatusText = styled.span`
  font-weight: 500;
  color: ${(props) => (props.status === "OK" ? "#4CAF50" : "#d32f2f")};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MetricCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MetricTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 8px;
  color: #333;
  font-size: 1.1rem;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: #4caf50;
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
  margin-top: 24px;
  text-align: center;
`;

const Health = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHealthData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/health");
      if (response.data.success) {
        setHealthData(response.data.data);
      } else {
        setError("Erro ao obter dados de saúde do sistema.");
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

  // Buscar dados de saúde ao carregar a página
  useEffect(() => {
    fetchHealthData();
  }, []);

  // Formatar o tempo de atividade em formato legível
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    let result = "";
    if (days > 0) result += `${days}d `;
    if (hours > 0 || days > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}m `;
    result += `${remainingSeconds}s`;

    return result;
  };

  // Formatar bytes em formato legível
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <HealthContainer>
      <Title>Health Check</Title>

      <Card>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading ? (
          <LoadingMessage>
            Carregando dados de saúde do sistema...
          </LoadingMessage>
        ) : (
          healthData && (
            <>
              <StatusContainer>
                <StatusIndicator status={healthData.status} />
                <StatusText status={healthData.status}>
                  Status: {healthData.status}
                </StatusText>
              </StatusContainer>

              <p>
                Última atualização:{" "}
                {new Date(healthData.timestamp).toLocaleString()}
              </p>

              <MetricsGrid>
                <MetricCard>
                  <MetricTitle>Tempo de Atividade</MetricTitle>
                  <MetricValue>{formatUptime(healthData.uptime)}</MetricValue>
                </MetricCard>

                {healthData.metrics && healthData.metrics.process && (
                  <>
                    <MetricCard>
                      <MetricTitle>Uso de Memória</MetricTitle>
                      <MetricValue>
                        {formatBytes(
                          healthData.metrics.process.memoryUsage.rss
                        )}
                      </MetricValue>
                    </MetricCard>

                    <MetricCard>
                      <MetricTitle>CPU Cores</MetricTitle>
                      <MetricValue>
                        {healthData.metrics.system.cpus}
                      </MetricValue>
                    </MetricCard>

                    <MetricCard>
                      <MetricTitle>Memória Total</MetricTitle>
                      <MetricValue>
                        {formatBytes(healthData.metrics.system.totalMemory)}
                      </MetricValue>
                    </MetricCard>
                  </>
                )}
              </MetricsGrid>

              <ButtonContainer>
                <Button onClick={fetchHealthData}>Atualizar Dados</Button>
              </ButtonContainer>
            </>
          )
        )}
      </Card>
    </HealthContainer>
  );
};

export default Health;
