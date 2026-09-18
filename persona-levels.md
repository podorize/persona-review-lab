# Quatro niveis cumulativos de persona

Objetivo: testar se reviews sinteticas ficam mais similares a uma review real conforme a persona recebe mais contexto.

Use sempre o mesmo paper e a mesma review real como referencia. Na ferramenta atual, o PDF do paper e usado como contexto para gerar as respostas, e a review real e usada para calcular as metricas.

## Regra de interpretacao

L1, L2 e L3 nao recebem o texto da review real no prompt. Esses niveis testam o efeito de aumentar a profundidade da persona sem mostrar o alvo.

L4 recebe a review real no prompt de proposito. Ele nao e uma comparacao "justa" contra L1-L3; ele funciona como controle/upper bound para observar quanto as metricas sobem quando o alvo entra no contexto.

## L1: Persona generica

Profundidade minima. A persona sabe apenas que deve agir como revisora competente de uma conferencia de machine learning.

O que testa: quao parecida uma review sintetica comum fica em relacao a uma review real sem contexto especializado.

## L2: Persona especialista no dominio

Nivel cumulativo: L1 mais conhecimento de dominio.

A persona entende machine learning, graph neural networks, comunidades microbianas, modelagem biologica, simulacao e problemas de baixa amostra.

O que testa: se contexto tecnico de dominio aproxima a review sintetica da review real.

## L3: Persona calibrada por julgamento

Nivel cumulativo: L1 mais L2 mais um perfil individualizado de julgamento.

A persona passa a ter prioridades mais especificas, como cautela com generalizacao biologica, preocupacao com tamanho de amostra, risco de overfitting ao adicionar informacao genomica, clareza para leitores interdisciplinares e validade pratica das conclusoes.

O que testa: se uma persona com prioridades de julgamento mais definidas melhora a similaridade em relacao a uma persona apenas especialista no dominio.

## L4: Persona calibrada pela review real

Nivel cumulativo: L1 mais L2 mais L3, recebendo tambem a review real como contexto.

O que testa: o comportamento das metricas quando ha acesso direto ao alvo. Esse nivel ajuda a interpretar o teto aproximado das metricas lexicais, mas deve ser reportado separadamente.

## Hipotese do experimento

Espera-se que:

- L1 produza uma review plausivel, mas generica;
- L2 recupere mais termos e preocupacoes do dominio;
- L3 se aproxime mais do padrao de julgamento esperado, embora isso possa variar porque prioridades e conteudo se misturam;
- L4 apresente maior similaridade por receber a review real, funcionando como controle de calibracao.
