# Pipeline técnico de sprites e animações
## Convenções
- Tiles: 32×32, atlas PNG transparente com grid de origem 0.
- Personagens: 32×48, direções N/E/S/W, 4 frames de caminhada/direção e idle.
- Combate lateral: canvas por unidade 128×128 com pivot nos pés e camadas de arma/efeito; animações idle (4), ataque (6–10), impacto (2–4), derrota (4–8).
- Retratos: 128×128 com margens uniformes e expressões principais.
- Identificadores: snake_case; ex. `char_cael_walk_s_03.png`, `fx_mana_pulse_02.png`.
- Dados de atlas: frame, crop, pivot, duração, hitbox e evento de impacto.

## Personalização
Montagem em camadas: corpo/raça → roupa/classe → cabelo/rosto → equipamento/arma → efeitos. Para manter compatibilidade, paleta/sombra, pivôs e proporções devem ser iguais por família anatômica. Modelos com anatomia radicalmente distinta requerem rig independente. Evitar explosão combinatória de sprites pré-renderizados.

## Geração assistida
Produzir primeiro **model sheet** de cada personagem e tiles de ambiente. Solicitações devem especificar resolução-alvo, transparência, vista, proporção, paleta, ausência de UI/texto e ortografia dos elementos. Não confiar que modelos de imagem produzam grid exato de frames automaticamente: recortar, normalizar e revisar manualmente/por script.

## Validação automatizada
- Dimensões e formatos esperados, PNG com alpha.
- Sprites com baseline e pivot uniforme.
- Ausência de bleeding entre frames no atlas.
- Pixels discretos sem redimensionamento suave.
- Animations referenciam nomes de frames existentes.
- Teste visual em múltiplos fundos e no menor viewport suportado.

## Marcos
1) avatar base, 2) aliados e inimigos da primeira luta, 3) NPCs do castelo, 4) bestas e mercado, 5) variedade de classes/raças. Não gerar 50 sprites antes de validar um ciclo completo de animação.
