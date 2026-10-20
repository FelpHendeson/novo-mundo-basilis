# Plano de produção narrativa e jogabilidade — 1.2
## Objetivo
Transformar o protótipo de RPG tático em uma campanha vertical completa: chegada a Basilis, tutorial do Sistema universal/mana, conquista do castelo, primeiro encontro humano, recrutamento, treino, reconstrução, comércio e primeira expedição.

## Pipeline de versões incrementais
| Marco | Conteúdo | Aceite |
|---|---|---|
| 0.8.x (correções) | Preservação | Sem perda de saves/fluxos existentes; funcionalidades novas entram em MINOR |
| P09-01 | Introdução/Sistema universal | Prólogo e tutorial jogáveis, sem bloqueio obrigatório |
| P09-02 | Castelo | Exploração, trono, reivindicação, nome persistido |
| P09-03 | Primeiro contato | Confronto não necessariamente letal + diálogo pós-combate |
| P09-04 | Habitação/base | 12 sobreviventes possíveis, tarefas, recursos reais, reparo |
| P09-05 | Formação e treinos | Minigames e treinos delegados, perfis, primeira nomeação |
| P09-06 | Mercado e contratos | Venda de espólios, missões de guilda, primeira caravana |
| P09-07 | Integração | Arco completo, persistência, progressão e QA |
| Após integração (MINOR a definir) | Polimento | Sprites, áudio, interfaces, acessibilidade, responsividade |
| 1.0 | Lançamento inicial | Arco delimitado estável e documentação |

Os códigos P09-01–07 identificam pacotes, não versões do jogo. A antiga numeração 0.9.1–0.9.7 foi normalizada nesta revisão para não usar PATCH em funcionalidades. A próxima entrega funcional será 0.9.0, inicialmente P09-01A; demais marcos funcionais usarão novos MINOR conforme escopo fechado. Correções publicadas usam PATCH (ex.: 0.9.1), não `+fix`. Registrar causa, migração, teste e commit. Referência operacional: [plano de execução](11_PLANO_EXECUCAO.md).

## Dependências
Regras de domínio antes de população; pessoas/aptidões antes de formação de campeão; inventário/espólio antes de comércio; resolução de combate antes da cinematografia; eventos e flags antes de diálogos ramificados.

## Definição de pronto
Build e testes passam; cenas são executáveis; feedback visual/sonoro; mouse/teclado e toque quando suportado; save preserva escolhas; estado não duplica recompensa; deploy Vercel validado; README, changelog e documentação atualizados.

## Testes de narrativa
Aceitar/adiar kit; reivindicar/adiar castelo; lutar/evitar primeira criatura; sobreviver/derrotar grupo humano sem matar; convidar/recusar; múltiplas classes; save/reload em transições; fast-forward treino; invalidar missões e reentradas.
