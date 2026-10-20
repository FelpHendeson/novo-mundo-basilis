# Novo Mundo: Basilis 0.10.0
## Escopo implementado — P09-01B1
Kit de adaptação opcional na consulta ao Sistema. Aceitar fornece uma bolsa, arma compatível automaticamente equipada (+1 ataque para Guerreiro/Ladino ou +1 magia para Mago), três poções e duas rações. Adiar não bloqueia exploração; reabrir não repõe estoque.
Poção restaura até 12 HP; ração restaura até 4 EN. Cada uso custa a ação do aliado selecionado; recursos cheios, estoque vazio ou fase incompatível não gastam itens. Sem ressurreição. Treino usa cópia isolada do estoque; repetição da batalha real mantém o estoque restante.
Exercício de mana opcional em três escolhas: perceber, conduzir, estabilizar. Erros dão orientação sem penalidade; assistência disponível em cada etapa, sem cronômetro. Etapas persistem. Não altera XP, proficiência nem atributos; não exige aceitar o kit.
Schema 6, migração dos schemas 1–5; diário e ficha refletem kit/progresso. Banco IndexedDB continua versão 1.

## Balanceamento provisório
Valores do kit são parâmetros técnicos desta fatia, sujeitos à direção criativa. Não definem economia final nem explicam mistérios do transporte. Bolsa sem peso/capacidade. Energia (EN) representa o recurso das técnicas físicas e mágicas.

## Limites e sequência
P09-01B foi dividido: esta fatia é B1; B2 implementará a primeira criatura com observar/evitar/enfrentar antes do castelo P09-02.
Ainda sem minigame de ritmo, proficiência, novas recompensas de XP ou personalização visual. O exercício atual é guiado por escolhas.
O checkpoint conserva consumo de itens, mas não salva o turno/HP de uma batalha em andamento: recarregar retorna ao checkpoint da exploração, mantendo os itens gastos. Em falha de armazenamento, o jogo informa que só a sessão foi atualizada.
## Validação e publicação
122 testes em 10 arquivos passaram na prévia final e na produção; TypeScript/Vite passaram com `npm test && npm run build`. Execução remota por indisponibilidade do ambiente local.
Prévia Mago: adiar kit, reabrir, receber, erro orientado sem progresso, etapa salva após recarga, assistência e conclusão. Batalha: magia 11, poção 11→21 HP e ração em Lyra 12→15 EN, ambas gastando ação. Recarga preservou estoque 2/1 e tutorial 3/3. Prévia final Guerreiro: arma +1, ficha ataque 9 e comparação de braçadeira 9→11. Sem erros de console observados.
320×568 e 390×844 no Sistema, 844×390 na batalha sem overflow horizontal; botões 48px em 320. Painéis rolam. Sem aparelho físico/Safari ou benchmark. Partida completa até vitória não repetida; base/treino/migrações cobertos em testes automatizados.
Produção READY `dpl_BZoAMTyKhXDfx6XpZAm1BPmp4xGA`, código `feed9f6c9a6e44ad27f9e976fc7d71ade01700ac`. URL: https://novo-mundo-basilis.vercel.app. Bundle `index-BctaIsyS.js` confirmado. Checkpoint anterior retomou Viajante/Humano/Guerreiro na posição 6,3; consulta mostrou kit disponível sem recebimento automático.
Commits: `c1a51f92c130959be8cf9c4df9d5ec79cbb187d4` e `feed9f6c9a6e44ad27f9e976fc7d71ade01700ac`; branch `release/0.10.0`. Tag pendente. Plano v2.1/inciso 15.11 no GitHub; cópia anexa do Projeto não sincronizada nesta sessão.
