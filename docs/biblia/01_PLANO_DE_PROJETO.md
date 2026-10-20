# Plano de produção narrativa e jogabilidade — 1.1
## Objetivo
Transformar o protótipo de RPG tático em uma campanha vertical completa: chegada a Basilis, tutorial do Sistema universal/mana, conquista do castelo, primeiro encontro humano, recrutamento, treino, reconstrução, comércio e primeira expedição.

## Pipeline de versões incrementais
| Marco | Conteúdo | Aceite |
|---|---|---|
| 0.8.x | Preservação e integração | Sem perda de saves/fluxos existentes |
| 0.9.1 | Introdução/Sistema universal | Prólogo e tutorial jogáveis, sem bloqueio obrigatório |
| 0.9.2 | Castelo | Exploração, trono, reivindicação, nome persistido |
| 0.9.3 | Primeiro contato | Confronto não necessariamente letal + diálogo pós-combate |
| 0.9.4 | Habitação/base | 12 sobreviventes possíveis, tarefas, recursos reais, reparo |
| 0.9.5 | Formação e treinos | Minigames e treinos delegados, perfis, primeira nomeação |
| 0.9.6 | Mercado e contratos | Venda de espólios, missões de guilda, primeira caravana |
| 0.9.7 | Integração | Arco completo, persistência, progressão e QA |
| 0.10 | Polimento | Sprites, áudio, interfaces, acessibilidade, responsividade |
| 1.0 | Lançamento inicial | Arco delimitado estável e documentação |

Correções intermediárias usam patch semver (ex. 0.9.2 → 0.9.2+fix ou 0.9.3 conforme convenção formal do repo); registrar causa, migração, teste e commit.

## Dependências
Regras de domínio antes de população; pessoas/aptidões antes de formação de campeão; inventário/espólio antes de comércio; resolução de combate antes da cinematografia; eventos e flags antes de diálogos ramificados.

## Definição de pronto
Build e testes passam; cenas são executáveis; feedback visual/sonoro; mouse/teclado e toque quando suportado; save preserva escolhas; estado não duplica recompensa; deploy Vercel validado; README, changelog e documentação atualizados.

## Testes de narrativa
Aceitar/adiar kit; reivindicar/adiar castelo; lutar/evitar primeira criatura; sobreviver/derrotar grupo humano sem matar; convidar/recusar; múltiplas classes; save/reload em transições; fast-forward treino; invalidar missões e reentradas.
