# Persona Review Lab App

Aplicacao web local para gerar reviews sinteticas em quatro niveis cumulativos de persona e comparar cada uma com uma review real do OpenReview.

## Como usar

Abra `index.html` no navegador. Use `Carregar exemplo` para preencher automaticamente a review real atual e carregar o PDF do paper de demonstracao.

## Fluxo

1. Cole uma review real do OpenReview ou clique em `Carregar exemplo`.
2. Selecione o PDF do paper, caso nao esteja usando o exemplo carregado.
3. Revise ou ajuste os prompts L1, L2, L3 e L4.
4. Gere as respostas L1, L2, L3 e L4.
5. Veja as metricas de similaridade textual de cada nivel contra a review real.
6. Exporte o lab em CSV para registrar prompts, respostas e metricas.

O modelo de geracao usa sempre a chave ja cadastrada no navegador.

## Metricas

- Similaridade cosseno: frequencia de termos.
- Jaccard lexical: intersecao entre termos unicos.
- Cobertura da review real: termos da real recuperados pela resposta gerada.
- Razao de tamanho: tamanho relativo da resposta gerada.

Essas metricas sao diagnosticos lexicais de apoio. Elas nao substituem uma avaliacao semantica das ideias presentes na review real e na review sintetica.

## Exportacao CSV

O botao `Exportar CSV` gera um arquivo com uma linha por nivel. O arquivo inclui nome do PDF, modelo usado, review real, prompt configurado, prompt completo enviado ao modelo, review gerada e metricas.

## Prompts e respostas

Os prompts ficam visiveis e editaveis para permitir testar como a profundidade da persona altera a geracao. As respostas geradas ficam em campos somente leitura para preservar o resultado produzido pelo modelo.

Os prompts padrao representam quatro niveis cumulativos: papel minimo, especializacao de dominio, perfil individualizado de julgamento e calibracao com a review real. Eles nao orientam a estrutura textual nem impoem numero fixo de palavras.

L1, L2 e L3 nao recebem a review real no prompt. L4 recebe a review real intencionalmente como condicao de controle/upper bound, entao suas metricas devem ser interpretadas separadamente.
