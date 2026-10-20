# Novo Mundo: Basilis — 0.3.0

## Entrega

Confrontos laterais para ataques aliados e inimigos: combatentes frente a frente, técnica, HP, barras de vida, energia antes/depois, deslocamento físico, projétil ou magia, impacto e desaparecimento em derrota. Controles HTML acessíveis de velocidade 1×/3× e pulo. Retorno com foco no tabuleiro.

## Regras e arquitetura

`resolveCombat` produz um resultado imutável com identificador e snapshots dos combatentes. Dano e custo são confirmados uma única vez; a apresentação só lê o resultado. A fase presentation bloqueia comandos táticos e adia o fim da ação/resultado da batalha. Conclusões repetidas ou de outro evento são ignoradas. A fila da IA aguarda cada cena antes da próxima ação ou rodada. Sem apresentação (simulação), as mesmas regras resolvem imediatamente.

## Referências

- `bf8a18e`: implementação das regras e cena.
- `14064d7`: testes por classe, instruções e documentação de uso; código final da release.
- Publicação: https://novo-mundo-basilis.vercel.app
- Deployment READY confirmado: `dpl_7qRN3g7aVR3gKpgUKT94paCJsAZN`, production, commit `14064d7`.

## Evidências

22 testes Vitest passaram; TypeScript strict e build Vite passaram. Testes incluem imutabilidade, prévia igual ao resultado, ações inválidas, três classes, conclusão duplicada/inválida, bloqueio de entrada, último golpe aliado, derrota inimiga e serialização de dois inimigos.

Na prévia `bf8a18e`, Chrome: criado Guerreiro, rodada inimiga, cena de Lâmina lançada, mudança para 3× e retorno automático; Golpe pesado aliado com 16 de dano/custo 3; Centelha letal pulada com 15 de dano/custo 2; continuação da IA; ataque físico pulado; última Centelha pulada e vitória no turno 4 sem fase residual. Repetir batalha restaurou turno 1/HP/energia. A alteração de código posterior apenas substitui a instrução do painel; demais mudanças são testes e README.

## Limitações

Arte geométrica e efeitos provisórios, sem áudio, save ou novos conteúdos de campanha. Não foram adicionados contra-ataques, críticos, evasão, suporte ou regras novas. Ladino como atacante aliado foi validado no domínio, não em partida manual; Ladino inimigo, Guerreiro e Mago foram exercitados no navegador. Derrota e múltiplos callbacks foram cobertos pelo domínio, não por uma segunda partida manual completa. Mobile e interrupção abrupta de cena não tiveram validação manual específica. Console da sessão contém mensagens da extensão/Vercel anteriores à navegação; não foram atribuídas ao jogo. Bundle ~340 KB gzip continua como oportunidade de otimização. Tag Git não criada nesta entrega por indisponibilidade de operação autenticada de tags nas ferramentas usadas.

Produção: domínio público abriu criação e batalha; bundle `index-B-vFj7R3.js` corresponde ao build final local. Avanço de rodada conferido.
