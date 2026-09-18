# Specification: Persona Review Lab

## Visao

Persona Review Lab e uma ferramenta web local para gerar reviews sinteticas em quatro niveis de persona e comparar cada resposta com uma review real coletada do OpenReview.

## Problema

Pesquisas com personas sinteticas precisam testar se mais contexto de persona gera respostas mais proximas de uma review real. O pesquisador precisa fornecer o PDF do paper, gerar respostas em niveis cumulativos e observar metricas textuais contra a review real.

## Objetivo da primeira versao

Permitir que o usuario:

1. cole uma review real do OpenReview;
2. selecione o PDF do paper;
3. revise ou edite os prompts de L1, L2, L3 e L4;
4. gere quatro reviews sinteticas com modelo fixo do Gemini;
5. compare cada review gerada com a review real;
6. visualize metricas lexicais por nivel;
7. exporte os dados do lab em CSV.

## Fora de escopo

- Coletar reviews automaticamente no OpenReview.
- Validar cientificamente uma persona sintetica.
- Medir equivalencia semantica completa.
- Fazer analise estatistica em lote.
- Exportar resultado em Markdown.

## Historias de usuario

### US-01: Inserir review real

Como pesquisador, quero colar uma review real do OpenReview para usa-la como referencia.

### US-02: Inserir PDF do paper

Como pesquisador, quero selecionar o PDF do paper para que ele seja usado como contexto de geracao.

### US-03: Gerar reviews em quatro niveis

Como pesquisador, quero gerar reviews sinteticas para L1, L2, L3 e L4 usando o PDF do paper como fonte principal.

#### Criterios de aceitacao

- O sistema mostra o prompt de cada nivel antes da geracao.
- O usuario pode editar os prompts L1, L2, L3 e L4.
- O sistema permite restaurar os prompts padrao.
- Ao restaurar os prompts padrao, o sistema limpa as reviews geradas anteriormente.
- As reviews geradas ficam visiveis, mas nao editaveis.
- Os prompts padrao pedem reviews em ingles sem orientar a estrutura textual nem impor tamanho fixo.
- Os prompts representam profundidades cumulativas de persona: papel minimo, especializacao de dominio, perfil individualizado de julgamento e calibracao com a review real.
- L1, L2 e L3 nao incluem o texto da review real-alvo no prompt.
- L4 inclui a review real de proposito como condicao de calibracao/upper bound.

### US-04: Comparar desempenho textual

Como pesquisador, quero comparar cada review gerada contra a review real.

#### Criterios de aceitacao

- O sistema calcula similaridade cosseno.
- O sistema calcula Jaccard lexical.
- O sistema calcula cobertura da review real.
- O sistema calcula razao de tamanho.
- O sistema nao usa termos ausentes, marcadores de estrutura ou media composta como criterios principais.

### US-05: Exportar lab em CSV

Como pesquisador, quero exportar o estado do experimento para registrar prompts, respostas e metricas.

#### Criterios de aceitacao

- O sistema exporta um CSV com uma linha por nivel.
- O CSV inclui review real, nome do PDF, prompt configurado, prompt completo enviado ao modelo, review gerada e metricas.
- O CSV nao inclui chaves de API.

## Requisitos nao funcionais

- A ferramenta deve funcionar localmente no navegador.
- O modelo Gemini deve ser fixo na aplicacao.
- A review real nao deve ser enviada para a API generativa nos niveis L1, L2 e L3.
- No nivel L4, a review real deve ser enviada de proposito como contexto de calibracao.
- O PDF do paper deve ser enviado em todos os niveis.
- A implementacao nao deve exigir instalacao de modelo local.
