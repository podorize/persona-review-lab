# RELATO: Persona Review Lab

## Problema escolhido

O projeto desenvolve uma ferramenta simples ligada a minha pesquisa em personas sinteticas. A dor escolhida foi avaliar, de forma exploratoria, se diferentes niveis de profundidade de uma persona sintetica geram reviews mais proximas de uma review real do OpenReview. A unidade experimental ficou definida como um paper em PDF, uma review real colada pelo pesquisador e quatro reviews sinteticas geradas a partir de prompts cumulativos.

## Processo spec-driven

O desenvolvimento seguiu uma abordagem spec-first, usando arquivos Markdown como artefatos de intencao. A `constitution.md` definiu principios do projeto, como manter criterios visiveis, preservar rastreabilidade e separar a review real dos niveis experimentais principais. A `spec.md` descreveu historias de usuario e criterios de aceitacao; a `plan.md` registrou decisoes tecnicas; a `tasks.md` organizou a implementacao em itens verificaveis. Durante a implementacao, os artefatos foram atualizados quando a ferramenta mudou, em vez de deixar a documentacao como registro antigo.

## Escopo implementado

A versao entregue e uma aplicacao web local. Ela permite colar uma review real, carregar um PDF de paper, editar os prompts dos quatro niveis de persona, gerar reviews sinteticas com Gemini e comparar cada resposta com a review real. Os niveis sao cumulativos: L1 representa uma persona generica, L2 adiciona especializacao de dominio, L3 adiciona um perfil individualizado de julgamento e L4 inclui a review real como condicao de calibracao/upper bound. A ferramenta calcula similaridade cosseno, Jaccard lexical, cobertura da review real e razao de tamanho. Tambem exporta um CSV com prompts, respostas, prompt completo enviado ao modelo e metricas.

## Mudancas durante a implementacao

A ideia inicial era comparar dois textos abertos, mas o escopo evoluiu para gerar automaticamente reviews em niveis de persona. Depois dos primeiros testes, os prompts foram alterados porque estavam induzindo formato explicito de saida, como secoes fixas. Isso distorcia o experimento, pois a ferramenta passava a medir tambem aderencia a uma estrutura textual artificial. Por isso, os prompts foram reescritos para nao impor secoes nem tamanho fixo. Tambem foram removidas metricas superficiais, como termos ausentes, marcadores de estrutura e media composta, mantendo apenas medidas lexicais de apoio. Outra mudanca importante foi retirar a chave Gemini do codigo antes de preparar o repositorio, substituindo-a por um campo local no navegador.

## Resultado do teste

O teste final usou o paper `9504_Modelling_Microbial_Commu.pdf` e uma review real do OpenReview. O CSV exportado esta em `evidence/persona-review-lab-2026-09-18-18-08-45.csv`. Os resultados foram:

| Nivel | Cosseno | Jaccard | Cobertura | Razao tamanho |
| --- | ---: | ---: | ---: | ---: |
| L1 - Generica | 30% | 11% | 19% | 0.86x |
| L2 - Especialista dominio | 20% | 11% | 22% | 1.28x |
| L3 - Calibrada julgamento | 25% | 11% | 23% | 1.27x |
| L4 - Com review real | 49% | 20% | 35% | 1.03x |

O resultado mais importante nao foi simplesmente "qual nivel venceu", mas a ausencia de melhora linear entre L1, L2 e L3. L2 e L3 ficaram mais extensos e trouxeram mais contexto tecnico, mas nao se aproximaram lexicalmente da review real de forma proporcional. Ja L4 teve aumento claro nas metricas, o que era esperado porque recebeu a review real como contexto. Isso reforca que o experimento precisa distinguir profundidade da persona de vazamento controlado do alvo.

## O que o SDD ajudou a perceber

O SDD ajudou a manter o escopo pequeno e verificavel. A cada mudanca, a pergunta deixou de ser "o que da para implementar agora?" e passou a ser "isso ainda responde a especificacao?". Esse processo ajudou a remover funcionalidades que pareciam interessantes, mas desviavam do objetivo, como exportacao em Markdown e metricas baseadas em palavras ausentes. Tambem tornou visivel a diferenca entre requisito experimental e conveniencia de interface: por exemplo, L1-L3 nao podem receber a review real, enquanto L4 deve recebe-la explicitamente como controle.

## Limitacoes

A ferramenta ainda e exploratoria. As metricas implementadas sao lexicais e nao medem equivalencia semantica completa entre ideias. O teste foi feito com um unico paper e uma unica review real, entao nao permite conclusoes gerais sobre personas sinteticas. A geracao depende da disponibilidade e cota gratuita da Gemini API. Mesmo assim, a ferramenta cumpre o objetivo do primeiro trabalho: demonstrar um processo spec-driven aplicado a uma dor real da pesquisa e produzir um prototipo funcional com artefatos, codigo e evidencia de uso.
