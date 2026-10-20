# Release 0.5.0 — Catálogo e ficha do viajante

20/10/2026. Código: `f41bdffc80453fdfd74786d966bd9ceaae2a38f9`.

## Entrega

Catálogo tipado único para classes, atributos, técnicas e lista de raças. Modelo de batalha e validação de checkpoint usam esse catálogo. Prévia dinâmica na criação e ficha expansível na exploração mostram HP, energia, ataque, magia, defesa, movimento e técnicas com tipo, potência, alcance e custo. Batalha exibe atributos ofensivos/defensivos junto dos recursos atuais. Ficha conserva estado aberto e foco durante redesenho da exploração.

Valores e técnicas publicados foram preservados, assim como as seis raças narrativas. Não foram criados bônus de raça ou nova lore. XP/nível, equipamentos e aparência permanecem fora deste pacote. O roadmap foi dividido para evitar anunciar a evolução completa como entregue.

## Validação

- `npm test`: 53 testes em cinco arquivos passaram; inclui regressões de combate/vitória/derrota e IndexedDB existentes. 22 casos novos verificam atributos publicados, 18 combinações raça/classe com checkpoint/batalha e isolamento das instâncias.
- `npm run build`: TypeScript e Vite passaram. Aviso existente de bundle maior que 500 kB permanece (JS ~1,24 MB, ~344 kB gzip); desempenho não medido.
- Prévia: três classes mostraram atributos/técnicas; troca para Elfo não alterou os números. Criação, exploração, ficha, salvamento/recarga/continuação, diálogo, percurso até ruínas e menu de técnicas do Ladino conferidos. Recursos da batalha coincidiram com a ficha; console sem erros observados.
- Mobile: 390×844, 320×568 e 844×390 sem overflow horizontal. Ficha rolável, mapa preservado e estado aberto mantido após salvar. Não substitui teste com toque físico, teclado virtual ou Safari/iOS.
- Produção: checkpoint anterior Humano/Guerreiro continuou; ficha conferida, bundle final `index--cdtLclw.js` carregado e console sem erros observados.

Não foi repetido combate manual completo até vitória/derrota nesta versão: regras não mudaram e essas regressões continuam nos testes de domínio.

## Publicação e compatibilidade

Vercel production READY: `dpl_C1diFS5NgEP7dRB6RxreYrE71ocu`, commit `f41bdff`.
URL: https://novo-mundo-basilis.vercel.app.
Branch: `release/0.5.0`. Tag Git não criada pelas ferramentas disponíveis, ainda pendente.
Checkpoint IndexedDB schema 1 mantido, sem migração ou apagamento. Raça continua preservada no perfil; não é usada como modificador de combate.
