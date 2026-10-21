# Novo Mundo: Basilis — Plano de Projeto

**Tipo:** RPG tático 2D original, single-player  
**Franquia:** Novo Mundo | **Jogo:** Basilis  
**Stack:** Phaser 3, TypeScript, Vite, Vitest  
**Repositório:** https://github.com/FelpHendeson/novo-mundo-basilis  
**Publicação:** https://novo-mundo-basilis.vercel.app  
**Documento:** v2.2 — 21/10/2026
**Estado de referência:** 0.11.0 publicada — primeiro encontro opcional de criatura, código `28c8564`, produção READY.
**Fonte de referência:** este plano versionado no GitHub; a cópia nos arquivos do Projeto deve acompanhar cada revisão documental.

> Este documento é um plano vivo. Conteúdo narrativo e sistemas ainda não aprovados devem ser tratados como propostas, não como cânone.

**Atualização de direção:** bíblia de produção incorporada na revisão documental v1.9, baseada nos arquivos de `docs/biblia` em `d18f741`. A direção atual distingue cânone, propostas e mistérios. Novas especificações não alteram o estado entregue 0.8.0. [Avaliação e plano de execução](biblia/11_PLANO_EXECUCAO.md).

## 1. Visão do produto

Construir um RPG tático com combate em tabuleiro inspirado no ritmo estratégico de *Fire Emblem*, seleção deliberada de técnicas antes dos ataques (referência: *Pokémon*) e exploração de cenários com crescimento de uma comunidade/base (referência: *Digimon World*). **Arte, personagens, universo, regras de jogo e código serão originais.**

### Princípios
- **Estratégia legível:** alcance, terreno, recursos, dano previsto e consequências claros antes da confirmação.
- **Escolhas significativas:** técnicas, composição da equipe, relações, exploração e desenvolvimento da base.
- **Mundo autônomo:** facções e NPCs possuem objetivos próprios; não existem apenas em função do protagonista.
- **Progressão visível:** novos aliados, profissões, construções e regiões transformam o jogo.
- **Entrega vertical:** cada incremento deve ter uma pequena experiência completa, testável e jogável.

## 2. Direção criativa aprovada

- O protagonista é uma pessoa da Terra transportada para Basilis.
- O jogador personaliza **nome, aparência, raça e classe inicial**. Como alguém originário da Terra poderá assumir outra raça faz parte do mistério da travessia; explicação ainda não canonizada.
- Basilis é um mundo vasto e mágico, com raças, criaturas estranhas, povos, ruínas e territórios desconhecidos. A relação do mundo com possíveis resets permanece aberta.
- Os combates são táticos por posições; antes de atacar, o jogador **seleciona uma técnica**.
- Após confirmar um ataque, o jogo **transiciona para uma cena de combate cinematográfica lateral**: atacante e defensor frente a frente, animações, golpes/magias, feedback de dano e barras de vida. Retorna então ao tabuleiro.
- A exploração ocorre por cenários interligados e a base do jogador pode crescer com NPCs recrutados e recursos obtidos.
- Personagens podem ser recrutados por resgate, negociação ou consequência de conflitos; derrota não garante recrutamento.
- Diretriz inicial: **até 7 aliados ativos em batalha**, número revisável por testes de balanceamento. Elenco total recrutável maior.
- Plataforma inicial: **navegador/PC**, com estética retrô; não há obrigação de gerar ROM GBA. Mobile e desktop empacotado são expansões futuras, não requisitos atuais.

### Complementos da direção — bíblia de produção

Sistema universal aplicável aos seres do mundo, não privilégio do protagonista; mana também acessível a combatentes físicos. Castelo reivindicável/nomeável e domínio administrável com habitantes autônomos. Distinguir raça, classe, profissão, função administrativa e título. Origem do Sistema/transporte/reset permanece mistério. A bíblia propõe um arco detalhado e até 12 candidatos a moradores; nomes, falas, facções e balanceamento marcados como proposta não se tornam cânone automaticamente. Preservar clareira/abrigo/Lyra e progresso já entregue.

## 3. Ciclo principal de jogo

1. Preparação na base: grupo ativo, equipamentos, habilidades e objetivos.
2. Exploração de cenário: NPCs, recursos, caminhos, eventos e decisões.
3. Encontro tático: posicionamento, movimentação, técnica, alvo, prévia e resolução.
4. Cena cinematográfica: apresentação do resultado já determinado pelo motor de combate.
5. Consequências: ferimentos, experiência, recompensas, relações e recrutamentos.
6. Retorno/expansão da base: serviços, edificações, aliados e acesso a novos cenários.

## 4. Narrativa inicial — proposta sujeita a aprovação

Referência histórica da primeira proposta. Para novas entregas narrativas, consultar `docs/biblia/03_ROTEIRO_PRIMEIRO_ARCO.md` e seus status de proposta, sem apagar este registro.

**Prólogo: O Céu Desconhecido.** O jogador sofre uma ruptura inexplicável na Terra e desperta em uma região selvagem de Basilis. Precisa sobreviver e entender seu corpo e habilidades.

**Capítulo 1: Os Desamparados.** Encontro com pessoas em perigo numa rota deteriorada. Introduz combate em equipe, escolhas e potencial recrutamento.

**Capítulo 2: Um Lugar para Ficar.** Grupo identifica um posto de fronteira abandonado. Recuperar o local constitui a primeira base.

**Capítulo 3: As Primeiras Alianças.** Necessidades de segurança, ferramentas e alimentos levam a comunidades, mercadores e facções locais. O primeiro antagonista pode ser um grupo que domina rotas, com motivações próprias.

**Mistérios em aberto:** causa do transporte; existência de outros terráqueos; natureza do possível reset; história profunda do mundo; significado de “Basilis”.

## 5. Sistemas e regras-alvo

### 5.1 Combate tático
- Grid, terrenos e obstruções; deslocamento por custo de caminho, não apenas distância linear.
- Iniciativa/turnos com estado explícito das unidades e fases de IA.
- Ações: técnica, defesa, item, espera; ações especiais conforme classe.
- Técnicas com alcance, potência, custo, tipo, efeitos e condições de uso.
- Prévia antes de confirmar: alvo, custo, dano esperado, chance de acerto quando aplicável, riscos e contra-ataques possíveis.
- Resolução do combate na camada de regras, com **resultado imutável entregue à animação**. Não calcular dano duas vezes.
- Opções de aceleração e pulo da apresentação já na 0.3.0, sem alterar o resultado.
- Condições de vitória alternativas: eliminar inimigos, sobreviver, escapar, resgatar, ocupar objetivos.

