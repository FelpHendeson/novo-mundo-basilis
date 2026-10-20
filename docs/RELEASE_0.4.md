# Novo Mundo: Basilis — 0.4.0

## Escopo entregue

Primeiro ciclo de RPG: criação → exploração da Clareira da Outra Margem → conversa com Lyra → encontro nas ruínas → retorno com consequência → abrigo. Cenário 8×6, movimento por casas vizinhas, obstáculos, mouse/teclado/botões e interações por proximidade. Narrativa provisória.

Vitória libera a passagem e concede três suprimentos uma única vez. O abrigo registra a conclusão após a vitória. Derrota não concede recompensa; o jogador pode repetir ou voltar à exploração. O encontro tático e a apresentação lateral são os da 0.3.

## Salvamento

IndexedDB local, schema 1. Checkpoint contém personagem, posição exploratória, conversa, passagem, suprimentos e conclusão. Gravações enfileiradas usam snapshots e a leitura aguarda as gravações pendentes. Dados incompatíveis são rejeitados sem apagamento silencioso; o menu exige confirmação explícita para substituir uma jornada. Falhas de armazenamento são reportadas e não impedem a sessão.

Recarregar durante o combate retorna ao checkpoint exploratório, sem salvar a luta pela metade. Cada origem tem seu armazenamento: progresso da prévia não aparece automaticamente no domínio público. Sem sincronização entre dispositivos, exportação ou múltiplos slots. Limpar os dados do site remove o progresso.

## Código e validação

- `48e5d6d`: exploração, diálogo, integração de batalha e IndexedDB.
- `ceb15ff`: conclusão persistente e leitura após escritas pendentes; teve build rejeitado por importação ausente, sem publicação funcional.
- `4cb5e78`: correção da importação; código final com 31 testes e build aprovados.
- Deployment production: `dpl_5MR8FxFb357smuB9niNhK4oRcEBq`, associado a `4cb5e78`.
- URL: https://novo-mundo-basilis.vercel.app

31 testes: 22 regressões anteriores e nove novos testes de movimento, proximidade, recompensa única, validação de schema/perfil/posição, gravação/leitura IndexedDB com fake-indexeddb, snapshots/ordem de escritas, rejeição de gravação inválida, falha de armazenamento e conclusão no abrigo persistida. TypeScript strict e build Vite passaram no código final. Bundle ~343 KB gzip.

Na prévia `48e5d6d`, Chrome: criação, movimento, conversa, trajeto às ruínas, recarga e continuação restaurando posição/objetivo, entrada em batalha, vitória no turno 4, retorno à exploração com três suprimentos, passagem desabilitada para novo encontro e segunda recarga mantendo vitória/suprimentos. A conclusão persistente no abrigo foi acrescentada depois e validada por teste de domínio/IndexedDB, sem repetir manualmente a campanha inteira no novo build.

## Limitações

Um cenário e um encontro; sem base gerenciável, inventário, progressão, recrutamento persistente, áudio ou arte definitiva. Lyra é acompanhante provisória. Saves têm versão inicial; ainda não houve migração entre versões públicas de schema. Navegação em múltiplas abas simultâneas não tem coordenação de conflitos; utilizar uma aba por jornada. Mobile, falhas reais de quota e derrota seguida de retorno não tiveram teste manual específico nesta versão (regras de derrota/recompensa cobertas por testes). Tag Git ainda não criada por limitação das operações autenticadas disponíveis.

## Produção

Vercel production READY confirmado para `4cb5e78`. No domínio público, bundle `index-B_pFGUg3.js` conferido com o build final local; criação, movimento, conversa, checkpoint salvo, recarga e continuação restaurando posição/objetivo foram testados.
