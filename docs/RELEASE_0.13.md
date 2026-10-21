# Novo Mundo: Basilis 0.13.0 — Primeiro contato

P09-03: após visitar o castelo, investigar vozes na casa 8,5 da clareira. A posse é opcional para conhecer o grupo; é necessária para oferecer acesso sob administração do jogador. Nesta fatia o gatilho é visitar o castelo, sem simular coleta de materiais ainda ausente. Os sobreviventes e interlocutores usam papéis/IDs estáveis; nomes propostos como Cael/Maera continuam não canonizados.

Observar identifica doze pessoas, algumas feridas. Escolher explicar ou exigir armas baixas inicia um confronto individual não letal com o guardião. Baixar as próprias armas permite conversar à distância sem combate. Resistir três rodadas gera trégua; HP0 neutraliza sem morte. Retirar-se ou perder também libera conversa. Sem XP, saque ou recrutamento por derrota. O tabuleiro existente é uma arena provisória, não um novo mapa definitivo.

## Regras provisórias versionadas
Confiança derivada de decisões finitas: explicar +1, exigir -1, resistir três rodadas +1, oferecer uma ração +1, esclarecer precariedade +1, prometer reparos rápidos -1. Neutralização, derrota e retirada não acrescentam confiança por si. Perguntas não dão pontos. Ajuda gasta uma ração real, uma vez. Derrota usa uma ração disponível na recuperação, uma vez; sem estoque, descanso assistido permite continuar sem saldo negativo ou dívida. Suprimentos genéricos da base não são convertidos em comida.

O convite exige nome/posse do castelo e condições apresentadas. Com confiança >=2, o grupo aceita avaliar; abaixo, recusa a proposta atual. Ajuda posterior pode permitir pedido explícito de reavaliação. É possível encerrar sem oferecer convite. Nenhuma resposta transfere habitantes: água, abrigo e segurança ainda precisam ser verificados. População, reparos e assentamento permanecem para P09-04.

Guardião: 26 HP, ataque7, defesa4, movimento3, Contenção potência5/alcance1/custo0; três rodadas para trégua. Estes valores são provisórios em módulos tipados. As técnicas físicas e mágicas continuam disponíveis; a cinemática indica neutralização e não projeta morte neste encontro.

## Persistência e arquitetura
Schema9 migra schemas1–8, sem gerar contato ou modificar conquistas anteriores. IndexedDB continua versão1. Estado de contato independente, custo idempotente, perguntas/decisões limitadas, confiança derivada e resposta persistida. Recarregar em combate retorna à clareira; retomar contato oferece reinício ou retirada sem repetir abertura/confiança, mantendo consumíveis já salvos. Não salva turno/HP da batalha em curso.

## Validação inicial
219 testes/13 arquivos e TypeScript/Vite passaram localmente. 34 casos novos cobrem escolhas, custos, derrota/recarga, convite/recusa/reavaliação, migrações1–8, IndexedDB, três classes, neutralização e trégua após cinemática. Prévia final também passou com `npm test && npm run build`; árvore final `179534160af798d3b56132864c25f89400ffc93e` idêntica à local.
Navegador: jornada Mensageiro/Guerreiro com kit e castelo Aurora: observar via Enter, baixar armas, perguntar por feridos, esclarecer precariedade, convite recusado com confiança1, doar uma ração, pedir reavaliação com confiança2. Recarga conserva avaliação, perguntas e estoque1. Jornada Guarda/Guerreiro sem kit: três rodadas, trégua com HP10/28, conversa e encerramento sem convite. Jornada Retorno/Mago: recarga em combate, reinício com confiança1 sem duplicação, derrota na terceira rodada, uma ração na recuperação e recarga conservando estoque1. Sem XP/suprimentos novos.
Contato em320×568,390×844 e844×390 sem overflow horizontal; botões>=48px em320. Combate em390×844. Sem aparelho físico/Safari/benchmark. Neutralização nas3 classes e derrota sem estoque cobertas por testes; ruínas/base não repetidas manualmente nesta release.
Commits `f5e58c8126500ae1f87837b636f1a0a4786028e0` e `fcc98183a523911b469e8383edb95bf64224ca33`, branch `release/0.13.0`; tag Git pendente. Referências de produção e validação final abaixo.

## Limites e sequência
Arte/mapa provisórios, sem áudio/sprites finais, identidade completa dos doze, assentamento automático, calendário ou fonte nova de materiais. A confiança deste contato não substitui moral/lealdade. A migração protege o abrigo, a formação de Lyra, o castelo e o encontro da criatura. Próximo: P09-04, condições individuais de adesão, retorno físico, fontes/custos e primeiro reparo real. Arco I ainda incompleto.

Correção durante QA: avisos de salvamento da batalha usam uma geração de sessão, em vez de ignorar callbacks durante a pausa da cinemática. Isso evita aviso “Salvando…” permanente e descarta callbacks de uma batalha já encerrada/reiniciada.

## Publicação e conferência final
Production READY `dpl_5ch6Yg4khZiNRbJsAUgADCE4j55v`, commit `fcc98183a523911b469e8383edb95bf64224ca33`, URL https://novo-mundo-basilis.vercel.app. Build de produção executou novamente os219 testes/13 arquivos e TypeScript/Vite; todos passaram. Bundle público `index-DVIHQgWK.js` conferido.
Prévia final Verificação/Guerreiro sem kit: trégua na terceira rodada, HP10/28, confirmação “Decisão do encontro salva. Sem XP ou saque.” depois da cinemática e retorno à conversa; console sem erros observados.
Domínio público: checkpoint Viajante/Humano/Guerreiro anterior retomou posição6,3, XP0 e suprimentos0. Entrada do contato confirmou confiança0, sem abertura/ajuda/convite automáticos. Retorno à clareira e posição6,3 restaurada. Nenhum erro de console observado. A inspeção marca apenas a descoberta do encontro.