### 5.2 Batalha cinematográfica — requisito essencial
**Sequência mínima:** seleção da técnica e do alvo → prévia → confirmação → transição de câmera/tela → combatentes em lados opostos → animação do ataque/impacto → atualização visual de PV e efeitos → eventual reação/contra-ataque → retorno ao mapa.

**Requisitos técnicos:**
- `BattleResolver` determina o evento de combate e seus resultados uma única vez, usando as mesmas regras da prévia.
- Cada ação confirmada recebe um identificador; o estado é atualizado exatamente uma vez antes da apresentação, que recebe retratos imutáveis do antes/depois. A apresentação nunca altera o domínio.
- Enquanto houver apresentação pendente, entrada tática e avanço de turno ficam bloqueados. Ao concluí-la, o controlador verifica resultado final e só então libera a próxima ação/fase.
- Ataques aliados e inimigos usam o mesmo fluxo. A IA apresenta uma ação por vez e aguarda a conclusão antes de continuar.
- Contra-ataques permanecem fora da 0.3.0 enquanto suas regras não forem aprovadas; apenas preparar o contrato para uma futura sequência de reações.
- `CombatPresentation` consome uma sequência de eventos: ação, animação, dano, estado final.
- A cena deve concluir corretamente mesmo com sprites temporários, animações aceleradas ou puladas.
- Morte, experiência e custo de recursos não podem ser aplicados duplicadamente.
- Animações e efeitos diferem por categoria de técnica: física, projétil, magia e suporte.

### 5.3 Personagem e evolução
- Criação de nome, visual, raça, classe inicial e confirmação do perfil.
- Raça, classe e técnicas são conceitos distintos; combinações não devem ser arbitrariamente bloqueadas.
- Atributos, experiência, progressão de habilidades, equipamento e especialização de classes.
- Classes tradicionais e “hype” (ex.: guerreiro, mago, ladino, clérigo; futuramente espadachim arcano, necromante, invocador), balanceadas por função.
- Magia/energia não ficam restritas exclusivamente a magos; sistema de poder detalhado será projetado e aprovado separadamente.

### 5.4 Exploração, base e recrutamento
- Cenários interligados, entradas/saídas, objetos, NPCs e diálogos.
- Base física explorável com novos serviços; membros não ativos podem permanecer nela.
- Gerenciamento de até sete aliados em campo, com reservas para substituição.
- Recrutamento orientado a decisões, missões e relações; personagens com agência própria.
- Recursos/economia inicialmente simples, expandindo conforme a campanha.

### 5.5 Persistência e acessibilidade
- Salvamento local mínimo versionado na 0.4.0, junto do primeiro progresso persistente: perfil, cenário/checkpoint e eventos concluídos. Restauração após recarregar é critério de aceite. Não exige salvar no meio da animação ou combate.
- Armazenamento preferencialmente IndexedDB, com validação do conteúdo e tratamento de save inválido; migrações acompanham a primeira alteração de schema. Fortalecimento e exportação/importação podem vir depois.
- Recomeçar cena e continuar campanha sem perder progresso.
- Entradas de mouse e teclado; suporte touch responsivo quando priorizado.
- Contraste, texto legível, menus navegáveis e indicação clara de ação válida/inválida.

## 6. Arquitetura técnica proposta

```text
src/
  engine/         # Phaser, renderização, áudio, input e transições
  game/
    domain/       # unidades, classes, técnicas, regras e eventos puros
    battle/       # estado tático, turnos, resolução e IA
    exploration/  # navegação e interações de cenários
    settlement/   # base, serviços e recrutamento
    progression/  # experiência, inventário e habilidades
    persistence/  # serialização e migrações de saves
  scenes/         # integração da lógica com cenas Phaser
  ui/             # HUD, menus, prévias e acessibilidade
  content/        # definições e dados de jogo
assets/            # pixel art, mapas, animações e áudio
scripts/           # validação de conteúdo, ferramentas de build
tests/             # testes unitários, integração e regressão
docs/              # design, ADRs, releases e planejamento
```

**Observação:** é uma arquitetura-alvo, não afirmação sobre as pastas já existentes. Preferir TypeScript estrito, módulos coesos, dados tipados/validados, regras independentes de Phaser e interfaces testáveis. Evitar abstração excessiva antes da necessidade.

## 7. Roadmap de entregas

| Marco | Objetivo | Entregável verificável | Status |
|---|---|---|---|
| 0.1 | Fundação da aplicação | Projeto Phaser/Vite e protótipo inicial | Histórico |
| 0.2 | Estabilização tática | Um encontro jogável, melhorias de seleção/turnos, testes e publicação | Entregue como 0.2.0; desktop validado |
| **0.3** | **Batalha cinematográfica** | **Tela lateral de confronto funcional, sincronizada com o motor, com animação e retorno ao mapa** | **Entregue; ver inciso 15.3** |
| 0.4 | Exploração e persistência mínima | Cenário, NPC, diálogo, encontro, consequência e restauração de checkpoint | Entregue; ver inciso 15.4 |
| 0.5.0 | Catálogo e ficha do viajante | Dados únicos de classe, prévia de atributos/técnicas, ficha na exploração e preservação dos checkpoints | Entregue |
| 0.6.0 | Experiência e nível | Primeira vitória concede 100 XP, nível 2 do viajante, ganhos fixos por classe e migração de checkpoint | Entregue |
| 0.7.0 | Inventário e acessórios | Três itens iniciais, um espaço, troca/remoção e comparação na exploração, efeitos no combate e migração de saves | Entregue |
| A definir | Efeitos raciais | Dependem de definição criativa e balanceamento próprios | Planejado |
| 0.8.0 | Primeira base e recrutamento | Preparar abrigo por 3 suprimentos, convidar Lyra por proximidade, alternar equipe/reserva e treinar sem recompensas | Entregue |
| 0.9.0 | Introdução e Sistema universal | SCN_001/parte de SCN_002, consulta opcional, eventos persistentes e preservação dos saves | Entregue; ver inciso 15.10 |
| MINOR posteriores a definir | Arco vertical por pacotes | Adaptação → castelo → contato → assentamento → treinos → mercado → fechamento; ver P09-01B–07 | Planejado |
| Após integração do arco | Polimento e conteúdo | UX, áudio, sprites, balanceamento, salvamento robusto; melhorias essenciais entram antes quando necessárias | Planejado |
| 1.0 | Primeira versão pública estável | Campanha inicial fechada, QA e documentação de release | Futuro |

Os números da tabela são marcos resumidos: 0.2 corresponde a 0.2.0, por exemplo. O marco 1.0.0 só será planejado para execução após definir duração pretendida, cenários/encontros, elenco mínimo e encerramento da campanha inicial; esses limites ainda não estão aprovados.

