# Direção artística
## Identidade
Fantasia de exploração e reconstrução, com atmosfera de mistério e esperança cautelosa. **Pixel art original** com leitura clara em mobile e desktop. Referências de ritmo e gênero não autorizam reprodução de sprites ou layouts protegidos de Fire Emblem, Pokémon ou Digimon.

## Paleta e luz
Floresta: verdes musgo, azuis acinzentados, madeira úmida e luz âmbar. Castelo: ardósia, calcário gasto, ferro oxidado e vegetação. Sistema Universal: turquesa claro, azul mineral e fundo escuro — discreto, legível, sem poluição de efeitos. Região mercantil: barro avermelhado, tecidos quentes, lanternas e madeira.

## Escala
Tiles 32×32; personagens 32×48 (ou 48×48 se validados); confronto lateral 96×96 ou 128×128; retratos 128×128; ícones 24×24 ou 32×32. Definir escala de referência antes de produzir catálogo. Usar filtro nearest-neighbor e pixels inteiros.

## Silhuetas
Guerreiro: armadura e postura marcantes. Mago: volumes de pano e foco arcano. Ladino: perfil leve e ferramentas. Raças devem ser discerníveis por anatomia/acessórios com respeito à diversidade; evitar restrições de classe pela raça. Diferenciar aliados/inimigos por UI e contorno, não apenas vermelho/azul.

## Ambientes do primeiro arco
Terra cotidiana; clareira; trilha; mata; acesso à fortaleza; pátio e salão de trono; Estrada Baixa; campo de treino; mercado do Vau. Para restauração, produzir ao menos estados RUÍNA / LIMPO / REPARADO para objetos prioritários.

## Animação
Exploração: idle e caminhada em quatro direções; ataque lateral: preparação, execução, impacto, recuperação, hitstun e derrota; mana: efeito independente e acoplável a técnicas. Transição para cena lateral deve respeitar resultado do resolver; sem rolagem adicional.

## UI
Texto de Sistema distinto de diálogos de NPCs; cada estado com ícone, cor + rótulo; menus navegáveis, áreas de toque confortáveis; preservar legibilidade em 320px de largura. FX e tremor de tela configuráveis, inclusive desligáveis.

## Pipeline
Silhueta → concept aprovado → model sheet (frente, perfil, costas) → sprite base → frames → atlas → pivô/colisão → QA com cenários escuros/claros → implementação. Gerar rascunhos com IA não implica spritesheets prontos; quadros exigem limpeza e padronização.
