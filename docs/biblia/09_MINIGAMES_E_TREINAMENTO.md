# Treinos, minigames e atividades — Design v1.1
**Objetivo:** tornar evolução e vida da base divertidas, com agência e consequências; não transformar grind em requisito. **Status:** proposta para validação, não conteúdo implementado.

## Regras comuns
1. Minigames **curtos** (20–90 segundos), ensinam uma habilidade reconhecível e começam com tutorial contextual.
2. Jogar pessoalmente dá bônus moderado de XP/proficiência ou qualidade, mas **nunca um item único indispensável** que a alternativa delegada não possa obter.
3. Dificuldade ajustável, controles de toque e teclado, redução de reflexos exigidos e alternativa automática/delegada com retorno menor.
4. Gasto de energia, fadiga, tempo de jogo e ferramentas impede fazenda infinita de atributos.
5. Não aumentar atributos só por apertar botão repetidamente; recompensa depende de progressão, limite diário e contexto.
6. Repetições podem ser simuladas após demonstrar domínio; eliminar animações redundantes.

## MG_01 — Circulação de mana
**Fantasia:** aprender a sentir a energia interna e estabilizar o circuito.
**Mecânica:** anel circular com zonas de fluxo e um marcador móvel; pressionar/segurar nos intervalos corretos, controlando sobrecarga. Modos progressivos: percepção (apenas identificar), circulação (manter fluxo), reforço (direcionar a membros), manifestação (conectar foco externo).
**Desempenho:** estabilidade, gasto de mana e tempo dentro da janela; não usar precisão milimétrica.
**Resultado:** proficiência de mana, recuperação/controle e chance de descobrir afinidade. Falha: fadiga e pequena experiência, não dano fatal no tutorial.
**Acessibilidade:** velocidade reduzida, botão de estabilização e modo de treino assistido.

## MG_02 — Treino de espada / armas
**Fantasia:** aprender distância, ritmo e defesa.
**Mecânica:** boneco apresenta guardas/aberturas (alto, médio, baixo). Jogador escolhe golpe e timing; o alvo pode indicar contragolpe. Combo valendo precisão + postura + defesa; penalidade leve por spam.
**Progressão:** proficiência por família de arma; desbloqueia exercícios de contra-ataque e alcance, sem conceder técnicas avançadas por automatismo.
**Acessibilidade:** modo por turnos, decisão tática sem janela de tempo; o modo tempo real é opcional.

## MG_03 — Arco e projéteis
**Fantasia:** mira, antecipação e controle da respiração.
**Mecânica:** alvos estáticos/móveis, trajetória com variação limitada de vento e distância. Escolher força/ângulo; feedback visual de tiro previsto após prática.
**Recompensa:** precisão e familiaridade com arma. Modo assistido sem contagem regressiva.

## MG_04 — Escudos e formação
**Fantasia:** proteger aliados em grupo.
**Mecânica:** posicionar 2–4 defensores num minigrid contra ondas sinalizadas de ataque; orientações e rotação de escudos por turno.
**Recompensa:** defesa em formação, confiança entre membros e prontidão da guarda da base. Excelente ponte para RPG tático.

## MG_05 — Manutenção / reparo
**Fantasia:** recuperar a fortaleza com participação real.
**Mecânica:** puzzle de disposição de materiais em pequenas peças do edifício, respeitando suporte e encaixe, ou escolha de etapas de obra com orçamento.
**Recompensa:** qualidade do reparo, economia limitada de material ou tempo de trabalho. Erro resulta em retrabalho, nunca geração negativa irreversível de progresso.
**Alternativa:** delegar a Toren/outros profissionais.

## MG_06 — Forja e fabricação
**Mecânica:** três estágios curtos: aquecer metal numa banda térmica, escolher forma conforme uso e aplicar acabamento. Qualidade depende de proficiência e materiais; erro não destrói equipamento raro na primeira tentativa.
**Recompensa:** item com qualidade e desgaste, não superioridade ilimitada.
**Alternativa:** encomendar ao ferreiro; cliente escolhe custo/prazo.

## MG_07 — Caça, rastreamento e coleta
**Mecânica:** investigar pistas num cenário, separar rastros reais de falsos, escolher aproximação e minimizar ruído. Recompensa por conhecimento ambiental, não só por matar.
**Transição:** detecção pode evitar luta, alterar posição inicial, abrir coleta ou desencadear combate.

## MG_08 — Negociação e comércio
**Mecânica:** leitura de necessidades do interlocutor, escolha de oferta, concessão e prazo; nunca minijogo de “fala correta única”. Guilda tem limites econômicos e personalidade de negociadores.
**Resultado:** reputação, margem dentro de banda sustentável e contratos disponíveis.

## MG_09 — Treino de liderança de campeões
**Mecânica:** cenário tático compacto de 3 turnos, escoltar um aliado ou defender suprimento com poucas unidades. Avaliar decisões de posicionamento, proteção e objetivo; não só dano causado.
**Desbloqueio:** qualificação para liderar uma expedição delegada.

## Ciclo de formação
`planejar → escolher instrutor/treinando → reservar sala/equipamento/tempo → executar minigame OU delegar → avaliar → atualizar proficiência/fadiga/vínculo → permitir descanso`.

## Treino de habitantes
- Não exigir minigame para cada morador. Agrupar turmas (2–8), com instrutor, currículo (combate, agricultura, carpintaria, mana) e relatório no calendário do jogo.
- Pessoas com aptidões distintas respondem de modo diferente; aptidões não equivalem a destino fixo.
- Nomeação de campeão depende de aptidão prática, confiança, vaga e preparo, não só uma barra de XP.
- Treino delegado consome tempo de jogo e recursos e pode produzir eventos: lesão leve, descoberta de talento, desavença, amizade, nova técnica.

## Primeiro slice implementável (0.9.5)
**Apenas dois minigames completos:** circulação de mana e guarda com espada, com modo assistido e treino delegado. O reparo entra em versão simplificada. Os demais ficam no backlog para evitar sobrecarga de produção.

## Antiexploit e persistência
XP com diminishing returns por sessão, cooldown por calendário do jogo, grant idempotente, sessões interrompidas persistidas sem bônus duplicado, treino com participantes indisponíveis bloqueado, avaliação baseada em critérios determinísticos e seed para testes.
