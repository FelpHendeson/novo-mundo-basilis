# Novo Mundo: Basilis

RPG tático original com exploração, recrutamento, classes e construção de comunidade planejados.

**Versão 0.10.0:** kit de adaptação opcional, arma compatível, poções/rações utilizáveis em batalha e exercício de mana com assistência. Save schema 6, compatível com schemas 1–5. [Relatório e limitações](docs/RELEASE_0.10.md).

## Desenvolvimento

Node.js 22.12+ (CI e Vercel: Node 24).

```bash
npm ci
npm run dev
npm test
npm run build
```

## Jogar

Na tela Última manhã, continue para a criação ou retome o checkpoint. Escolha nome, raça narrativa e classe; na chegada, consulte o Sistema ou escolha Agora não. Na clareira, vá para leste e converse com Lyra. Atravesse a abertura entre árvores para chegar às ruínas. Selecione um aliado, uma casa alcançável e uma técnica ou Esperar. Cancelar devolve a unidade à posição original. Derrote os dois saqueadores.

- Mouse/toque: tabuleiro e comandos do painel.
- Teclado: Tab/Enter nos formulários e comandos; clique no tabuleiro para Setas/WASD e Enter/Espaço; Escape cancela e E encerra o turno.
- Floresta custa 2 de movimento e reduz dano recebido em 2; rochas bloqueiam passagem. Unidades vivas bloqueiam ocupação.
- Cada aliado move e age uma vez por rodada. Energia recupera 2 após a fase inimiga, limitada ao máximo.

## Arquitetura

- `src/game/archetypes.ts`: catálogo de classes, raças narrativas, atributos e técnicas.
- `src/game/model.ts`: mapa, criação das unidades, alcance de movimento e dano.
- `src/game/narrative.ts`: nós da consulta, transição de chegada e ledger finito de eventos, sem recompensas.
- `src/game/journal.ts`: objetivos/descobertas derivados do estado existente e dos eventos consultados.
- `src/game/equipment.ts`: catálogo de acessórios e composição de atributos sem acumulação.
- `src/game/progression.ts`: XP, nível e ganhos iniciais de atributos por classe.
- `src/game/battle.ts`: regras, validações, fases e IA sem dependência de Phaser.
- `src/scenes`: apresentação e entrada do tabuleiro; ciclo de vida dos eventos e temporizador.
- `src/ui`: comandos HTML, dados de combate e acessibilidade dos menus.
- `tests`: regressões e simulações completas nas três classes.

## Confrontos laterais

Ataques aliados e inimigos apresentam os combatentes frente a frente, técnica, HP, energia, impacto e derrota. Use Acelerar para alternar 1×/3× ou Pular animação para retornar ao tabuleiro. Dano e custo são confirmados uma única vez; o próximo turno aguarda o retorno. Arte geométrica temporária, sem áudio nesta entrega.

## Limites

Um encontro de história com duas unidades aliadas e treino opcional com uma ou duas. Sem lojas, saque, base com múltiplos edifícios, outros recrutáveis, vantagens raciais ou personalização visual nesta entrega. O checkpoint local IndexedDB preserva perfil, posição e eventos; recarregar durante a luta retorna à exploração anterior. Limpar dados do navegador remove o progresso; não há sincronização entre dispositivos. A formação de até aproximadamente sete membros permanece como direção de design, não como funcionalidade implementada.

O motor é original e não utiliza ROMs comerciais. Veja `docs/GAME_DESIGN.md` e `docs/RELEASE_0.9.md`.

## Checkpoint e exploração

Use setas/WASD com foco no mapa, clique na casa vizinha ou use botões de direção. Interações ficam disponíveis por proximidade. Vitória libera a passagem e concede três suprimentos uma única vez. Retorne ao abrigo e descanse para concluir. O menu oferece Continuar; uma nova jornada exige marcar a substituição do checkpoint existente. Falha de armazenamento é exibida e permite continuar na sessão.

## Interface mobile 0.4.1

