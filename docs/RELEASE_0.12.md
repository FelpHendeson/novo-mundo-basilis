# Novo Mundo: Basilis 0.12.0 — O castelo

Entrega P09-02: trilha conectada da clareira (saída na casa 8,2) ao castelo abandonado. Portão parcialmente quebrado, pátio, depósito, muralha, registros, torre e dormitório podem ser inspecionados por proximidade; descobertas finitas ficam no diário. Voltar pela entrada preserva a posição anterior na clareira.

No trono, aproximar-se e sentar é uma ação voluntária. Ativar o núcleo não reivindica a posse: é possível adiar e continuar explorando, ou registrar um nome de 3–32 caracteres, com letras/números/espaços/apóstrofos/hífens. Espaços são normalizados e Unicode usa NFC; controles, markup e formatos invisíveis são rejeitados. Nome só pode ser confirmado uma vez. Reconhecimento do Sistema não equivale a reconhecimento por outras autoridades.

Administração mínima: após reivindicar, escolher prioridade entre portão, depósito e dormitório já inspecionados. A prioridade pode mudar, mas não executa obra nem consome materiais. Não há estoque de construção/trabalhadores concedido, nem população gerada. Lyra permanece aliada de expedição, sem conversão automática em moradora. O abrigo antigo é independente e seus custos/formação/conquistas não mudam. História, donos e origem do castelo continuam desconhecidos.

Arquitetura: catálogo de áreas/saída, regras de viagem, estado e decisões do castelo em módulos puros; área atual separada do fluxo da consulta ao Sistema. Continuar/recarregar e consultar o Sistema retornam à área e posição salvas. Schema 8 migra schemas 1–7 para clareira e castelo não visitado, sem conceder posse ou modificar recursos. Banco IndexedDB permanece versão 1.

## Validação inicial
185 testes em 12 arquivos passaram; 37 casos novos cobrem acesso e retorno, mapa caminhável e pontos alcançáveis, nomes, adiamento/posse, prioridade sem custo, migrações 1–7, IndexedDB e consulta do Sistema no castelo. TypeScript/Vite passaram localmente. Prévia remota também passou com `npm test && npm run build`, árvore Git idêntica à local `359323a4b1b3d90a700ac09d5a8250d8ec09be8d`.
Navegador: Explorador/Guerreiro sem kit/tutorial/combate/Lyra percorreu rota e sete inspeções. Trono ativado, posse adiada, recarga devolveu posição4,2/4 descobertas sem nome. Markup rejeitado; rascunho preservado ao salvar; Enter registrou “São João” com normalização de espaços. Prioridade portão e troca para dormitório após inspeção, consulta ao Sistema com retorno à posição7,3, recarga preservando nome/7 descobertas/prioridade. Retorno à clareira na posição7,2 com XP0/suprimentos0. Console sem erros observados.
320×568 (formulário), 390×844 e 844×390 (administração) sem overflow horizontal. Ações >=48px em320; confirmação do formulário47px. Painel rola e mantém canvas visível. Sem aparelho físico/Safari/benchmark.
Código `223fe5fe2b54e0b1e8d4ac129ff00d8eb0cb036d`, branch `release/0.12.0`; tag Git pendente. Produção `dpl_CTBGwDRarFnusndLTYXRpjkMK7Jp`, https://novo-mundo-basilis.vercel.app. Evidência final do domínio abaixo.

## Limites
Mapa/arte por código são provisórios. Torre inspecionada pela base; não há andares adicionais. Sem reconstrução material, moradores, calendário, economia, nova curva de XP ou reparo executável. O primeiro arco ainda não está completo.

## Próximo pacote
P09-03: primeiro contato com saída não letal, confiança, convite/recusa e derrota sem bloquear jornada. Conteúdo provisório do elenco precisa ser delimitado antes de implementar consequências; população e trabalho entram em P09-04.

## Publicação validada
Produção READY; 185 testes/12 arquivos e build passaram no deployment de produção (build total19s; Vite7,83s). Bundle público `index-B35Qhoe5.js`. Checkpoint anterior Viajante/Humano/Guerreiro retomou posição6,3, XP0 e broche/defesa8. Entrada/retorno do castelo funcionaram sem posse automática; posição original restaurada após QA. Console sem erros observados.
Rascunho de nome não confirmado não faz parte do checkpoint; somente a ação de reivindicar registra o nome.