A ordem pode mudar se testes de usabilidade ou dependências técnicas justificarem. Não existem prazos contratados ou funcionalidades implícitas fora dos critérios de aceite.

## 8. Sprint prioritária — Versão 0.3

### Objetivo
Fazer cada ataque confirmado resultar em uma apresentação audiovisual clara e marcante, no estilo de confronto lateral, sem comprometer correção das regras ou velocidade do jogo.

### Pacotes de trabalho
1. Auditar o fluxo atual de dano, seleção, turnos e transições da 0.2.
2. Criar contrato de eventos/resultado de combate independente do Phaser.
3. Construir cena `CombatScene` com cenário, combatentes, HUD de PV e entrada/saída.
4. Implementar animações temporárias de ataque físico e mágico, impacto, dano e derrota.
5. Conectar escolha de técnica → prévia → resolver → apresentar → atualizar tabuleiro.
6. Tratar cancelamento antes da confirmação, duplo clique, troca de cena e ação indisponível. Serializar também os ataques da IA, sem perder a continuidade do turno.
7. Implementar opção de aceleração/pulo de apresentação sem pular aplicação de estado.
8. Testar regressões; publicar e validar na URL de produção.

### Critérios de aceite 0.3
- [x] Atacar com qualquer classe implementada, como aliado ou inimigo, abre a cena lateral.
- [x] Atacante e alvo aparecem frente a frente com identificação e PV.
- [x] Técnica escolhida determina o efeito/animação apresentado.
- [x] Dano e energia são aplicados **exatamente uma vez**, inclusive em ataque letal, cliques repetidos e pulo repetido.
- [x] Prévia e resultado usam as mesmas regras; o resultado recebido pela apresentação é imutável.
- [x] Último golpe apresenta seu resultado antes da tela de vitória/derrota; não inicia ação inimiga residual.
- [x] Cena retorna ao tabuleiro e conserva posições, turnos e estados corretos.
- [x] Ação inválida, fora do alcance ou sem energia não inicia batalha.
- [x] Acelerar/pular animação não altera o resultado.
- [ ] Interrupção abrupta/saída durante apresentação: limpeza implementada, validação manual específica pendente; reinício após vitória foi validado.
- [x] Retorno ao mapa restaura foco de teclado e seleção apropriados; comandos permanecem acessíveis.
- [x] Build de produção, testes de regras e verificação em navegador passam.
- [x] Deploy do Vercel fica `READY` e interface é testável por link público.

## 9. Qualidade e definição de pronto (DoD)

Uma funcionalidade só é considerada entregue quando:
- código, conteúdo e documentação pertinente foram versionados;
- `npm test` e `npm run build` passaram (ou impedimentos estão relatados);
- fluxos relevantes foram testados no navegador, incluindo ações e navegação, quando as ferramentas permitem;
- não há erro bloqueador conhecido no caminho principal;
- comportamento, limitações e riscos foram relatados sem confundir implementação com validação;
- versão/deploy podem ser identificados por commit e URL;
- o inciso da versão na linha do tempo foi atualizado, com evidências e limitações;
- testes ou validações impedidos permanecem explicitamente pendentes; não equivalem a aprovação. Código pronto sem evidência suficiente fica como implementado ou em validação.

## 10. Papéis e fluxo de trabalho

**Direção criativa / solicitante:** define prioridades, gosto artístico, lore canônica, critérios criativos e fornece feedback de jogo. Não é necessário programar, rodar comandos ou configurar ferramentas que o assistente consiga operar.

**Desenvolvimento / responsabilidade técnica (assistente):** analisar o repositório, propor soluções, escrever código e conteúdo, executar testes disponíveis, corrigir problemas, versionar, acompanhar deploy e comunicar resultados/limitações.

**Fluxo:** especificação curta → implementação → teste → commit/PR → deploy → avaliação criativa → backlog.

**Controle de versão:** GitHub, branch `main` estável; branches curtas/PRs quando a mudança justificar revisão. Commits claros; evitar colocar segredos no repositório.

**Publicação:** Vercel associado ao GitHub; produção deve apontar para versão validada. Não presumir que deploy `READY` garante ausência de bugs de gameplay.

## 11. Riscos e respostas

| Risco | Mitigação |
|---|---|
| Escopo de RPG cresce sem controle | Vertical slices e requisitos explícitos por versão |
| Regras acopladas à renderização | Domínio puro, eventos de combate, testes de regressão |
| Arte/animações atrasam mecânicas | Placeholders originais e pipeline de sprites substituíveis |
| Combate tático fica lento | Interface clara, animação acelerável, cenários pequenos no início |
| Muitas raças/classes tornam balanceamento impossível | Começar com poucos arquétipos e expandir via dados e simulações |
| Alterações quebram saves | Saves versionados e testes de migração |
| Deploy compila, mas jogo quebra no navegador | Verificação funcional pós-deploy e captura de erros |

## 12. Decisões pendentes

- Sistema de energia e magia: terminologia, fontes e limites.
- Regras definitivas de contra-ataque, evasão, crítico e efeitos de terreno.
- Estilo de pixel art, dimensões dos sprites e direção da paleta.
- Detalhes da reconstrução corporal ao chegar em Basilis e impacto da escolha de raça.
- Regras de morte/ferimentos permanentes e recrutamento de adversários.
- Número definitivo de slots de técnicas e de aliados por missão (7 é meta inicial).
- Arco canônico de abertura, personagens recorrentes, facções e antagonistas.

## 13. Próximo passo operacional

P09-01B2 entregue como 0.11.0: primeiro encontro de criatura com observar/contornar/enfrentar e saídas persistentes. Seguir com P09-02: caminho ao castelo, inspeção e reivindicação voluntária com nome validado. Fechar mapa, pontos interativos, estado do núcleo e relação com o abrigo/Lyra antes do código; adiar a posse não pode bloquear exploração. Não introduzir materiais, população ou renda sem origem. A próxima versão funcional será MINOR ao fechar o escopo; correções da 0.11.0 recebem PATCH e inciso próprio. O primeiro arco completo ainda não está entregue.

## 14. Política de versões e manutenção do plano

### 14.1 Versão do jogo

Usar três componentes: `MAJOR.MINOR.PATCH`. Antes da 1.0, `0.MINOR.0` identifica um marco funcional e `0.MINOR.PATCH` identifica correções/estabilizações desse marco. A compatibilidade de saves sempre é declarada, mesmo durante o desenvolvimento inicial.