Retrato mantém o mapa acima do painel com rolagem própria. Paisagem usa mapa e comandos lado a lado. No combate, selecione um aliado e use os botões de cursor/Confirmar posição para mover sem tocar nas casas pequenas. Objetivo, terreno e histórico ficam em uma seção expansível. Layout verificado em simulação de 390×844, 844×390 e 320×568; toque físico/desempenho em aparelho ainda não validados.

## Ficha do viajante 0.5.0

Trocar classe na criação atualiza os seis atributos e as duas técnicas, incluindo potência, alcance e custo. Na exploração, abra **Ficha do viajante**; o painel de combate mostra ataque, magia e defesa junto dos recursos atuais. Raça permanece narrativa, sem vantagens ocultas. Os atributos iniciais das três classes foram preservados.

## Progressão 0.6.0

A primeira vitória nas ruínas concede 100 XP ao viajante e leva ao nível 2, limite atual do protótipo. Guerreiro: +3 HP/+1 energia/+1 ataque/+1 defesa; Mago: +2 HP/+3 energia/+1 magia/+1 defesa; Ladino: +2 HP/+1 energia/+1 ataque/+1 defesa. Técnicas e movimento não mudam. Ganhos valem ao iniciar a próxima batalha; Lyra e inimigos não evoluem neste pacote. Derrota e repetição não dão recompensa.

Campanhas usam schema 2. Checkpoints schema 1 migram automaticamente ao carregar, preservando posição e eventos. Se a passagem já estava liberada, a evolução é reconhecida retroativamente, sem repetir suprimentos. Níveis adicionais ainda não foram implementados.

## Equipamentos 0.7.0

Na exploração, abra **Inventário e acessórios**. O viajante começa com três itens e um espaço vazio: Braçadeira de treino (ataque +2), Foco simples (magia +2), Broche reforçado (defesa +2). Todos servem para qualquer classe. Compare atributos antes de equipar; trocar substitui o bônus anterior, remover restaura os valores da classe/nível. A ficha e a próxima batalha usam os mesmos números. Não é possível trocar durante a luta.

Schema 3 preserva inventário e item equipado. Schemas 1/2 migram automaticamente com os três itens e nenhum equipado, conservando progresso. Sem lojas, loot, consumíveis, durabilidade, múltiplos espaços ou equipamentos dos aliados nesta entrega. Nomes e bônus são provisórios de protótipo.

## Base e equipe 0.8.0

Após vencer nas ruínas, volte para perto do abrigo. Em **Base e equipe**, preparar a base custa os três suprimentos conquistados, uma única vez. Volte para perto de Lyra na trilha e convide-a; ela entra na equipe. No abrigo, alterne Lyra entre equipe e reserva e inicie o treino com a formação escolhida. O viajante sempre participa. **Sair do treino** fica disponível durante a fase aliada. Sem XP, suprimentos ou ferimentos persistentes nos treinos.

A primeira batalha mantém Lyra como acompanhante temporária. Recrutamento e base usam conteúdo provisório e não definem história canônica. Schema 4 migra schemas 1–3 sem gastar recursos/recrutar automaticamente, preservando XP, acessórios e eventos. Base aparece no mesmo mapa, com uma representação simples do abrigo. Sem edifícios adicionais, elenco amplo ou nova região nesta entrega.

## Introdução e Sistema 0.9.0

Nova jornada: Última manhã → criação → chegada. Pergunte Onde estou?/Quem é você? ou adie com Agora não. Na exploração, use Consultar o Sistema e Diário da jornada. Recarregar após criação e antes de sair da chegada permite continuar no nó de resposta salvo. Antes da criação não há personagem para salvar: voltar à tela inicial não cria checkpoint parcial.

Schema 5 migra schemas 1–4 para exploração, conservando posição, conquistas, equipe e acessórios; não força a introdução nem inventa respostas já consultadas. O diário não concede XP/recursos e o ledger narrativo não duplica eventos. Arte original provisória por código, sem áudio/spritesheets finais. Kit de adaptação, consumíveis, tutorial de mana e castelo são pacotes seguintes.
