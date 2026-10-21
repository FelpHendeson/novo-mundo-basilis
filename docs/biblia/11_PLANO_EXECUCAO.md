# Avaliação e plano de execução — revisão 1.0

20/10/2026. Fonte avaliada: `d18f741` e os 11 arquivos de `docs/biblia`. Referência implementada: jogo 0.8.0, código `2ec2139`. Este documento planeja entregas; não anuncia novas funcionalidades ou publicação do jogo.

**Registro de execução:** P09-01A entregue como 0.9.0 (`8ef54fa`); ver `../RELEASE_0.9.md` e inciso 15.10 do plano. P09-01B1 entregue como 0.10.0 (`feed9f6c`), kit/consumíveis e exercício guiado de mana. P09-01B2 entregue como 0.11.0 (`28c8564`), criatura observar/contornar/enfrentar; próximo P09-02. Ver `../RELEASE_0.10.md` e inciso 15.11. A avaliação abaixo preserva a referência histórica em 0.8.0.

## Avaliação

A bíblia transforma o protótipo em uma proposta de campanha consistente: Sistema universal, chegada terrestre, castelo reivindicável, habitantes autônomos, trabalho com custos e consequências regionais. A distinção entre habitante, trabalhador, combatente e campeão é útil e deve existir nos dados. Os roteiros SCN_001–015 dão sequência e contexto aos sistemas. Acessibilidade, escolhas adiáveis e ausência de espera obrigatória em tempo real são requisitos desde a implementação, não apenas do polimento.

O material é uma boa especificação de direção, mas ainda não é backlog totalmente executável. Valores econômicos, gatilhos de confiança, duração em turnos do mundo, efeito dos consumíveis, evolução de perícias e condições de derrota não letal precisam de contratos por entrega. Doze moradores, nove minigames e vários edifícios não cabem em um único incremento. Os próprios documentos já limitam o primeiro pacote de treino a dois minigames; preservar esse limite.

A atualização é documental: `src`, dependências e testes não mudaram desde a 0.8.0. Nesta avaliação, 98 testes e build TypeScript/Vite passaram. Não houve nova sessão de navegador nesta revisão de planejamento. Mantém-se o aviso de bundle Phaser acima de 500 kB, sem medição de desempenho.

## Autoridade e compatibilidade de documentos

- `docs/PLANO_PROJETO.md`: estado entregue, política de versões, evidências e linha do tempo.
- `docs/biblia/README.md` e documentos 02/06/07: direção do mundo, arte e pipeline, respeitando seus rótulos de cânone/proposta/mistério.
- Documento 03: roteiro proposto; falas, nomes e acontecimentos propostos não viram cânone por serem tecnicamente implementáveis.
- Este documento: ordem técnica, dependências e critérios de entrega. Não altera cânone, nomes ou mistérios.
- A antiga proposta de capítulos da seção 4 do plano histórico não deve competir com SCN_001–015: a nova bíblia é a referência de planejamento narrativo, mantendo o status de proposta onde indicado.
- Conflito criativo é registrado antes de alterar conteúdo. Escolhas técnicas reversíveis ficam a cargo do desenvolvimento.

## Lacunas que precisam ser resolvidas

| Tema | Risco atual | Tratamento |
|---|---|---|
| Numeração | 0.9.1–0.9.7 usadas como funcionalidades; `+fix` não representa PATCH | Usar IDs de pacotes P09-01–07; release funcional MINOR e correção PATCH; reservar inicialmente só 0.9.0 |
| Integração do legado | Abrigo/Lyra anteriores ao castelo e saves com base pronta | Manter clareira como acampamento inicial distinto do castelo; chegada ao castelo não apaga nem cobra novamente ações antigas |
| Estrutura da campanha | `campaign.ts` centraliza flags; exploração tem mapa fixo | Extrair estado de missões/eventos/diálogo em módulos coesos ao implementar; dados de áreas/saídas em catálogo, sem reescrita total |
| Personagens | Lyra é flag; 12 pessoas demandam identidade e disponibilidade | Introduzir IDs estáveis, relação e estado de participação antes de escalar moradores; manter migração da aliada existente |
| XP e treinos | Progressão termina em nível 2; treino livre atual não recompensa | Preservar treino livre sem XP; criar atividade curricular distinta, com proficiência/custos/limites definidos antes de recompensar |
| Recursos | Hoje há só suprimentos e acessórios fixos | Não converter suprimentos em madeira/comida por suposição; criar fontes, estoque e custos rastreáveis por recurso |
| Calendário | Não há relógio de mundo nem atividades delegadas | Introduzir turnos do mundo antes de produção/treino delegado/expiração; fechar navegador não avança tempo |
| Combate humano | Resolver atual encerra por eliminação | Definir sobrevivência/neutralização, ferimentos, diálogo e saída na derrota antes de implementar primeiro contato |
| Arte | Escalas alternativas 32×48/48×48 e 96/128 aparecem no guia | Validar uma família: tile 32×32, avatar 32×48 e lateral 128×128; confirmar visualmente antes de produzir catálogo |
| Adiar/recusar | Castelo e moradores são necessários ao arco, mas escolhas devem ser livres | Exploração deve continuar; gestão exige posse; adiar permite retorno, recusa de moradores tem rota alternativa antes do fechamento do arco |

