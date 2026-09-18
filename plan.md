# Plan: Persona Review Lab

## Estrategia

Construir uma aplicacao web local que gera reviews sinteticas em quatro niveis a partir do PDF do paper e compara cada uma com uma review real.

## Implementacao

Aplicacao web estatica em `app/index.html`, `app/styles.css` e `app/app.js`.

## Interface

Secoes:

1. Review real e upload do PDF do paper.
2. Prompts editaveis para L1, L2, L3 e L4.
3. Respostas geradas para L1, L2, L3 e L4 em campos somente leitura.
4. Tabela de metricas comparando cada resposta com a review real.
5. Botao de exportacao CSV do lab.

## Modelo de dados

```json
{
  "realReview": "string",
  "pdfFileName": "string",
  "outputs": {
    "level1": "string",
    "level2": "string",
    "level3": "string",
    "level4": "string"
  }
}
```

## Decisoes tecnicas

- Usar Gemini API via `generateContent`, com modelo fixo `gemini-3.5-flash-lite` para priorizar free tier e economia de cota.
- Usar o PDF enviado pelo usuario como `inline_data`.
- Salvar apenas review real, nome do PDF e respostas geradas.
- Enviar para a API apenas o PDF e as instrucoes de persona em L1, L2 e L3.
- Enviar tambem a review real em L4, de forma explicita, como condicao de calibracao/upper bound.
- Exibir e permitir edicao dos prompts antes da geracao.
- Manter as reviews geradas como saida fixa, sem edicao manual.
- Pedir reviews em ingles para evitar incompatibilidade lexical com reviews reais do OpenReview.
- Evitar secoes obrigatorias e tamanho fixo nos prompts, para nao transformar a avaliacao em teste de formato.
- Definir L1, L2, L3 e L4 como niveis cumulativos de profundidade da persona.
- Definir L3 por um perfil abstrato de julgamento inspirado no tipo de review-alvo, sem enviar a review real para a API.
- Definir L4 como uma condicao que recebe a review real para medir o teto aproximado das metricas quando ha vazamento controlado do alvo.
- Calcular metricas no cliente.
- Usar metricas lexicais simples e explicaveis.
- Separar media de similaridade de razao de tamanho, para nao misturar proximidade textual e extensao.
- Exportar CSV no navegador, sem backend, com uma linha por nivel e sem incluir chave de API.

## Riscos

### Vazamento da review real para a geracao

Mitigacao: a implementacao nao inclui a review real nos prompts L1, L2 e L3. L4 inclui a review real intencionalmente e deve ser interpretado separadamente como controle/upper bound.

### Chave exposta no navegador

Mitigacao: a ferramenta e local. Para uso publico, seria necessario backend ou proxy seguro; a chave embutida deve ser removida antes de publicar.

### Similaridade lexical nao capturar semantica

Mitigacao: tratar as metricas como exploratorias e manter embeddings como extensao futura.