- Exemplo hipotético: `0.2.0 → 0.2.1 → 0.2.2 → 0.3.0`. Cada correção publicada entre os marcos recebe sua própria versão e inciso na seção 15.
- Esses exemplos não representam entregas existentes. No momento desta revisão, não há 0.2.1 entregue.
- Commits de trabalho podem ser agrupados em uma versão. Nem todo commit vira release; toda versão entregue identifica seus commits.
- Correção publicada exige atualizar `package.json` e lockfile, registro de release e inciso correspondente. Uma mesma versão não pode identificar dois códigos de jogo diferentes publicados; usar o próximo PATCH para correção posterior.
- Uma revisão exclusivamente documental aumenta a versão deste plano, sem aumentar artificialmente a versão do jogo. O commit documental registra a alteração.
- Ao concluir uma release, criar referência Git `vX.Y.Z` para o commit entregue, depois de verificar que não existe. Tags de release não devem ser movidas ou sobrescritas. Tags ainda não verificadas não serão anunciadas como existentes.

### 14.2 Versão do documento

Este plano possui versão independente: v1.0 original, v1.1 nesta revisão. Incrementar a revisão ao alterar escopo, política, estado de entrega ou linha do tempo. Preservar o histórico no Git e na seção 16; não apagar entregas anteriores para acomodar mudanças de prioridade.

### 14.3 Rotina por entrega

1. Consultar a `main` e o plano atuais; registrar a versão-alvo e o problema/objetivo.
2. Abrir inciso cronológico com estado Planejado ou Em desenvolvimento. Reservar o número não significa publicar.
3. Implementar e registrar testes, build e validação funcional realmente executados.
4. Versionar e publicar; conferir commit, ambiente e URL. Marcar Entregue apenas conforme a definição de pronto, mantendo limitações explícitas.
5. Atualizar o inciso e a revisão do plano. Sincronizar a cópia dos arquivos do Projeto, preservando a identidade e histórico do mesmo arquivo.
6. Se surgir uma correção entre marcos, acrescentar um inciso PATCH no lugar cronológico correspondente e ajustar a prioridade sem apagar o marco seguinte.

**Estados:** Planejado → Em desenvolvimento → Em validação → Entregue. Bloqueado registra motivo e condição de desbloqueio. Cancelado/Substituído preserva o registro e aponta o motivo/sucessor. Regressões descobertas em release entregue geram novo inciso vinculado à versão afetada.

## 15. Linha do tempo do jogo e incisos por versão

Datas abaixo usam America/Sao_Paulo. Registros futuros entram cronologicamente entre os marcos quando necessário. Histórico registra fatos; roadmap registra intenção.

### 15.1 — 0.1.0 — Fundação — 20/10/2026

- **Estado:** histórico, substituída pela 0.2.0.
- **Entrega:** criação simplificada, grade, movimento, técnicas e fases básicas.
- **Referência:** `cd369bb` é a base observada antes da implementação 0.2.
- **Evidência:** quatro testes de modelo passaram e compilação foi confirmada na auditoria; não há validação funcional completa em navegador documentada para essa release.
- **Limitações:** interface e regras preliminares, falhas de cancelamento/fim de batalha posteriormente corrigidas na 0.2.0.

### 15.2 — 0.2.0 — Estabilização tática — 20/10/2026

- **Estado:** entregue; validação desktop concluída.
- **Commits:** `313e2fd` (regras/interface) e `b213e7a` (posição estável do tabuleiro e relatório). Código final desta entrega: `b213e7a`. Os dois commits fazem parte da mesma entrega 0.2.0; não constituem uma 0.2.1 retroativa.
- **Correções:** cancelamento desfaz movimento; fim de batalha antecede próximo turno; IA respeita alcance/energia; limpeza de entrada e temporizadores.
- **Funcionalidades:** painel HTML, HP/energia, prévia de dano, alvos válidos, histórico e comandos acessíveis nos menus.
- **Validação:** 14 testes passaram, TypeScript/build passaram; na prévia foi concluída vitória no turno 4 e reinício restaurou turno/HP/energia. Em produção foram conferidos criação, entrada, comandos e CSS final, com console sem erros observados.
- **Publicação:** Vercel production READY, deployment `dpl_3tRhmP5RtfHYXAJs3mhW6nPakBKV`, associado a `b213e7a`; URL https://novo-mundo-basilis.vercel.app (endereço mutável conforme novas versões).
- **Limitações:** encontro único, sem save/base/exploração/recrutamento; arte temporária. Mobile não validado e execução do workflow GitHub não confirmada. Mobile é expansão futura, não bloqueio deste marco PC.
- **Detalhamento:** `docs/RELEASE_0.2.md`. Tag `v0.2.0` não verificada nesta revisão.

### 15.3 — 0.3.0 — Batalha cinematográfica — 20/10/2026

- **Estado:** entregue; prévia validada e produção READY no código final.
- **Motivo:** apresentar cada ataque aliado/inimigo em confronto lateral sem duplicar efeitos.
- **Escopo:** resultado imutável, fase de apresentação, IA sequencial, CombatScene, HP/energia, efeitos físicos/projéteis/magia, aceleração 1×/3× e pulo.
- **Commits:** `bf8a18e` e `14064d7`; código final `14064d7`. Tag não criada; limitação registrada no relatório.
- **Validação:** 22 testes e build passaram. Na prévia: ataque inimigo, aceleração, ataques físicos/mágicos, pulo em golpe letal, vitória no turno 4 e reinício. Três classes e derrota cobertas por testes de domínio; nem todos os casos tiveram partida manual própria.
- **Publicação:** deployment production `dpl_7qRN3g7aVR3gKpgUKT94paCJsAZN`, código `14064d7`; Vercel READY confirmado, com domínio público associado e bundle final conferido no navegador. URL https://novo-mundo-basilis.vercel.app.
- **Limitações:** arte temporária, sem áudio; mobile e interrupção abrupta de cena não validados manualmente. Sem save nem mudanças de regras de contra-ataque/progressão.
- **Relatório:** `docs/RELEASE_0.3.md`.

### 15.4 — 0.4.0 — Exploração e checkpoint — 20/10/2026

- **Estado:** entregue; produção READY e checkpoint validado no domínio público.
- **Motivo:** conectar combate ao primeiro ciclo de exploração persistente.
- **Escopo:** clareira, movimento/obstáculos, diálogo por proximidade, entrada nas ruínas, retorno, recompensa única, abrigo e IndexedDB schema 1.
- **Commits:** `48e5d6d`, `ceb15ff`, `4cb5e78` (final). A falha de build em `ceb15ff` foi corrigida antes da entrega pública; esses commits compõem a mesma 0.4.0, sem PATCH retroativo.
- **Validação:** 31 testes e build finais passaram. Prévia: percurso até vitória, recarga antes/depois do combate e continuidade de posição/eventos/suprimentos. Conclusão persistente no abrigo testada no domínio/IndexedDB.
- **Publicação:** production `dpl_5MR8FxFb357smuB9niNhK4oRcEBq`, código `4cb5e78`; READY confirmado; criação, conversa, recarga e continuação conferidas no domínio público.
- **Compatibilidade:** primeiro save público, schema 1. Recarregar durante combate volta ao checkpoint de exploração. Progresso local por origem/navegador; sem coordenação multiaba ou sincronização.
- **Limitações:** um cenário/encontro, narrativa e arte provisórias; áudio/mobile e partida manual completa de derrota não validados. Tag Git pendente.
- **Relatório:** `docs/RELEASE_0.4.md`.

