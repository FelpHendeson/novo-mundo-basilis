# Roteiro de Produção — Arco I: O Trono do Esquecido
**Status:** proposta dramática detalhada. Falas são texto inicial editável, não gravação. **Variáveis:** [NOME_JOGADOR], [NOME_CASTELO], [NOME_DOMINIO]. Protagonista não ganha personalidade fixa por diálogos obrigatórios.

## Sequência A: despertar e aprendizado
### SCN_001 — Última manhã
**Local:** Terra; mesa e refeição simples. Câmera evita definir rosto antes do criador.
- NARRAÇÃO: “Era um dia livre. Você acordara tarde. O mundo parecia seguir seu curso.”
- NARRAÇÃO: “A última lembrança é banal: uma refeição interrompida.”
- [Corte abrupto. O áudio da Terra desaparece. Sem explicar morte ou reset.]
**Condição de saída:** criação de personagem confirmada.

### SCN_002 — A clareira
- NARRAÇÃO: “A cabeça lateja. A grama está molhada e o céu… diferente.”
- SISTEMA: “Seja bem-vindo a Basilis.”
- SISTEMA: “Identidade reconhecida. Instruções básicas disponíveis.”
- ESCOLHA “Onde estou?” → SISTEMA: “Designação ambiental: Basilis. Região: não identificada.”
- ESCOLHA “Quem é você?” → SISTEMA: “Interface de registro e orientação.”
- ESCOLHA “Agora não.” → disponibilizar tutorial para consulta posterior.
- SISTEMA: “Um pacote de adaptação está disponível: arma compatível, três poções, rações e bolsa.”
**Escolhas:** aceitar/adicionar ao inventário, adiar sem perder pacote. Não duplicar.

### SCN_003 — O primeiro fluxo
- SISTEMA: “Mana permeia organismos e ambiente. Sua percepção é o primeiro passo.”
- Interação opcional em objeto energizado; minigame introdutório de percepção (ver 09).
- Primeira criatura defensiva; jogador pode observar, contornar ou entrar em combate.
- SISTEMA: “Registros atualizados. Observação e prática também desenvolvem competências.”
**Falha:** treinamento assistido opcional; saída do tutorial nunca travada em reflexos perfeitos.

## Sequência B: posse, risco e responsabilidade
### SCN_004 — Castelo na distância
Trilha antiga leva a muralha de pedra. Sinais de ocupação humana antiga. Portão parcialmente quebrado.
- NARRAÇÃO: “A construção parecia pequena demais para um rei, mas grande demais para ter sido esquecida.”
- Interações: pátio, armazém, muralha, registros e torre. Descobertas registradas como pistas.

### SCN_005 — O trono
Jogador alcança salão principal e se senta voluntariamente.
- SISTEMA: “Núcleo territorial inativo detectado.”
- SISTEMA: “O castelo abandonado encontrou um novo mestre.”
- SISTEMA: “Deseja reivindicá-lo? Nomeie o castelo.”
- Se adiar: manter acesso, registrar escolha; não forçar posse.
- Se aceitar: validar nome, persistir [NOME_CASTELO], ativar gestão.
- SISTEMA: “Autoridade administrativa registrada. População: 0. Estruturas funcionais: mínimas.”
- SISTEMA: “A posse sistêmica não constitui reconhecimento de outras autoridades.”
**Gameplay:** inspecionar três reparos (portão, depósito, dormitório); escolher meta prioritária sem materiais suficientes.

### SCN_006 — Um senhor sem súditos
- SISTEMA: “Infraestrutura reduzida. Recomendação: adquirir suprimentos, estabelecer contatos e recrutar habitantes.”
- ESCOLHAS de rota: caça, trilha de comércio, ruínas; descoberta conduz ao mesmo mundo sem teleportação narrativa forçada.
- Lyra (existente na 0.8) deve ser integrada sem contradição: seu encontro anterior pode virar acompanhamento opcional e ela pode aconselhar sobre perigo, não explicar mistérios que não conhece.

