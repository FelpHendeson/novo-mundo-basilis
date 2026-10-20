# Release 0.6.0 — Experiência e nível

20/10/2026. Código `5f1511d404cb510f09557c3db70f23395d427693`.

## Entrega

Primeira vitória no encontro concede 100 XP e nível 2 ao viajante. Derrota e repetição não concedem XP nem suprimentos adicionais. Nível é derivado do XP para evitar divergência entre campos; atributos são reconstruídos a partir do catálogo e dos ganhos, sem acumular aumentos ao reiniciar cenas. Nível 1 preserva o balanceamento anterior.

| Classe | Ganhos no nível 2 |
|---|---|
| Guerreiro | +3 HP, +1 energia, +1 ataque, +1 defesa |
| Mago | +2 HP, +3 energia, +1 magia, +1 defesa |
| Ladino | +2 HP, +1 energia, +1 ataque, +1 defesa |

Criação e ficha explicam os ganhos, recompensa e limite. Exploração mostra nível/XP; vitória informa a recompensa e o resultado do salvamento. O painel da batalha informa o nível de início do encontro; evolução entra ao iniciar outra batalha. Repetir usa o perfil atualizado da campanha. Movimento, técnicas, Lyra e inimigos permanecem inalterados.

## Checkpoint

Formato schema 2, com XP validado e coerente com o encontro único. Banco IndexedDB mantém versão 1/stores existentes. Schema 1 é migrado ao carregar e normalizado para schema 2 ao salvar. Campanhas já vitoriosas recebem 100 XP retroativos, preservando suprimentos e eventos, sem repetir recompensa. Dados inválidos ou schema futuro são rejeitados sem apagar o checkpoint. Versões antigas do jogo não leem schema 2; rollback do cliente exige considerar essa limitação.

## Testes e validação

- 61 testes em seis arquivos passaram. Incluem migração antes/depois da vitória, escrita/leitura IndexedDB, XP inválido/inconsistente, recompensa única, derrota, ganhos de três classes, isolamento do catálogo e NPCs, além das regressões anteriores de combate e saves.
- TypeScript e build Vite passaram. Permanece aviso de bundle maior que 500 kB (JS ~1,24 MB, ~345 kB gzip), sem medição de desempenho.
- Prévia: criação nível 1, exploração/diálogo/ruínas, vitória do Guerreiro no turno 3 com ataques físicos e mágicos, animação/pulo, +100 XP/nível 2 e checkpoint. Reinício mostrou 31 HP/9 EN/9 ataque/7 defesa, Lyra inalterada. Recarga e continuação preservaram 100 XP/três suprimentos e ficha evoluída.
- Mobile: batalha exercitada em 844×390; ficha expandida também em 320×568 e 390×844 sem overflow horizontal. Sem aparelho físico/Safari/iOS/teclado virtual.
- Produção: checkpoint anterior Humano/Guerreiro antes da vitória continuou mantendo perfil, posição e eventos, agora nível 1/0 XP. Bundle `index-DV0RuhLU.js` confirmado. Console sem erros observados nos percursos de prévia e produção.
- Migração retroativa após vitória, repetição sem recompensa e classes Mago/Ladino no nível 2 foram verificadas automaticamente; sem repetir todos esses percursos manualmente em produção.

## Publicação e limites

Vercel production READY `dpl_531VDcA7Y5j2ASqDDYmyMcKjbT3z`, código `5f1511d`.
URL https://novo-mundo-basilis.vercel.app.
Branch `release/0.6.0`; tag Git não criada pelas ferramentas disponíveis.

Limite temporário nível 2/100 XP, apenas protagonista e encontro existente. Sem equipamentos, técnicas novas, progressão dos aliados ou bônus raciais. Ganhos são balanceamento inicial de protótipo e não estabelecem lore. Sem sincronização multiaba/nuvem; salvamento da batalha em andamento continua fora do escopo.
