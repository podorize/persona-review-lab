# Experiment Design: Persona Review Lab

## Pergunta experimental

As reviews sinteticas geradas com mais contexto de persona ficam mais similares a uma review real especifica do OpenReview?

## Unidade de comparacao

Uma unidade de comparacao e formada por:

- uma review real coletada do OpenReview;
- um PDF de paper;
- quatro reviews sinteticas geradas a partir desse contexto;
- metricas textuais entre a review real e cada resposta sintetica.

## Niveis testados

### L1: Persona generica

Profundidade minima: apenas o papel de revisor de conferencia de machine learning.

### L2: Persona especialista no dominio

Profundidade intermediaria cumulativa: L1 mais conhecimento de GNNs, sistemas biologicos, comunidades microbianas, steady state, simulacao e dados de baixa amostra.

### L3: Persona individualizada por perfil de julgamento

Profundidade alta cumulativa: L1 mais L2, com perfil individualizado de julgamento, incluindo preferencias, cautelas e preocupacoes praticas.

### L4: Persona calibrada pela review real

Condicao de calibracao cumulativa: L1 mais L2 mais L3, recebendo tambem a review real como contexto. Este nivel funciona como controle/upper bound e deve ser interpretado separadamente dos niveis sem acesso ao alvo.

## Regra contra vazamento

A review real nao deve ser enviada para a API generativa em L1, L2 e L3. Ela serve apenas como alvo de comparacao local nesses niveis. Em L4, a review real e enviada intencionalmente para medir o comportamento das metricas quando o alvo entra no prompt.

## Metricas da primeira versao

- Similaridade cosseno.
- Jaccard lexical.
- Cobertura da review real.
- Razao de tamanho.

## Limitacao importante

Esse desenho e exploratorio. Metricas lexicais sao uteis para demonstracao e inspecao inicial, mas nao medem diretamente se as ideias centrais da review real aparecem na review sintetica. Essa comparacao exige avaliacao semantica, julgamento humano ou uma rubrica semantica separada.