### 15.5 — 0.4.1 — Adaptação mobile — 20/10/2026

- **Estado:** entregue; produção READY, continuação de checkpoint e retrato conferidos no domínio público.
- **Problema na 0.4.0:** canvas e comandos exigiam alternância de rolagem; em paisagem o mapa excedia a altura; casas pequenas dificultavam seleção.
- **Escopo:** mapa e painel em áreas independentes, paisagem lado a lado, comandos compactos, botões de cursor/confirmar posição no combate, objetivo/terreno/histórico expansíveis e foco sem deslocar a página.
- **Commit de código:** `3921270`. Release PATCH de interface, sem alteração das regras ou do schema 1 de checkpoint.
- **Validação:** 31 testes e build passaram. Prévia simulada em 390×844, 844×390 e 320×568, sem overflow da página; botões móveis com mínimo 48 px. Percurso da exploração até combate, cursor, confirmação e cancelamento exercitados. Em 320×568 o painel rola mantendo o mapa visível.
- **Limitações:** simulação de viewport, sem comprovar toque físico, teclado virtual, Safari/iOS ou desempenho em aparelho. Rótulos dentro do canvas ainda escalam; dados e ações principais estão no painel HTML.
- **Publicação:** Vercel READY no deployment `dpl_BXyMBAVThDRteZygHg9dBmzzfUmG`, código `3921270`; URL https://novo-mundo-basilis.vercel.app.
- **Relatório:** `docs/RELEASE_0.4.1.md`. Tag Git pendente.

### 15.6 — 0.5.0 — Catálogo e ficha do viajante — 20/10/2026

- **Estado:** entregue; prévia e produção validadas.
- **Escopo:** catálogo único de classes, atributos e técnicas; prévia dinâmica na criação, ficha expansível na exploração e ataque/magia/defesa no combate.
- **Preservação:** números, técnicas, regras de combate e raças narrativas inalterados. Checkpoint schema 1 compatível; nenhuma migração necessária.
- **Validação automatizada:** 53 testes e build TypeScript/Vite passaram. Inclui 18 combinações de perfil, conservação dos atributos e isolamento das instâncias.
- **Fora do pacote:** XP/nível, equipamentos, bônus raciais, aparência, áudio e arte final. Esses itens não são anunciados como entregues.
- **Código:** `f41bdff`; branch `release/0.5.0`. Tag Git pendente.
- **Validação manual:** troca Guerreiro/Mago/Ladino e raça na criação; Elfo/Ladino salvo, recarregado e levado à batalha com atributos/técnicas coincidentes. Ficha mantida aberta após salvar. Simulações 390×844, 320×568 e 844×390 sem overflow horizontal, painel rolável e mapa visível. Console sem erros observados nesse percurso; não foi repetida partida manual completa até vitória nesta release.
- **Publicação:** production READY `dpl_C1diFS5NgEP7dRB6RxreYrE71ocu`, código `f41bdff`, https://novo-mundo-basilis.vercel.app. No domínio principal, checkpoint anterior Humano/Guerreiro continuou e a ficha foi conferida; bundle `index--cdtLclw.js` confirmado.
- **Limitações:** sem aparelho físico/Safari ou medição de desempenho; bundle Phaser permanece acima do aviso de 500 kB. Relatório `docs/RELEASE_0.5.md`.

### 15.7 — 0.6.0 — Experiência e nível — 20/10/2026

- **Estado:** entregue; vitória na prévia e continuação do checkpoint antigo em produção conferidas.
- **Escopo:** primeira vitória concede 100 XP e nível 2 ao viajante; ganhos fixos por classe visíveis na ficha; repetição e derrota não dão XP. Movimento, técnicas, raças e NPCs não evoluem neste pacote.
- **Balanceamento inicial do protótipo:** Guerreiro +3 HP/+1 energia/+1 ataque/+1 defesa; Mago +2 HP/+3 energia/+1 magia/+1 defesa; Ladino +2 HP/+1 energia/+1 ataque/+1 defesa. Limite temporário nível 2/100 XP.
- **Compatibilidade:** formato de campanha schema 2; schema 1 migra em memória ao carregar e é regravado ao salvar. Passagem antiga já liberada concede 100 XP retroativamente, sem duplicar suprimentos. Banco IndexedDB mantém versão 1, pois não altera seus stores.
- **Código:** `5f1511d404cb510f09557c3db70f23395d427693`, branch `release/0.6.0`. Tag Git pendente.
- **Validação:** 61 testes e build passaram. Prévia: vitória do Guerreiro no turno 3, recompensa e salvamento; repetir iniciou nível 2 com 31 HP/9 energia/9 ataque/7 defesa; recarga conservou 100 XP e três suprimentos. Lyra permaneceu com atributos originais. Console sem erros observados.
- **Mobile:** percurso de batalha em 844×390; ficha também conferida em 320×568 e 390×844, sem overflow horizontal. Não valida toque físico/Safari/desempenho.
- **Publicação:** production READY `dpl_531VDcA7Y5j2ASqDDYmyMcKjbT3z`, código `5f1511d`, https://novo-mundo-basilis.vercel.app. No domínio, checkpoint anterior Humano/Guerreiro antes da vitória continuou com perfil/posição/eventos preservados e XP 0. Bundle `index-DV0RuhLU.js` confirmado, console sem erros observados.
- **Relatório:** `docs/RELEASE_0.6.md`. Migração de checkpoint antigo já vitorioso coberta em IndexedDB nos testes, sem uma segunda partida manual específica em produção.
- **Limitações:** apenas viajante, um encontro e dois níveis; sem equipamento, novas técnicas, bônus raciais ou progressão de Lyra. Números provisórios de balanceamento, sem estabelecer lore nova.

### 15.8 — 0.7.0 — Inventário e acessórios — 20/10/2026

