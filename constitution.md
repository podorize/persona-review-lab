# Constitution: Persona Review Lab

## Principios do projeto

### 1. Review real como referencia local
A review real deve ser usada apenas para calcular metricas de comparacao nos niveis L1, L2 e L3. No nivel L4, ela pode ser enviada para a API generativa de forma explicita como uma condicao de calibracao/upper bound.

### 2. PDF como entrada da geracao
A geracao das respostas sinteticas deve usar o PDF do paper fornecido pelo usuario e as instrucoes internas de persona.

### 3. Quatro niveis cumulativos de persona
A ferramenta deve gerar respostas para quatro niveis cumulativos: L1 generica, L2 especialista no dominio, L3 calibrada por perfil de julgamento e L4 calibrada pela review real.

### 4. Metricas interpretaveis
As metricas devem ser simples, transparentes e explicaveis em sala. A primeira versao prioriza cosseno lexical, Jaccard, cobertura da review real, media de similaridade e razao de tamanho como controle separado.

### 5. Uso local da chave
A primeira versao usa chave configurada localmente no app. Ela nao deve ser publicada em repositorios ou disponibilizada em site publico.

### 6. Resultado direto na tela
As respostas geradas e as metricas devem ser exibidas diretamente na interface. A primeira versao pode exportar CSV para registro do experimento, mas nao deve incluir Markdown exportado nem campos auxiliares de anotacao.

## Restricoes

- A primeira versao nao coleta dados automaticamente do OpenReview.
- A primeira versao nao pede chave de API na interface.
- A primeira versao nao envia a review real para a API generativa em L1, L2 e L3.
- A primeira versao envia a review real em L4 apenas porque esse nivel foi definido como controle de calibracao.
- A primeira versao nao exporta Markdown.
- A primeira versao pode exportar CSV do lab.
- A primeira versao nao promete equivalencia semantica completa.

## Definicao de pronto

Uma funcionalidade so esta pronta quando:

- review real pode ser colada e PDF pode ser selecionado;
- L1, L2, L3 e L4 podem ser geradas;
- as metricas sao calculadas para cada nivel;
- termos ausentes da review real sao exibidos por nivel;
- as limitacoes das metricas lexicais estao registradas.
