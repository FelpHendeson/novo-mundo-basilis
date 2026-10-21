# Novo Mundo: Basilis 0.11.0 — Primeiro encontro

Pacote P09-01B2: encontro opcional junto à toca, ao norte da abertura da clareira (casa 4,2). Escolhas: observar à distância, contornar ou enfrentar. Observar registra comportamento sem iniciar combate; voltar à trilha permite decidir depois. Desvio, vitória e retirada são terminais e não podem ser repetidos como fonte de progresso.

A criatura protege uma toca, usa Garrada e tem silhueta quadrúpede original provisória. Espécie não identificada; sem nome ou história canônica nova. Combate individual, HP 20/ataque 4/defesa 2/movimento 3, Garrada potência 5/alcance 1/custo 0. Valores provisórios em `src/game/missions.ts`; usa o tabuleiro existente como arena provisória, sem reivindicar novo mapa definitivo.

Vitória afugenta a criatura; derrota/retirada encerram o confronto em segurança. Sem XP, saque, ferimentos persistentes ou alteração dos eventos das ruínas/base. Os consumíveis realmente usados continuam gastos. No treino anterior, continuam isolados. A curva de XP permanece a mesma; observação é registrada no diário e não anuncia proficiência que ainda não existe.

Schema 7, migração de schemas 1–6, IndexedDB versão 1. Salva observação, início e resultado do encontro. Recarregar durante combate retorna à exploração; na toca, é possível reiniciar com HP/EN restaurados ou encerrar recuando. Itens já salvos não são repostos. Sem salvamento do turno/animação.

Arquitetura: catálogo de missões tipado, técnicas próprias da criatura, registro de contato independente e conclusão da campanha por missão. A cinemática continua uma projeção do resultado imutável.

## Validação inicial
148 testes em 11 arquivos passaram localmente, incluindo 26 casos do novo encontro: escolhas, idempotência, migrações 1–6, IndexedDB, interrupção, resultado isolado das ruínas, três classes sem kit/tutorial e conclusão após cinemática. TypeScript/Vite passaram.

## QA e publicação
Prévia remota: 148 testes/11 arquivos e TypeScript/Vite passaram com `npm test && npm run build`. Artefato igual ao local (árvore Git `482112225420999d36d8d1bb4b84af6f445fff0f`).
Navegador: observação por Enter, adiamento, recarga com descoberta preservada, desvio e reentrada sem novas ações. Outra jornada sem kit: combate, recarga/interrupção, reinício, vitória após dois Cortes/uma Garrada com HP25/28, retorno com 0 XP/0 suprimentos e diário atualizado. Terceira jornada: retirada voluntária e encerramento. Sem erros de console observados.
Encontro em 320×568, 390×844 e 844×390 sem overflow horizontal; botões 48px no menor. Combate por controles HTML em 390×844. Silhueta quadrúpede conferida na cinemática; animações puladas pelos controles. Sem aparelho físico/Safari/benchmark. Derrota, migrações e regressões de base/treino cobertas em testes; ruínas não jogadas manualmente até vitória nesta release.
Código `28c856496954bf2698795738271e4fb48b8f9d84`, branch `release/0.11.0`; tag Git pendente. Produção `dpl_Es7Hb2BnLpwC2YkE4Xn7K4yTnYCn` em https://novo-mundo-basilis.vercel.app. Validação final do domínio abaixo.


## Próximo pacote
P09-02: rota ao castelo e primeira inspeção/reivindicação voluntária. Antes da implementação, fechar mapa, pontos de inspeção, nomeação e compatibilidade do abrigo existente. Ainda sem economia completa, moradores, sete aliados ou arte definitiva.

Produção READY confirmada: 148 testes/11 arquivos e build passaram no deployment de produção. Bundle público `index-v0g4BxER.js`. Checkpoint anterior Viajante/Humano/Guerreiro retomou posição 6,3, XP0 e broche com defesa8; inspeção da toca abriu sem conceder kit/observação/resultado automático. Posição original restaurada após QA. Console sem erros observados.