- **Estado:** entregue; prévia e domínio público validados.
- **Escopo:** inventário inicial com Braçadeira de treino (ataque +2), Foco simples (magia +2) e Broche reforçado (defesa +2). Um espaço de acessório, válido para qualquer classe. Trocar/remover somente na exploração; comparação de ataque/magia/defesa e ficha usam os mesmos atributos da batalha.
- **Balanceamento provisório:** nomes genéricos, sem lore nova. Itens iniciais disponíveis sem loja/saque; nenhum começa equipado, preservando os atributos anteriores até a escolha do jogador. Apenas viajante recebe bônus.
- **Compatibilidade:** schema 3; schemas 1/2 recebem inventário inicial e acessório vazio, preservando XP e demais eventos. Valida posse, IDs e duplicatas. Banco IndexedDB mantém versão 1/stores.
- **Código:** `475a25626ca337220b0aa268cafeaae192612f81`, branch `release/0.7.0`. Tag Git pendente.
- **Validação:** 87 testes e build passaram. Prévia: equipar os três itens, trocar/remover sem acumular, recarga/continuação com braçadeira e batalha com ataque 10; Lyra e outros atributos inalterados. Console sem erros observados.
- **Mobile:** 390×844, 320×568 e 844×390 sem overflow horizontal; botões de itens 60 px e remoção 48 px na medida de 390×844. Troca também exercitada em paisagem.
- **Produção:** checkpoint anterior continuou preservando perfil/posição/eventos e recebeu inventário vazio de equipamento; broche equipado elevou defesa 6→8 e persistiu após recarga. Bundle `index-Bl5BwAFz.js`, console sem erros observados.
- **Publicação:** production READY `dpl_AwXB19xvKXKC86BhAyVuactgN8yK`, código `475a256`, https://novo-mundo-basilis.vercel.app. Relatório `docs/RELEASE_0.7.md`.
- **Limites da validação:** sem aparelho físico/Safari, medição de desempenho ou nova partida manual completa até vitória. Efeitos no dano, nível 2 e migração após vitória cobertos automaticamente; bundle Phaser ainda gera aviso de tamanho.
- **Limitações:** sem armas/armaduras em múltiplos espaços, equipamento de aliados, durabilidade, consumo, loot ou loja. Nível máximo continua 2.

### 15.9 — 0.8.0 — Primeira base e recrutamento — 20/10/2026

- **Estado:** entregue; ciclo completo verificado na prévia e continuidade do checkpoint conferida em produção.
- **Escopo:** após vitória, preparar abrigo junto ao acampamento custa 3 suprimentos uma vez; convidar Lyra perto da trilha exige base pronta e diálogo anterior. Convite único a inclui na equipe. No abrigo, alternar equipe/reserva e iniciar treino com a formação escolhida, sem recompensas ou ferimentos persistentes; viajante sempre presente. Primeira batalha mantém acompanhante temporária.
- **Apresentação:** painel Base e equipe, objetivos orientando as etapas e representação simples do abrigo preparado no mapa existente. Sem nova região, prédios múltiplos ou história canônica de Lyra.
- **Compatibilidade:** schema 4, migração de schemas 1–3 conserva perfil, equipamentos, XP, recursos e eventos; base começa não preparada, sem consumo/recrutamento automático. IndexedDB mantém versão 1.
- **Código:** `9bd2007` (implementação) e `2ec2139` (mensagens de retorno/descanso alinhadas à base). Código final `2ec21397bb9440704cd3b3d5238ed5086386c6c6`; branch `release/0.8.0`. Ambos compõem a mesma entrega antes da publicação final, sem PATCH retroativo. Tag Git pendente.
- **Validação:** 98 testes passaram e build final passou. Prévia `9bd2007`: criação, diálogo, vitória no turno 3, retorno, preparação por 3 suprimentos, convite por proximidade, reserva, treino solo, saída, equipe, treino em dupla, saída e recarga. Base/equipe preservadas com XP 100 e suprimentos 0. Ajuste posterior restrito a mensagens compilado; produção final conferida sem repetir a partida completa.
- **Mobile:** percurso em 844×390, painel expandido também em 390×844 e 320×568 sem overflow horizontal; botões de base medidos em 48 px em 390×844. Sem aparelho físico/Safari/desempenho.
- **Publicação:** production READY `dpl_C3ebce8vB6GwYEwRwuSv5PSMELK7`, código `2ec2139`, https://novo-mundo-basilis.vercel.app. Checkpoint anterior continuou preservando perfil, posição/eventos e broche; base não preparada/sem convite automático. Bundle `index-BdajkgyD.js` conferido e console sem erros de aplicação observados.
- **Relatório:** `docs/RELEASE_0.8.md`. Também corrigida rejeição de inventário esparso corrompido; falhas transitórias da automação de clique foram recuperadas com inspeção visual, não contabilizadas como aprovação de etapas não executadas.
- **Limitações:** uma aliada, dois membros ativos no máximo, treino no tabuleiro existente, sem slots de 7 membros, novas missões, edifícios adicionais ou equipamento/progressão de Lyra.

### 15.10 — 0.9.0 — Introdução, Sistema e diário — 20/10/2026

- **Estado:** entregue; prévia e domínio público verificados.
- **Objetivo:** chegada/Sistema em contexto e eventos persistentes, mantendo criação, clareira, Lyra, base, treino e saves existentes.
- **Escopo/aceite:** documento `docs/biblia/11_PLANO_EXECUCAO.md`, seção Próxima release; SCN_001 e parte de SCN_002. Adiar tutorial não bloqueia jogo; consulta posterior e reentrada seguras; legado não reinicia/teletransporta personagens.
- **Fora do pacote:** kit funcional, minigame completo, castelo, moradores, comércio e nova curva de XP. Demais pacotes ainda sem número de release reservado.
- **Implementação:** última manhã → criação → chegada; perguntas onde/identidade, adiamento e consulta posterior; diário derivado das descobertas e conquistas; ledger finito de eventos narrativos sem repetição.
- **Compatibilidade:** schema 5, migração de schemas 1–4 preserva estado existente e continua na exploração sem chegada obrigatória. Na nova jornada, checkpoint após criação retoma a chegada/resposta até sair; em exploração, mantém posição/eventos. Banco IndexedDB permanece versão 1.
- **Código:** `8ef54fa975a66d2a5a921bb335e662ebdc124315`, branch `release/0.9.0`. Tag Git pendente.
- **Validação:** 109 testes e build passaram. Prévia: Última manhã → criação Ari/Mago → resposta identidade → recarga/continuação na mesma resposta; adiar, explorar, diário, reabrir Sistema, Onde estou via Enter, continuar preservando posição, diálogo de Lyra e entrada na batalha. Proteção de substituição conferida sem apagar Ari. Console sem erros observados.
- **Mobile:** 390×844, 320×568 e 844×390 sem overflow horizontal do Sistema; botões 48 px. Em 320×568 painel rola. Arte por código original provisória: refeição, tiles 32×32/avatar 32×48; legenda em canvas reduzida em mobile, conteúdo funcional no HTML. Sem aparelho físico, Safari, áudio/spritesheets ou medição de desempenho.
- **Publicação:** production READY `dpl_HLmksZmgYE4wDEAuqUxLyFmbp28w`, código `8ef54fa`, https://novo-mundo-basilis.vercel.app. Checkpoint anterior Humano/Guerreiro retomou posição/eventos/broche, diário legado, consulta e retorno preservados. Bundle `index-Cj8o2Hk0.js` confirmado, console sem erros observados.
- **Limites da validação:** base já preparada/reserva migrada coberta nas fixtures; não foi repetida partida manual até vitória nesta release. Antes da confirmação da criação, não há checkpoint de personagem. Relatório `docs/RELEASE_0.9.md`.
- **Numeração:** P09-01–07 são IDs de pacotes, não PATCH; mudanças funcionais recebem MINOR, correções PATCH. `+fix` não identifica correção incremental na política do projeto.

