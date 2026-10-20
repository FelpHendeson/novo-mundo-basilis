# Release 0.9.0 — Introdução, Sistema e diário

20/10/2026. Código `8ef54fa975a66d2a5a921bb335e662ebdc124315`.

## Entrega

Última manhã na Terra antes da criação; personagem confirmado inicia chegada à clareira. Consulta opcional ao Sistema com Onde estou?, Quem é você?, Agora não e Seguir pela clareira. Adiar libera o jogo; consultar novamente é possível na exploração. Mensagens preservam os mistérios, sem kit anunciado como recebido ou promessa de conteúdo indisponível.

Novo módulo puro `narrative.ts` possui IDs de cena/nó e ledger finito de eventos únicos, separado da apresentação. `journal.ts` deriva objetivos e descobertas de consultas efetivamente feitas e conquistas existentes; não concede recompensas nem inventa flags de missão. Diário expansível acompanha Lyra, passagem, base e equipe. Domínio de combate, progressão e acessórios preservado. Teclas sobre summaries/links/formulários deixam de mover o mapa por engano.

Arte provisória original desenhada por código: mesa/refeição, terreno em tiles 32×32 e avatar 32×48 com cor da classe. Não é catálogo de sprites ou personalização visual; sem áudio e animação de caminhada nesta entrega. Ao consultar depois, a composição usa texto de consulta em vez de repetir o despertar.

## Persistência

Schema 5, banco IndexedDB versão 1 inalterado. Schemas 1–4 migram à exploração com ledger legado, sem reinício, teleporte, perda de XP, acessórios, base ou reserva. Perguntas não são marcadas como respondidas pela migração. Nova jornada salva após confirmação da criação; antes dela, recarregar retorna ao menu e não cria personagem parcial. Chegada/resposta retoma via Continuar. Save inválido não substitui o válido; erro de armazenamento é informado e permite jogar na sessão. Clientes anteriores não leem schema 5, limitação relevante para rollback.

## Testes e navegador

- 109 testes em nove arquivos passaram. Onze casos novos cobrem escolha/adiamento, reentrada/idempotência sem alterar recursos, migração de fixtures schemas 1–4 com conquistas/gear/base/reserva, resposta restaurada via IndexedDB, diário sem informação não consultada, dados narrativos inválidos e proteção do save.
- Build TypeScript/Vite aprovado. Bundle JS ~1,257 MB, ~349 kB gzip, com aviso existente acima de 500 kB; desempenho não medido.
- Prévia: última manhã/criação Ari/Mago; consulta identidade, recarga e continuação na mesma resposta; Agora não, exploração/diário; movimento, reabertura, pergunta Onde estou? por Enter e repetição; saída mantendo posição; diário sem linhas duplicadas; conversa com Lyra e entrada na batalha com atributos corretos.
- Criador: troca de classe/raça na prévia; tentativa de substituir checkpoint sem checkbox bloqueada. Retorno ao menu conservou Ari/Mago e o progresso. Não foi sobrescrito um checkpoint público para testar esse caso.
- 390×844, 320×568 e 844×390 sem overflow horizontal no painel Sistema; botões medidos em 48 px. Em 320×568 o painel rola mantendo a composição visível. Legendas decorativas do canvas reduzem bastante, mas escolhas/respostas essenciais estão no HTML.
- Produção: checkpoint anterior Humano/Guerreiro continuou diretamente na exploração, posição 6,3, eventos e broche preservados (defesa 8). Diário reconheceu o legado; consulta ao Sistema e retorno mantiveram estado. Bundle `index-Cj8o2Hk0.js`, console sem erros observados nos percursos.

Sem aparelho físico/Safari/iOS/teclado virtual. Não foi repetida partida manual completa até vitória/derrota, nem todo fluxo da base; regressões e migração dessas conquistas cobertas automaticamente.

## Publicação e limites

Vercel production READY `dpl_HLmksZmgYE4wDEAuqUxLyFmbp28w`, código `8ef54fa`.
URL https://novo-mundo-basilis.vercel.app.
Branch `release/0.9.0`; tag Git ainda pendente pelas ferramentas disponíveis.

Pacote P09-01A entregue. Kit funcional, consumíveis, tutorial/minigame de mana, castelo, habitantes, comércio e nova curva de progressão continuam fora desta release. O ledger é narrativo e finito, não um motor genérico de todas as consequências futuras. Próximo pacote P09-01B requer definir efeitos, custos e limites antes de implementação.
