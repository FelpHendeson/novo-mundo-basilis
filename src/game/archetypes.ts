export type UnitClass = "Guerreiro" | "Mago" | "Ladino";
export type Technique = {
  name: string;
  power: number;
  range: number;
  cost: number;
  kind: "physical" | "magic";
};
export const CLASSES = ["Guerreiro", "Mago", "Ladino"] as const;
export const RACES = ["Humano", "Elfo", "Anão", "Teriano", "Draconiano", "Demoniano"] as const;
export type Attributes = { hp: number; ep: number; attack: number; magic: number; defense: number; move: number };
export const CLASS_DATA: Readonly<Record<UnitClass, { readonly description: string; readonly stats: Readonly<Attributes> }>> = {
  Guerreiro: { description: "Resistência e ataques físicos de curta distância.", stats: { hp:28, ep:8, attack:8, magic:2, defense:6, move:4 } },
  Mago: { description: "Magia à distância, com maior consumo de energia e menor defesa.", stats: { hp:21, ep:15, attack:3, magic:10, defense:3, move:4 } },
  Ladino: { description: "Maior mobilidade e opção de ataque físico à distância.", stats: { hp:23, ep:10, attack:7, magic:3, defense:4, move:5 } },
};
/** Copy attributes so combat mutations cannot alter the content catalog. */
export function classAttributes(cls: UnitClass): Attributes { return { ...CLASS_DATA[cls].stats }; }
export const RACE_NOTICE = "Raça é uma escolha narrativa nesta versão; não altera atributos ou técnicas. Aparência ainda não disponível.";
export const TECHNIQUES: Record<UnitClass, Technique[]> = {
  Guerreiro: [
    { name: "Corte", power: 7, range: 1, cost: 0, kind: "physical" },
    { name: "Golpe pesado", power: 12, range: 1, cost: 3, kind: "physical" },
  ],
  Mago: [
    { name: "Centelha", power: 7, range: 3, cost: 2, kind: "magic" },
    { name: "Chama arcana", power: 12, range: 2, cost: 5, kind: "magic" },
  ],
  Ladino: [
    { name: "Punhalada", power: 7, range: 1, cost: 0, kind: "physical" },
    { name: "Lâmina lançada", power: 6, range: 2, cost: 2, kind: "physical" },
  ],
};