### 15.11 — 0.10.0 — Kit e exercício de mana — 20/10/2026

- **Estado:** entregue; P09-01B1, primeira fatia da adaptação.
- **Implementação:** aceitar/adiar kit sem duplicação; bolsa e arma compatível (+1 ataque Guerreiro/Ladino ou +1 magia Mago); três poções (+12 HP), duas rações (+4 EN), uso limitado ao máximo do recurso e à ação do aliado selecionado. Treino usa estoque isolado. Ficha, comparação de acessórios e diário atualizados.
- **Tutorial:** perceber/conduzir/estabilizar em três escolhas sem cronômetro, erro sem penalidade e assistência opcional. Adiar conserva etapa. Sem XP/proficiência/bônus permanente ou exclusividade do protagonista.
- **Compatibilidade:** schema 6, migração de schemas 1–5; banco IndexedDB versão 1. Estoque e tutorial parciais persistem. Reabrir consulta ou repetir batalha não repõe itens.
- **Commits:** `c1a51f92c130959be8cf9c4df9d5ec79cbb187d4` (funcionalidades/testes), `feed9f6c9a6e44ad27f9e976fc7d71ade01700ac` (comparação de acessórios); branch `release/0.10.0`. Tag Git pendente.
- **Validação:** 122 testes/10 arquivos, TypeScript e Vite passaram na prévia final e no deployment de produção, com `npm test && npm run build`. Execução remota porque o ambiente local estava indisponível.
- **Navegador:** nova jornada Mago, adiar/reabrir/aceitar, erro orientado, etapa parcial após recarga, assistência e conclusão; +1 magia no combate; poção 11→21 HP e ação gasta; ração em Lyra 12→15 EN e ação gasta; recarga conserva 2 poções/1 ração, tutorial 3/3 e kit sem reposição. Prévia final Guerreiro: ficha e comparação mostram ataque 9, troca prevista 9→11. Console sem erros observados.
- **Mobile:** Sistema em 320×568/390×844 e batalha 844×390 sem overflow horizontal; botões 48 px em 320. Painel com rolagem; legendas em canvas permanecem pequenas. Sem aparelho físico/Safari/desempenho medido.
- **Publicação:** production READY `dpl_BZoAMTyKhXDfx6XpZAm1BPmp4xGA`, commit `feed9f6c`, https://novo-mundo-basilis.vercel.app; bundle `index-BctaIsyS.js`. Checkpoint anterior retomou Viajante/Humano/Guerreiro, posição 6,3, sem prêmio automático do kit.
- **Limites:** primeira criatura observar/evitar/enfrentar fica em P09-01B2. Bolsa sem limite de peso; exercício guiado, não minigame de ritmo. Recarga não retoma turno/HP, mas conserva itens gastos. Base/reserva e migrações cobertas por testes; partida manual completa até vitória não repetida nesta release. Sem nova curva de XP, castelo ou moradores.
- **Documentação:** relatório `docs/RELEASE_0.10.md`. Plano canônico no GitHub atualizado; cópia anexa do Projeto não sincronizada nesta sessão por indisponibilidade do ambiente de arquivos.

### 15.12 — 0.11.0 — Primeiro encontro de criatura — 21/10/2026

- **Estado:** entregue; P09-01B2. Complementa kit/exercício de mana; não anuncia todo minigame de percepção/proficiência de SCN_003 como completo.
- **Escopo:** toca opcional na casa 4,2 da clareira. Observar registra comportamento sem combate; voltar permite decidir depois; contornar encerra pacificamente. Enfrentar abre combate individual; vitória afugenta, derrota/retirada encerram em segurança. Resultados terminais sem replay. Sem XP/saque, morte obrigatória ou bloqueio do encontro antigo.
- **Balanceamento provisório:** criatura 20 HP/ataque 4/defesa 2/movimento 3; Garrada potência 5, alcance 1, custo 0. Espécie não identificada, silhueta quadrúpede original provisória. Arena reutiliza tabuleiro existente; não é mapa definitivo da toca.
- **Arquitetura:** catálogo tipado de missões; resultado da campanha por missão; técnicas próprias e estado de contato independente. Cinemética permanece projeção imutável do resultado. Ficha/recompensas/base das ruínas preservadas.
- **Compatibilidade:** schema 7, migração 1–6, banco IndexedDB versão 1. Saves antigos recebem encontro pendente sem movimento/recompensa automática. Recarga durante confronto retorna à exploração; interação na toca permite reiniciar com HP/EN restaurados ou encerrar recuando. Consumo salvo não é reposto.
- **Código:** `28c856496954bf2698795738271e4fb48b8f9d84`, branch `release/0.11.0`. Tag Git pendente; relatório `docs/RELEASE_0.11.md`.
- **Testes:** 148 testes/11 arquivos e TypeScript/Vite passaram localmente e na prévia remota. 26 casos novos cobrem escolhas, resultado único, migração 1–6, IndexedDB, interrupção, três classes sem kit/tutorial, derrota, eventos de cinemática e isolamento da recompensa das ruínas.
- **Navegador:** Observador/Guerreiro sem kit → toca → observar via Enter → sair/recarregar → observação preservada → contornar → reentrada somente leitura. Combatente/Guerreiro sem kit → combate → recarga → reiniciar interrompido → dois Cortes, uma Garrada, vitória com HP25/28 → exploração com 0 XP/0 suprimentos e diário. Retirada/Guerreiro → recuar do combate → rever resultado sem nova luta. Sem erros de console observados.
- **Mobile:** encontro em 320×568, 390×844 e 844×390 sem overflow horizontal; botões 48px em 320. Combate validado por botões em 390×844; animação pulada pelos controles. Sem aparelho físico/Safari/desempenho medido; legendas em canvas pequenas no mobile.
- **Publicação:** production READY `dpl_Es7Hb2BnLpwC2YkE4Xn7K4yTnYCn`, código `28c8564`, https://novo-mundo-basilis.vercel.app. Bundle público `index-v0g4BxER.js`; checkpoint anterior retomou posição 6,3, XP0 e broche/defesa8. Inspeção abriu sem efeitos automáticos; posição restaurada após QA.
- **Limites:** observação apenas no diário, sem progressão de competência; nenhuma espécie/mistério canonizado. Sem turno/HP persistente, novo mapa definitivo, castelo/população ou sete aliados. Derrota e regressões da base/treino cobertas em testes; partida completa das ruínas não repetida manualmente. Histórico da 0.10.0 preservado; cópia anexa do plano sincronizada nesta revisão.

