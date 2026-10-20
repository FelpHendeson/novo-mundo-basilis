# Novo Mundo: Basilis

RPG tático original com exploração, recrutamento, classes e construção de comunidade planejados.

**Versão 0.2.0:** protótipo de criação simplificada e encontro tático nas Ruínas da Fronteira.

## Desenvolvimento

Node.js 22.12+ (CI e Vercel: Node 24).

```bash
npm ci
npm run dev
npm test
npm run build
```

## Jogar

Escolha nome, raça narrativa e classe; inicie a expedição com Lyra. Selecione um aliado, uma casa alcançável e uma técnica ou Esperar. Cancelar devolve a unidade à posição original. Derrote os dois saqueadores.

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

## Limites

Encontro único com duas unidades aliadas. Sem campanha persistente, inventário, base, exploração, recrutamento, vantagens raciais ou personalização visual nesta entrega. Recarregar reinicia a sessão. A formação de até aproximadamente sete membros permanece como direção de design, não como funcionalidade implementada.

O motor é original e não utiliza ROMs comerciais. Veja `docs/GAME_DESIGN.md` e `docs/RELEASE_0.2.md`.
