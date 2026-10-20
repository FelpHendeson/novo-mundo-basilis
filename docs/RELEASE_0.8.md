# Release 0.8.0 — Primeira base e recrutamento

20/10/2026. Implementação `9bd2007adcbac2da341cd0ff1798ecaeeef855df`; código final `2ec21397bb9440704cd3b3d5238ed5086386c6c6`.

## Entrega

Após a vitória, preparar o abrigo próximo ao acampamento consome 3 suprimentos uma única vez. A base preparada recebe uma representação simples no mapa existente. O painel Base e equipe orienta requisitos, recrutamento e formação. Convidar Lyra requer base pronta, conversa anterior e proximidade da NPC. Ela entra na equipe; no abrigo pode ser movida para a reserva e trazida de volta. O viajante é obrigatório.

Treino opcional reutiliza o encontro das ruínas com um ou dois aliados conforme formação. Não concede XP/suprimentos nem persiste ferimentos; inclui saída durante fase aliada e retorno à exploração. Alterações de formação valem para a próxima entrada. A primeira batalha continua com Lyra temporária, independentemente de recrutamento, preservando o ciclo anterior.

Objetivos acompanham as etapas. Mensagens de retorno/descanso foram ajustadas depois da validação do ciclo, antes da entrega pública final. Narrativa de integração de Lyra é provisória, sem estabelecer biografia ou arco canônico.

## Compatibilidade

Schema 4 adiciona base preparada/recrutamento/formação. Schemas 1–3 migram mantendo XP, acessórios, posição, suprimentos e eventos; nenhum recurso é gasto e ninguém é recrutado automaticamente. Banco IndexedDB permanece versão 1. Estados impossíveis ou malformados são rejeitados; inventário esparso corrompido também passa a ser rejeitado em vez de atingir a interface. Clientes antigos não leem schema 4: rollback precisa considerar essa limitação.

## Validação

- 98 testes em oito arquivos passaram. Onze casos novos verificam acompanhante temporária, custo/proximidade/vitória, convite único, equipe/reserva, treino e snapshot de campanha, migração de três schemas, dados inválidos e persistência IndexedDB. Regressões anteriores de combate, acessórios e progressão seguem passando.
- TypeScript e build final Vite passaram. Aviso existente de bundle acima de 500 kB permanece: JS ~1,249 MB, ~347 kB gzip; desempenho não medido.
- Na prévia de `9bd2007`: criação, diálogo, vitória do Guerreiro no turno 3, recompensa, retorno e preparação da base com suprimentos 3→0. Convite perto de Lyra, retorno ao abrigo, reserva e treino só com viajante (nível 2). Saída, reinclusão, treino com viajante/Lyra e saída. Recarga conservou base/equipe, 100 XP e zero suprimentos. Console sem erros de aplicação observados.
- Mobile: ciclo em 844×390; painel também em 390×844 e 320×568, sem overflow horizontal; botões da base medidos em 48 px. Sem aparelho físico, Safari/iOS ou teclado virtual.
- Ajuste final `2ec2139` só modifica mensagens contextuais; build aprovado. Produção final: checkpoint anterior Humano/Guerreiro continuou preservando posição/eventos e broche reforçado (defesa 8); base iniciou sem preparação ou recrutamento automático. Painel e ficha conferidos. Bundle `index-BdajkgyD.js`, console sem erros observados.
- A automação teve timeouts transitórios de clique, recuperados por leitura da tela e clique visual. Etapas afetadas foram verificadas depois; não tratadas como testes passados pelo timeout.

Não foi repetido o ciclo completo no domínio público após o ajuste de mensagens. Vitória/derrota completas de treino não foram jogadas manualmente: isolamento de estado/recompensa está coberto nas regras e testes, e entrada/saída das duas formações foi verificada no navegador.

## Publicação e limitações

Production READY `dpl_C3ebce8vB6GwYEwRwuSv5PSMELK7`, código `2ec2139`.
URL https://novo-mundo-basilis.vercel.app.
Branch `release/0.8.0`. Tag Git pendente pelas ferramentas disponíveis.

Um abrigo no mapa existente, uma recrutável e no máximo dois aliados. Sem nova região, múltiplos prédios, recrutáveis adicionais, equipe de sete, níveis/equipamentos de Lyra, áudio ou arte final. Treino é repetição mecânica do tabuleiro, não uma nova missão canônica. Próximo pacote de campanha vertical requer escopo próprio antes de execução.
