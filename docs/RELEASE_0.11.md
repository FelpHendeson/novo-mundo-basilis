# Novo Mundo: Basilis 0.11.0 — Primeiro encontro

Pacote P09-01B2: encontro opcional junto à toca, ao norte da abertura da clareira (casa 4,2). Escolhas: observar à distância, contornar ou enfrentar. Observar registra comportamento sem iniciar combate; voltar à trilha permite decidir depois. Desvio, vitória e retirada são terminais e não podem ser repetidos como fonte de progresso.

A criatura protege uma toca, usa Garrada e tem silhueta quadrúpede original provisória. Espécie não identificada; sem nome ou história canônica nova. Combate individual, HP 20/ataque 4/defesa 2/movimento 3, Garrada potência 5/alcance 1/custo 0. Valores provisórios em `src/game/missions.ts`; usa o tabuleiro existente como arena provisória, sem reivindicar novo mapa definitivo.

Vitória afugenta a criatura; derrota/retirada encerram o confronto em segurança. Sem XP, saque, ferimentos persistentes ou alteração dos eventos das ruínas/base. Os consumíveis realmente usados continuam gastos. No treino anterior, continuam isolados. A curva de XP permanece a mesma; observação é registrada no diário e não anuncia proficiência que ainda não existe.

Schema 7, migração de schemas 1–6, IndexedDB versão 1. Salva observação, início e resultado do encontro. Recarregar durante combate retorna à exploração; na toca, é possível reiniciar com HP/EN restaurados ou encerrar recuando. Itens já salvos não são repostos. Sem salvamento do turno/animação.

Arquitetura: catálogo de missões tipado, técnicas próprias da criatura, registro de contato independente e conclusão da campanha por missão. A cinemática continua uma projeção do resultado imutável.

## Validação inicial
148 testes em 11 arquivos passaram localmente, incluindo 26 casos do novo encontro: escolhas, idempotência, migrações 1–6, IndexedDB, interrupção, resultado isolado das ruínas, três classes sem kit/tutorial e conclusão após cinemática. TypeScript/Vite passaram.

QA de navegador e referências de publicação serão registrados ao concluir a validação.

## Próximo pacote
P09-02: rota ao castelo e primeira inspeção/reivindicação voluntária. Antes da implementação, fechar mapa, pontos de inspeção, nomeação e compatibilidade do abrigo existente. Ainda sem economia completa, moradores, sete aliados ou arte definitiva.