### Modelo de inciso para próximas versões

- **Versão, título, data e estado.**
- **Motivo:** problema, versão afetada e objetivo.
- **Escopo entregue:** correções/funcionalidades reais, separado do que foi adiado.
- **Referências:** commits, tag verificada e relatório/issue quando existir.
- **Validação:** testes/build, fluxos exercitados e resultados.
- **Publicação:** ambiente, deployment/commit e URL; se não publicado, declarar.
- **Compatibilidade e limitações:** saves, regressões abertas e pendências.

## 16. Histórico de revisões do plano

| Revisão | Data | Alteração |
|---|---|---|
| v1.0 | 20/10/2026 | Plano original, direção criativa, roadmap e prioridade da batalha lateral. |
| v1.1 | 20/10/2026 | Linha do tempo e incisos por versão; política PATCH e revisão documental independente; evidências da 0.2.0; aceite da 0.3 ampliado para IA/ciclo de vida; save mínimo antecipado e limites de marcos explicitados. |

| v1.2 | 20/10/2026 | Implementação 0.3.0, evidências automatizadas/manuais, limitações e próximo marco 0.4.0. |
| v1.3 | 20/10/2026 | Escopo e inciso 0.4.0, exploração/checkpoints, testes e limitações de persistência. |
| v1.4 | 20/10/2026 | Inciso PATCH 0.4.1 e evidências de simulação mobile em retrato/paisagem. |
| v1.5 | 20/10/2026 | Escopo 0.5.0 delimitado ao catálogo e ficha; XP/equipamentos separados e efeitos raciais mantidos pendentes. |
| v1.6 | 20/10/2026 | Escopo 0.6.0, progressão inicial de dois níveis, recompensa única e migração para schema 2. |
| v1.7 | 20/10/2026 | Inventário/acessórios 0.7.0 e schema 3; marcos futuros renumerados para evitar colisão com entregas de progressão/equipamentos. |
| v1.8 | 20/10/2026 | Primeiro ciclo de base/recrutamento 0.8.0, formação e treino sem recompensa, migração schema 4. |
| v1.9 | 20/10/2026 | Avaliação dos 11 documentos novos da bíblia, escopo 0.9.0, dependências por pacotes, compatibilidade do legado e correção da numeração funcional/PATCH. |
| v2.0 | 20/10/2026 | Introdução/Sistema/diário 0.9.0 e migração schema 5; revisão documental independente da versão do jogo. |
| v2.1 | 20/10/2026 | Kit/consumíveis/mana 0.10.0, schema 6, evidências remotas e divisão P09-01B1/B2. |
| v2.2 | 21/10/2026 | Primeiro encontro 0.11.0, schema 7, resultados por missão, evidências e próximo pacote do castelo. |


## 17. Escopo executável — 0.4.0

Trecho provisório: Clareira da Outra Margem → conversa com Lyra → ruínas (encontro existente) → consequência da vitória → abrigo. Movimento por casas adjacentes, obstáculos, comandos de teclado e botões. A narrativa é provisória, sem estabelecer lore canônica nova.

Aceite: criação entra na exploração; conversa desbloqueia encontro apenas perto da entrada; vitória retorna ao mesmo cenário e concede três suprimentos uma única vez; derrota permite repetir/retornar sem recompensa; checkpoint persiste perfil, posição e eventos após recarregar. Salvamento local IndexedDB schema 1, rejeição de dados inválidos, aviso de falha e confirmação de substituição de jornada. Não salva batalha em andamento: recarregar retorna ao último checkpoint exploratório. Sem combate novo, inventário, base gerenciável ou recrutamento persistente; Lyra é acompanhante provisória do encontro existente.

## 18. Escopo executável — 0.5.0

Tornar legíveis as diferenças de classes já existentes, sem redefinir o balanceamento. Um catálogo tipado alimenta validação de perfil, criação de unidades, prévia e ficha. Aceite: trocar classe atualiza HP/energia/ataque/magia/defesa/movimento e duas técnicas; trocar raça informa seu caráter narrativo; ficha permanece acessível em mobile; valores da prévia coincidem com a batalha; checkpoint schema 1 continua legível. XP e equipamentos são pacotes posteriores, com numeração e aceite ainda a definir.

## 19. Escopo executável — 0.6.0

Aceite: iniciar com nível 1/0 XP; primeira vitória na passagem concede 100 XP, nível 2 e ganhos declarados de classe; derrota e repetição não acrescentam XP ou suprimentos; salvar/recarregar conserva progresso; saves schema 1 migram preservando perfil/posição/eventos. Ficha mostra XP, nível, ganhos e limite atual. Atributos evoluídos são reconstruídos na próxima batalha, sem aplicar aumentos em duplicidade nem alterar o encontro em andamento. Apenas protagonista evolui; próximo conteúdo exigirá revisar limite e curva antes de expandi-los.

## 20. Escopo executável — 0.7.0

Aceite: inventário acessível em exploração; equipar, trocar e remover entre três acessórios iniciais, um por vez; comparação revela ganho/perda; ficha e próxima batalha usam os mesmos atributos, sem acumulação e sem alterar NPCs. Save/restauração preservam item e inventário; schemas antigos recebem catálogo inicial sem equipar nada; dados inválidos não sobrescrevem saves válidos. Nível/XP, recompensa única e mobile preservados. Equipamentos são itens de protótipo, sem estabelecer material, cultura ou lore canônicos.

## 21. Escopo executável — 0.8.0

Aceite: preparar abrigo só após vitória, perto dele e com três suprimentos; repetição não cobra novamente. Recrutar Lyra apenas com base preparada, diálogo e proximidade, uma vez. Alternar equipe/reserva só no abrigo; formação aplicada no treino e persistida. Treino sem XP/suprimentos/ferimentos persistentes, com saída durante fase aliada e retorno à exploração. Checkpoints antigos não consomem recursos nem recrutam sozinhos. Fluxo inicial com Lyra temporária e progressão/equipamentos preservados. Integração narrativa provisória; não estabelece biografia ou arco canônico de Lyra.
