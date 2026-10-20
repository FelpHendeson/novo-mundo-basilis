# Auditoria e versão 0.2

## Estado inicial

Protótipo 0.1: quatro testes de modelo; build compilava. Regras, IA, interface e eventos concentrados em BattleScene. Criação por prompt e botões desenhados em canvas. Sem teste prévio de interação documentado.

## Falhas corrigidas

- Cancelar após mover conservava a posição e permitia repetir movimento ilimitado. Agora o deslocamento é transacional até atacar/esperar.
- Última ação podia iniciar temporizador inimigo antes de verificar vitória. Resultado final agora precede mudança de turno e callbacks fora da fase são ignorados.
- Menus sem navegação por teclado e encerramento de turno disponível só pela tecla E. Comandos HTML acessíveis por Tab/Enter, mouse e toque.
- Técnicas podiam exceder a largura útil do canvas. Painel externo responsivo com quebra natural de texto.
- Sem HP/energia numéricos, previsão ou alvos destacados. Painel agora expõe esses dados e histórico das seis últimas mensagens.
- IA fixava alcance em 1 e não consumia energia. Agora usa as técnicas e as mesmas validações do jogador.
- Eventos de entrada não eram removidos explicitamente na troca/reinício de cena. Limpeza associada ao shutdown.
- Sem lockfile e CI: dependências agora reproduzíveis com npm ci e workflow de testes/build.

## Validação automatizada

14 testes Vitest: quatro de modelo e dez de regras. Cobrem movimento cancelado, ações fora de fase, rochas, energia, alvos inválidos, vitória sem turno residual, recuperação limitada, alcance inimigo, derrota e vitórias simuladas com Guerreiro/Mago/Ladino. TypeScript strict e build Vite passam.

## Limitações

Sprites e cenário geométricos provisórios. Um encontro, sem save, campanha, progressão, base, inventário, exploração, recrutamento, aparência ou atributos raciais. Não há contrataque automático, linha de visão ou permadeath definidos nesta versão. Não foram adicionadas regras novas para esses sistemas. Bundle Phaser ainda é grande (~338 KB gzip); carregamento poderá ser otimizado após expansão do jogo.

## Publicação e validação manual

Prévia Vercel READY no commit 313e2fd. Teste real no Chrome: criação com nome Felipe/raça Draconiano, seleção e movimento, cancelamento com retorno visual à origem, passagem de turnos, técnica acionada por Enter, ataque de 16 com custo 3, ataques de Lyra, vitória no turno 4 sem fase inimiga residual e repetição restaurando turno 1/HP/energia. Console sem erros nessa sessão. A tentativa de viewport 390×844 não alterou a largura efetiva do navegador (1351 px); validação mobile permanece pendente. Na largura desktop observada, não houve overflow horizontal. Durante a inspeção foi identificado e corrigido o deslocamento vertical do canvas ao mudar a altura do painel. Não houve teste em aparelho físico. CI adicionada, mas não foi observado workflow run no commit criado pela API.
