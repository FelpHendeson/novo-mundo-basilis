# Novo Mundo: Basilis — Plano de Projeto

**Tipo:** RPG tático 2D original, single-player  
**Franquia:** Novo Mundo | **Jogo:** Basilis  
**Stack:** Phaser 3, TypeScript, Vite, Vitest  
**Repositório:** https://github.com/FelpHendeson/novo-mundo-basilis  
**Publicação:** https://novo-mundo-basilis.vercel.app  
**Documento:** v1.0 — 20/10/2026  
**Estado de referência:** protótipo 0.2.0 no repositório (confirmado em README; commit observado `b213e7a`)

> Este documento é um plano vivo. Conteúdo narrativo e sistemas ainda não aprovados devem ser tratados como propostas, não como cânone.

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

## 3. Ciclo principal de jogo

1. Preparação na base: grupo ativo, equipamentos, habilidades e objetivos.
2. Exploração de cenário: NPCs, recursos, caminhos, eventos e decisões.
3. Encontro tático: posicionamento, movimentação, técnica, alvo, prévia e resolução.
4. Cena cinematográfica: apresentação do resultado já determinado pelo motor de combate.
5. Consequências: ferimentos, experiência, recompensas, relações e recrutamentos.
6. Retorno/expansão da base: serviços, edificações, aliados e acesso a novos cenários.

## 4. Narrativa inicial — proposta sujeita a aprovação

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
- Opção de velocidade de animação e, futuramente, opção para pulá-la.
- Condições de vitória alternativas: eliminar inimigos, sobreviver, escapar, resgatar, ocupar objetivos.

### 5.2 Batalha cinematográfica — requisito essencial
**Sequência mínima:** seleção da técnica e do alvo → prévia → confirmação → transição de câmera/tela → combatentes em lados opostos → animação do ataque/impacto → atualização visual de PV e efeitos → eventual reação/contra-ataque → retorno ao mapa.

**Requisitos técnicos:**
- `BattleResolver` determina o evento de combate e seus resultados uma única vez.
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
- Salvamento local versionado (preferencialmente IndexedDB) e migração de schema.
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
 docs/             # design, ADRs, releases e planejamento
```

**Observação:** é uma arquitetura-alvo, não afirmação sobre as pastas já existentes. Preferir TypeScript estrito, módulos coesos, dados tipados/validados, regras independentes de Phaser e interfaces testáveis. Evitar abstração excessiva antes da necessidade.

## 7. Roadmap de entregas

| Marco | Objetivo | Entregável verificável | Status |
|---|---|---|---|
| 0.1 | Fundação da aplicação | Projeto Phaser/Vite e protótipo inicial | Histórico |
| 0.2 | Estabilização tática | Um encontro jogável, melhorias de seleção/turnos, testes e publicação | Protótipo no repositório; validar release |
| **0.3** | **Batalha cinematográfica** | **Tela lateral de confronto funcional, sincronizada com o motor, com animação e retorno ao mapa** | **Próxima prioridade** |
| 0.4 | Exploração | Cenário navegável, interação com NPC, diálogo e entrada em combate | Planejado |
| 0.5 | Classes, raças e evolução | Dados tipados, progresso básico, equipamentos e diferenciação real | Planejado |
| 0.6 | Base e recrutamento | Base explorável simples, recrutar e montar equipe | Planejado |
| 0.7 | Campanha vertical | Prólogo e primeiro capítulo jogáveis ponta a ponta | Planejado |
| 0.8 | Polimento e conteúdo | UX, áudio, sprites, balanceamento, salvamento robusto | Planejado |
| 1.0 | Primeira versão pública estável | Campanha inicial fechada, QA e documentação de release | Futuro |

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
6. Tratar cancelamento antes da confirmação, duplo clique, troca de cena e ação indisponível.
7. Implementar opção de aceleração/pulo de apresentação sem pular aplicação de estado.
8. Testar regressões; publicar e validar na URL de produção.

### Critérios de aceite 0.3
- [ ] Atacar com qualquer classe implementada abre a cena lateral.
- [ ] Atacante e alvo aparecem frente a frente com identificação e PV.
- [ ] Técnica escolhida determina o efeito/animação apresentado.
- [ ] Dano é aplicado **exatamente uma vez**, inclusive em ataque letal.
- [ ] Cena retorna ao tabuleiro e conserva posições, turnos e estados corretos.
- [ ] Ação inválida, fora do alcance ou sem energia não inicia batalha.
- [ ] Acelerar/pular animação não altera o resultado.
- [ ] Build de produção, testes de regras e verificação em navegador passam.
- [ ] Deploy do Vercel fica `READY` e interface é testável por link público.

## 9. Qualidade e definição de pronto (DoD)

Uma funcionalidade só é considerada entregue quando:
- código, conteúdo e documentação pertinente foram versionados;
- `npm test` e `npm run build` passaram (ou impedimentos estão relatados);
- fluxos relevantes foram testados no navegador, incluindo ações e navegação, quando as ferramentas permitem;
- não há erro bloqueador conhecido no caminho principal;
- comportamento, limitações e riscos foram relatados sem confundir implementação com validação;
- versão/deploy podem ser identificados por commit e URL.

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

Implementar a **versão 0.3 — batalha cinematográfica** sobre o estado mais recente da `main`, começando por revisão do sistema de combate atual e teste de regressão. Priorizar um fluxo completo com placeholders antes de produzir um grande catálogo de animações.
