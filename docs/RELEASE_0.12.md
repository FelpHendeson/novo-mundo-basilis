# Novo Mundo: Basilis 0.12.0 — O castelo

Entrega P09-02: trilha conectada da clareira (saída na casa 8,2) ao castelo abandonado. Portão parcialmente quebrado, pátio, depósito, muralha, registros, torre e dormitório podem ser inspecionados por proximidade; descobertas finitas ficam no diário. Voltar pela entrada preserva a posição anterior na clareira.

No trono, aproximar-se e sentar é uma ação voluntária. Ativar o núcleo não reivindica a posse: é possível adiar e continuar explorando, ou registrar um nome de 3–32 caracteres, com letras/números/espaços/apóstrofos/hífens. Espaços são normalizados e Unicode usa NFC; controles, markup e formatos invisíveis são rejeitados. Nome só pode ser confirmado uma vez. Reconhecimento do Sistema não equivale a reconhecimento por outras autoridades.

Administração mínima: após reivindicar, escolher prioridade entre portão, depósito e dormitório já inspecionados. A prioridade pode mudar, mas não executa obra nem consome materiais. Não há estoque de construção/trabalhadores concedido, nem população gerada. Lyra permanece aliada de expedição, sem conversão automática em moradora. O abrigo antigo é independente e seus custos/formação/conquistas não mudam. História, donos e origem do castelo continuam desconhecidos.

Arquitetura: catálogo de áreas/saída, regras de viagem, estado e decisões do castelo em módulos puros; área atual separada do fluxo da consulta ao Sistema. Continuar/recarregar e consultar o Sistema retornam à área e posição salvas. Schema 8 migra schemas 1–7 para clareira e castelo não visitado, sem conceder posse ou modificar recursos. Banco IndexedDB permanece versão 1.

## Validação inicial
185 testes em 12 arquivos passaram; 37 casos novos cobrem acesso e retorno, mapa caminhável e pontos alcançáveis, nomes, adiamento/posse, prioridade sem custo, migrações 1–7, IndexedDB e consulta do Sistema no castelo. TypeScript/Vite passaram localmente. QA remoto/navegador e publicação serão registrados após validação.

## Limites
Mapa/arte por código são provisórios. Torre inspecionada pela base; não há andares adicionais. Sem reconstrução material, moradores, calendário, economia, nova curva de XP ou reparo executável. O primeiro arco ainda não está completo.

## Próximo pacote
P09-03: primeiro contato com saída não letal, confiança, convite/recusa e derrota sem bloquear jornada. Conteúdo provisório do elenco precisa ser delimitado antes de implementar consequências; população e trabalho entram em P09-04.
