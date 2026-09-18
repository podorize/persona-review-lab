# RELATO: Persona Review Lab

O projeto desenvolve uma ferramenta simples ligada à minha pesquisa em personas sintéticas. A dor escolhida foi avaliar, de forma exploratória, se diferentes níveis de profundidade de uma persona sintética geram reviews mais próximas de uma review real do OpenReview. A unidade experimental ficou definida como um paper em PDF, uma review real colada pelo pesquisador e quatro reviews sintéticas geradas a partir de prompts cumulativos.

## Processo spec-driven

O desenvolvimento seguiu uma abordagem spec-first, usando o GitHub Spec Kit como referência de organização do processo e arquivos Markdown como artefatos. A `constitution.md` definiu princípios do projeto, como manter critérios visíveis, preservar rastreabilidade e separar a review real dos níveis experimentais principais. A `spec.md` descreveu histórias de usuário e critérios de aceitação; a `plan.md` registrou decisões técnicas; a `tasks.md` organizou a implementação em itens verificáveis. Durante a implementação, os artefatos foram atualizados quando a ferramenta mudou, em vez de deixar a documentação como registro antigo.

## Escopo implementado

A versão entregue é uma aplicação web local. Ela permite colar uma review real, carregar um PDF de paper, editar os prompts dos quatro níveis de persona, gerar reviews sintéticas com Gemini e comparar cada resposta com a review real. Os níveis são cumulativos: L1 representa uma persona genérica, L2 adiciona especialização de domínio, L3 adiciona um perfil individualizado de julgamento e L4 inclui a review real como condição de calibração/upper bound. A ferramenta calcula similaridade cosseno, Jaccard lexical, cobertura da review real e razão de tamanho. Também exporta um CSV com prompts, respostas, prompt completo enviado ao modelo e métricas.

## Mudanças durante a implementação

A ideia inicial era comparar dois textos abertos, mas o escopo evoluiu para gerar automaticamente reviews em níveis de persona. Depois dos primeiros testes, os prompts foram alterados porque estavam induzindo formato explícito de saída. Isso distorcia o experimento, pois a ferramenta passava a medir também aderência a uma estrutura textual artificial. Por isso, os prompts foram reescritos para não impor seções nem tamanho fixo. Também foram removidas métricas superficiais, como termos ausentes, marcadores de estrutura e média composta, mantendo apenas medidas lexicais de apoio.

## O que o SDD ajudou

O SDD ajudou a manter o escopo pequeno, verificável, auditável e atualizado. O principal benefício foi criar uma fonte de verdade estável para o projeto. Em vez de deixar decisões importantes espalhadas pelo chat, pela memória do desenvolvedor ou diretamente no código, a intenção do sistema ficou registrada nos artefatos de especificação. Isso tornou mais fácil perceber quando uma mudança era coerente com o objetivo do experimento e quando era apenas uma funcionalidade interessante, mas lateral.

## O que o SDD ajudou a perceber

O SDD ajudou a manter o escopo pequeno, verificável, auditável e atualizado. Esse processo ajudou a remover funcionalidades que pareciam interessantes, mas desviavam do objetivo, como métricas baseadas em palavras ausentes. Tambem tornou visivel a diferenca entre requisito experimental e conveniencia de interface: por exemplo, L1-L3 nao podem receber a review real, enquanto L4 deve recebe-la explicitamente como controle.