## Sequência de entregas

Pacotes são unidades de planejamento, não versões PATCH. Só a próxima release está reservada: **0.9.0**. Demais números MINOR serão definidos ao fechar cada escopo; não reutilizar 0.10 para vários jogos diferentes. Nenhum pacote equivale a percentual de conclusão.

| Ordem | Pacote | Entrega verificável | Dependências / limite |
|---|---|---|---|
| 0 | Conciliação documental | Plano v1.9, referências e numeração alinhadas | Esta revisão; sem nova release do jogo |
| 1 | P09-01A — 0.9.0: introdução e eventos | Última manhã/criação/clareira, consulta ao Sistema, escolhas e continuação persistidas | SCN_001 e parte de SCN_002; sem kit funcional ou treino completo anunciado |
| 2 | P09-01B — adaptação | Kit com arma/poções/rações/bolsa, aceitação adiável e única; tutorial de mana assistido/dispensável | Fechar catálogo, efeitos e limites antes do código; SCN_002–003; evitar/observar/lutar com a criatura como ramo completo |
| 3 | P09-02 — castelo | Caminho conectado, inspeção, trono, reivindicar/adiar, nome e administração mínima | SCN_004–006; sem doze moradores ou construção completa; nome limitado e seguro |
| 4 | P09-03 — primeiro contato | Encontro com saída não letal, diálogo pós-combate, confiança, convite/recusa e recuperação na derrota | SCN_007–009; nome/falas do elenco continuam sujeitos à direção criativa |
| 5 | P09-04 — assentamento | Cadastro individual dos 12 candidatos, adesão variável, tarefas, fontes de comida/materiais e um reparo real | SCN_010–011; calendário, disponibilidade e custos antes de produção; grupo não teleporta para a base |
| 6 | P09-05 — formação e treinos | Mana e guarda de espada, modos assistidos e delegação, reparo simplificado, elegibilidade de campeão | SCN_012; apenas dois minigames completos; demais sete no backlog |
| 7 | P09-06 — mercado e contratos | Um ponto de comércio, espólios com usos, estoque/preços e primeiro contrato verificável | SCN_013–014; começar por um tipo de contrato completo, ampliar até 2–3 atividades no arco |
| 8 | P09-07 — fechamento do arco | Domínio nomeado, estrutura reparada, população efetiva, treino, comércio e missão, incluindo caminhos alternativos | SCN_015; QA de ponta a ponta e persistência; provar rota de recusa dos fugitivos sem bloqueio |
| 9 | Polimento e preparação 1.0 | Sprites/áudio/conteúdo final, performance, acessibilidade, proteção do save e campanha delimitada | Só anunciar 1.0 após fechar duração, elenco, mapas, encerramento e critérios de estabilidade |

## Referência histórica: escopo executável 0.9.0

**Objetivo:** uma nova jornada apresentar a chegada e o Sistema sem perder o protótipo existente. Entrega pequena e jogável, não uma reescrita de todos os sistemas.

1. Definir IDs de área/cena, nó de diálogo e evento; registrar eventos aplicados para impedir recompensa/efeito duplicado. Separar transição, condição e consequência da renderização Phaser.
2. Implementar SCN_001 → criador existente → SCN_002 na clareira; o jogador controla nome/classe/raça, sem personalidade ou fala obrigatória.
3. Incluir consulta opcional ao Sistema: onde estou, natureza da interface e agora não. Disponibilizar a consulta depois pelo menu; não inventar respostas sobre origem/reset.
4. Introduzir diário mínimo de objetivo/descoberta e transições reentrantes. Adiar conversa não bloqueia Lyra, exploração ou batalha existentes.
5. Migrar schema apenas conforme os campos finais. Saves antigos preservam personagem, XP, equipamento, base, reserva e posição; introdução aparece como consulta opcional, sem reiniciar ou teletransportar jornadas.
6. Preparar um corte visual original de chegada e diferenciação da interface do Sistema. Validar um avatar/tiles de referência em desktop/mobile antes de expandir arte; assets definitivos não bloqueiam a lógica, mas placeholders ficam identificados como tais.

