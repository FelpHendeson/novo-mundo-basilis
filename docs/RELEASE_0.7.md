# Release 0.7.0 — Inventário e acessórios

20/10/2026. Código `475a25626ca337220b0aa268cafeaae192612f81`.

## Entrega

O viajante possui um inventário inicial com três acessórios, utilizáveis por qualquer classe, e um espaço de equipamento vazio. Na exploração, o painel **Inventário e acessórios** permite comparar, equipar, substituir e remover. Estado expandido e rolagem são preservados durante redesenhos. Trocas salvam o checkpoint e atualizam a ficha; a próxima batalha recebe os atributos recalculados. Não há troca durante combate.

| Item provisório | Efeito |
|---|---|
| Braçadeira de treino | Ataque +2 |
| Foco simples | Magia +2 |
| Broche reforçado | Defesa +2 |

Um bônus por vez, sem alterar HP/energia/movimento ou técnicas. A troca de ataque por defesa remove o ataque extra. Os dados de classe/nível são recomputados, evitando acumulação. Lyra e inimigos não recebem acessórios. Nomes e valores são balanceamento inicial de protótipo, sem definir lore nova.

## Compatibilidade

Campanhas agora usam schema 3, com inventário e ID do acessório. Schemas 1/2 recebem os três itens sem equipar nenhum; perfil, XP, posição e eventos são preservados. Schema 1 mantém a migração retroativa de XP após vitória. IDs desconhecidos, duplicatas e acessório não possuído são rejeitados sem substituir checkpoint válido. Banco IndexedDB continua versão 1, com stores existentes. Clientes antigos não leem schema 3; rollback requer considerar essa limitação.

## Validação

- 87 testes em sete arquivos passaram; 26 casos novos cobrem 18 combinações classe/nível/item, bônus no dano físico/mágico e defesa, troca/remoção sem acumulação, NPCs, snapshot de batalha, posse/IDs/dados inválidos, migração de schemas 1/2 e persistência IndexedDB.
- TypeScript e Vite build passaram. Aviso existente de bundle maior que 500 kB continua (JS ~1,245 MB; ~346 kB gzip); desempenho não medido.
- Prévia: os três itens equipados/trocados e removidos; ficha passou de ataque 8→10, magia 2→4 ou defesa 6→8 conforme item, voltando ao estado-base ao remover. Recarga manteve braçadeira. Exploração até ruínas e entrada na batalha mostraram ataque 10 e identificação do acessório; Lyra e demais atributos preservados.
- Simulações 390×844, 320×568 e 844×390 sem overflow horizontal. Em 390×844, botões de item medidos em 60 px e remoção em 48 px. Troca exercitada em paisagem.
- Produção: checkpoint anterior Humano/Guerreiro continuou com posição/eventos e inventário inicial sem item equipado. Broche elevou defesa 6→8 e foi restaurado após recarga. Bundle `index-Bl5BwAFz.js` confirmado. Console sem erros observados na prévia e produção.

Não houve nova partida manual completa até vitória nesta release. Efeitos no dano, nível 2, migração de campanha vitoriosa e regressões do encontro estão nos testes automatizados. Sem teste em aparelho físico, Safari/iOS, teclado virtual ou desempenho.

## Publicação e limites

Vercel production READY `dpl_AwXB19xvKXKC86BhAyVuactgN8yK`, código `475a256`.
URL https://novo-mundo-basilis.vercel.app.
Branch `release/0.7.0`; tag Git pendente, não criada pelas ferramentas disponíveis.

Sem lojas, saque, consumíveis, durabilidade, múltiplos espaços ou itens para aliados. Apenas viajante, um encontro e dois níveis. Marcos futuros remanejados no plano para 0.8 base/recrutamento, 0.9 campanha vertical e 0.10 polimento, evitando reutilizar números de entregas existentes. Cada pacote ainda exige escopo executável próprio.
