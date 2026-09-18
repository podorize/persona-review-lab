# Persona Review Lab

Ferramenta local desenvolvida para o primeiro trabalho da disciplina de Tendencias em Engenharia de Software, no tema Spec-Driven Development.

O projeto explora uma dor ligada a pesquisa em personas sinteticas: comparar reviews geradas por diferentes niveis de contexto de persona com uma review real do OpenReview.

## Como executar

Abra o arquivo:

```text
app/index.html
```

No navegador:

1. cole sua chave Gemini API no campo da interface;
2. clique em `Carregar exemplo` para preencher a review real e o PDF de demonstracao;
3. revise os prompts L1-L4, se quiser;
4. clique em `Gerar respostas`;
5. exporte o CSV.

A chave Gemini fica apenas no navegador e nao e exportada no CSV.

## Artefatos spec-driven

- `constitution.md`: principios e restricoes do projeto.
- `spec.md`: requisitos, historias de usuario e criterios de aceitacao.
- `plan.md`: estrategia tecnica e decisoes de implementacao.
- `tasks.md`: lista de tarefas verificaveis.
- `experiment-design.md`: desenho experimental.
- `RELATO.md`: relato de uma pagina para entrega.

## Aplicacao

Codigo da ferramenta:

- `app/index.html`
- `app/styles.css`
- `app/app.js`

Dados de demonstracao:

- `app/samples/9504_Modelling_Microbial_Commu.pdf`
- `app/sample-pdf.js`

Evidencia do teste final:

- `evidence/persona-review-lab-2026-09-18-18-08-45.csv`

## Niveis de persona

- L1: persona generica de avaliador de conferencia de machine learning.
- L2: L1 + especializacao de dominio.
- L3: L1 + L2 + perfil individualizado de julgamento.
- L4: L1 + L2 + L3 + review real como calibracao/upper bound.

L1, L2 e L3 nao recebem a review real no prompt. L4 recebe a review real propositalmente como controle experimental.

## Limitacoes

As metricas atuais sao lexicais: cosseno, Jaccard, cobertura e razao de tamanho. Elas ajudam a observar padroes, mas nao medem equivalencia semantica completa entre ideias. A ferramenta tambem depende da cota e disponibilidade do modelo Gemini usado.