**Aceite verificável:**
- Nova jornada percorre introdução/criação/clareira sem loop ou duplicação do personagem.
- Escolher agora não permite jogar; consulta posterior funciona e não reaplica eventos.
- Recarregar antes/depois de uma escolha retoma um ponto seguro e preserva decisões; não exige save no meio de uma animação.
- Todos os saves schema 1–4 continuam legíveis; base já paga e Lyra recrutada não regridem.
- Equipamentos, treino livre e encontro da 0.8 permanecem funcionais; múltiplas classes/raças cobertas.
- Build/testes, navegador e simulações 320×568, 390×844 e 844×390 passam, com limitações de aparelho físico explicitadas.
- Commit, deploy final, relatório e inciso da linha do tempo registrados. Reservar versão não significa entregar.

**Fora desta release:** kit anunciado como recebido sem itens funcionais; consumíveis; proficiência; novo minigame completo; castelo; moradores; comércio; curva de XP nova; vantagens raciais; sete aliados. O kit entra no pacote 2 após especificação, portanto o texto de SCN_002 será repartido por condição de conteúdo disponível.

## Regras transversais de implementação e QA

- Propostas de balanceamento entram em tabelas versionadas; não espalhar números por cenas. Nenhum aumento de recurso sem origem/reason/evento.
- Não transformar o livro de eventos em event sourcing completo: bastam IDs de efeitos aplicados e progresso persistido, com retenção definida; sem infraestrutura desnecessária.
- A evolução da UI deve revelar sistemas em contexto. População, edifícios, guildas e exercícios não abrem simultaneamente.
- Testes de migração usam fixtures reais dos schemas anteriores, com erro sem sobrescrita de save válido. Considerar exportação/importação antes de ampliar muito a campanha.
- Cada pacote valida caminho normal e alternativa: adiar, recusar, falhar, interromper, recarregar e repetir; ganho/custo aplicado uma vez.
- Integrar uma fatia de arte por vez: avatar, movimento, golpe lateral, impacto/derrota e terrenos claros/escuros. Arte em escala maior não substitui teste no menor viewport.
- Não ampliar a meta de sete aliados enquanto seleção, câmera, UI e duração de turno não forem testadas com três ou quatro unidades.
- Sem promessa de datas nesta avaliação. Estimar após fechar dados, mapa, conteúdo e aceite de cada pacote; não estimar o arco inteiro pelo número de arquivos.

## Decisões criativas antes do conteúdo correspondente

A direção nova já estabelece Sistema universal, mana acessível a combatentes físicos, castelo reivindicável/nomeável e domínio com habitantes autônomos. Não é necessário reconfirmar esses fundamentos. Antes de canonizar conteúdo proposto, delimitar: nomes e motivações do elenco/facções; posição do encontro de Lyra na rota do castelo; desfechos não letais e consequências; regras da reconstrução corporal e personalização visual; efeitos/valores do kit e progressão profissional.

Nenhuma dessas decisões impede começar a infraestrutura e a consulta do Sistema da 0.9.0. As respostas aos mistérios permanecem deliberadamente indefinidas.

## Execução 0.10.0/0.11.0 e recorte seguinte

P09-01B foi dividido em B1 (entregue: kit funcional, consumíveis, exercício acessível e persistência schema 6) e B2 (próximo: primeiro encontro com criatura, observar/evitar/enfrentar e consequências sem bloqueio). A 0.10.0 não conclui toda SCN_003. Valores provisórios e evidências em `../RELEASE_0.10.md`; próximos MINOR definidos ao fechar escopo, PATCH reservado a correções. Não antecipar castelo ou novas recompensas de XP.

P09-01B2 entregue em 21/10/2026: ver `../RELEASE_0.11.md` e inciso 15.12. Observação produz registro, sem anunciar progressão profissional ainda ausente. Próxima entrega P09-02 (castelo); inspeção, posse adiável e compatibilidade do abrigo devem ser especificadas antes de expandir população/economia.
