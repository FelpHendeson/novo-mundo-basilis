# Novo Mundo: Basilis

RPG tático original com exploração, recrutamento, classes e construção de comunidade planejados.

**Versão 0.4.0:** primeiro ciclo de exploração, diálogo, encontro tático, retorno e checkpoint.

## Desenvolvimento

Node.js 22.12+ (CI e Vercel: Node 24).

```bash
npm ci
npm run dev
npm test
npm run build
```

## Jogar

Escolha nome, raça narrativa e classe. Na clareira, vá para leste e converse com Lyra. Atravesse a abertura entre árvores para chegar às ruínas. Selecione um aliado, uma casa alcançável e uma técnica ou Esperar. Cancelar devolve a unidade à posição original. Derrote os dois saqueadores.

- Mouse/toque: tabuleiro e comandos do painel.
- Teclado: Tab/Enter nos formulários e comandos; clique no tabuleiro para Setas/WASD e Enter/Espaço; Escape cancela e E encerra o turno.
- Floresta custa 2 de movimento e reduz dano recebido em 2; rochas bloqueiam passagem. Unidades vivas bloqueiam ocupação.
- Cada aliado move e age uma vez por rodada. Energia recupera 2 após a fase inimiga, limitada ao máximo.

## Arquitetura

- `src/game/model.ts`: mapa, atributos, técnicas, alcance de movimento e dano.
- `src/game/battle.ts`: regras, validações, fases e IA sem dependência de Phaser.
- `src/scenes`: apresentação e entrada do tabuleiro; ciclo de vida dos eventos e temporizador.
- `src/ui`: comandos HTML, dados de combate e acessibilidade dos menus.
- `tests`: regressões e simulações completas nas três classes.

## Confrontos laterais

Ataques aliados e inimigos apresentam os combatentes frente a frente, técnica, HP, energia, impacto e derrota. Use Acelerar para alternar 1×/3× ou Pular animação para retornar ao tabuleiro. Dano e custo são confirmados uma única vez; o próximo turno aguarda o retorno. Arte geométrica temporária, sem áudio nesta entrega.

## Limites

Encontro único com duas unidades aliadas. Sem inventário, base gerenciável, recrutamento, vantagens raciais ou personalização visual nesta entrega. O checkpoint local IndexedDB preserva perfil, posição e eventos; recarregar durante a luta retorna à exploração anterior. Limpar dados do navegador remove o progresso; não há sincronização entre dispositivos. A formação de até aproximadamente sete membros permanece como direção de design, não como funcionalidade implementada.

O motor é original e não utiliza ROMs comerciais. Veja `docs/GAME_DESIGN.md` e `docs/RELEASE_0.4.md`.

## Checkpoint e exploração

Use setas/WASD com foco no mapa, clique na casa vizinha ou use botões de direção. Interações ficam disponíveis por proximidade. Vitória libera a passagem e concede três suprimentos uma única vez. Retorne ao abrigo e descanse para concluir. O menu oferece Continuar; uma nova jornada exige marcar a substituição do checkpoint existente. Falha de armazenamento é exibida e permite continuar na sessão.
