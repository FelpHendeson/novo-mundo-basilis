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
Validação e referências de publicação serão acrescentadas após o build remoto e QA no navegador.