## Sequência C: primeiro contato
### SCN_007 — Rastros na estrada
Após coleta de materiais, ouvir vozes e encontrar sinais de luta. Doze pessoas em fuga; algumas feridas. Um combatente protege grupo.
- VIGIA: “Pare! Mais um caçador? Não vai levar ninguém!”
- ESCOLHA “Não estou perseguindo vocês.” → confiança +1; confronto pode ocorrer pela tensão.
- ESCOLHA “Abaixem as armas.” → postura hostil, mas não morte obrigatória.
- ESCOLHA “Recuar.” → possibilidade de observar e voltar; trilha paralela.
**Objetivo tático:** neutralizar ameaça ou sobreviver por turnos; evitar eliminação obrigatória.

### SCN_008 — Lâminas por engano
- COMBATENTE (CAEL, provisório): “Basta! Você não luta como quem veio nos caçar.”
- JOGADOR escolhe pergunta: “Quem os persegue?”, “Alguém está ferido?” ou “Por que atacaram?”
- CAEL: “Nossos perseguidores não fazem perguntas. Nós erramos. Isso não apaga o erro.”
- Se combate duro: desconfiança maior, reparação em missão futura.
- Se combate controlado: confiança e recuperação melhores.
- Caso jogador perca: cena de sobrevivência/conversa com custo de recursos; não soft-lock.
**Saída:** oferecer ajuda sem exigir recrutamento imediato.

### SCN_009 — A proposta
- JOGADOR: “Tenho um castelo. Está quase vazio, mas oferece muralhas e abrigo.” (opção)
- LÍDER DOS SOBREVIVENTES: “Uma muralha não alimenta crianças. Há água? Espaço? Segurança?”
- ESCOLHAS: demonstrar suprimentos, prometer reparos, admitir precariedade.
- CAEL: “Posso ensinar alguns a segurar uma arma. Mas ninguém aqui é mercadoria.”
- Sistema registra oferta, não teleporta súditos. Grupo pondera e decide com base em confiança, segurança e provisões.
**Resultado:** até 12 candidatos; adesão efetiva depende de condições e escolhas. Um combatente elegível a campeão.

## Sequência D: primeiro assentamento
### SCN_010 — Volta ao castelo
Atravessar estrada, decidir ritmo e lidar com evento de chuva/falta de suprimento opcional.
- SOBREVIVENTE: “Se ficarmos, precisamos de trabalho e comida antes de promessas.”
- Primeira alocação: limpeza, água, defesa e reparos; ninguém produz bens gratuitamente.

### SCN_011 — Dias de trabalho
- Tutorial de quadro de tarefas e minigame de reparo (opcional, com alternativa delegada).
- CARPINTEIRO: “Não preciso de um milagre. Preciso de madeira seca e três mãos que saibam ouvir.”
- Construção concluída altera visual e capacidade real da base.

### SCN_012 — Primeiro treinamento
- CAEL: “Se vai enviá-los para fora dos muros, ensine-os a voltar.”
- Jogador pode participar de treino de defesa, prática de mana ou tiro; habitantes seguem treino delegado fora da cena.
- Identificar aptidão sem revelar todas as características secretas; nomear primeiro campeão após critérios mínimos.

## Sequência E: economia, propósito e gancho
### SCN_013 — A estrada e o mercado
- MERCADORA: “Pelo couro pago hoje. Pelo núcleo mágico, preciso de alguém que saiba avaliá-lo.”
- Apresentar venda, retenção para artesanato e contratos de caça.
- Reputação e licenças importam; ter castelo não isenta taxas de mercados vizinhos.

### SCN_014 — Primeiro contrato
Escolha entre caça de ameaça, escolta ou busca de recurso; ao menos um pode ser cumprido por equipe ativa; segundo tipo liberado como expedição delegada se formação comportar.
- CONTRATANTE: “Não pago por histórias. Traga prova ou testemunha.”
- Resultado influencia reputação e recursos.

### SCN_015 — Primeira bandeira
Retorno ao salão. Nomear território quando restauração atinge primeiro limiar.
- SISTEMA: “População reconhecida. Serviços mínimos restaurados.”
- SISTEMA: “Designação territorial disponível. Informe o nome do domínio.”
- NARRAÇÃO: “A fortaleza já não estava silenciosa.”
- Fecho: sinais de interesse externo; carta sem assinatura reivindicando direitos antigos sobre a região.
**Arco completo:** castelo nomeado, súditos efetivos, uma estrutura reformada, treino realizado ou delegado, primeiro campeão elegível, troca comercial registrada e missão encerrada.
**Não revelar:** Sistema, transporte ou identidade histórica do castelo.
