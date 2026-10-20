# Basilis — 0.4.1 — Mobile

## Problema e entrega

Na 0.4.0 o painel ficava abaixo de um canvas que podia exceder a altura em paisagem. O jogador precisava rolar entre comandos e tabuleiro, com casas pequenas no retrato.

A 0.4.1 mantém mapa e painel em áreas próprias dentro da viewport. Retrato: mapa acima e painel rolável abaixo. Paisagem: mapa e painel lado a lado, ajustados à altura. Comandos móveis têm mínimo 48 px. O combate oferece botões de cursor e confirmação de posição, além da seleção direta. Casa/terreno aparecem no painel HTML. Objetivo/terreno/histórico são expansíveis. A atualização de foco preserva a rolagem do painel.

## Evidências

Commit de código `3921270`. 31 testes de regressão e build TypeScript/Vite passaram. Sem mudança nas regras, recompensas ou schema 1 de checkpoint.

Chrome com viewport simulada:
- 390×844: canvas 374×280,5 e painel 374×539,5 dentro da tela; todas as ações iniciais da exploração visíveis; botões 48 px; página sem overflow horizontal/vertical.
- 844×390: canvas ~455,5×341,7 e painel ~364,5×374, lado a lado dentro da viewport; página sem overflow; confirmação/cancelamento disponíveis.
- 320×568: página dentro dos limites; painel ~316,8 px com rolagem própria; seleção de aliado e Confirmar posição funcionaram.

Percurso manual na prévia: criação, movimento, conversa com Lyra, caminho às ruínas, entrada em combate, seleção de aliado, mover cursor para norte, confirmar posição e cancelar. Ao cancelar, a seleção retorna ao estado inicial. Confirmação da posição atual também exercitada em 320×568.

## Limitações

Teste de viewport e cliques, sem aparelho físico, toque real, teclado virtual, Safari/iOS ou medição de desempenho. Textos desenhados no canvas ainda diminuem com a escala; informações principais e controles são fornecidos pelo HTML. Não foi repetida uma partida inteira até vitória nesta correção de interface; regras cobertas pelas regressões anteriores. Tag Git pendente. Áudio/arte definitiva permanecem fora desta correção.

## Publicação

Vercel production READY: `dpl_BXyMBAVThDRteZygHg9dBmzzfUmG`, commit `3921270`, https://novo-mundo-basilis.vercel.app. No domínio público, CSS `index-DQd_7V5T.css` confere com o build; Continuar restaurou o checkpoint da 0.4.0. Em 390×844 foram medidos largura/altura de página 390×844, sem overflow; painel 374×539,5 dentro da viewport.
