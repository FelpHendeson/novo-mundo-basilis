import type { Campaign } from "../game/campaign";
import { EQUIPMENT, equipmentLabel, equippedAttributes, type EquipmentId } from "../game/equipment";

export function equipmentPanel(c: Campaign, onEquip: (id: EquipmentId | null) => void): HTMLDetailsElement {
  const root = document.createElement("details");
  root.className = "equipment-panel";
  const summary = document.createElement("summary");
  summary.textContent = "Inventário e acessórios";
  summary.dataset.action = "inventory";
  root.append(summary);
  const current = document.createElement("p");
  current.textContent = `Em uso: ${equipmentLabel(c.character.equipment)}. Um espaço de acessório; trocas só na exploração e valem na próxima batalha.`;
  root.append(current);
  const buttons = document.createElement("div");
  buttons.className = "roster";
  const a = equippedAttributes(c.character.cls, c.character.experience, c.character.equipment);
  for (const id of c.inventory) {
    const item = EQUIPMENT[id];
    const b = equippedAttributes(c.character.cls, c.character.experience, id);
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.action = `equip-${id}`;
    button.textContent = `${c.character.equipment === id ? "Equipado" : "Equipar"}: ${item.name} · ${item.effect}. Ataque ${a.attack} → ${b.attack}, magia ${a.magic} → ${b.magic}, defesa ${a.defense} → ${b.defense}`;
    button.disabled = c.character.equipment === id;
    button.onclick = () => onEquip(id);
    buttons.append(button);
  }
  const remove = document.createElement("button");
  remove.type = "button";
  remove.dataset.action = "unequip";
  remove.textContent = "Remover acessório";
  remove.disabled = c.character.equipment === null;
  remove.onclick = () => onEquip(null);
  buttons.append(remove);
  root.append(buttons);
  const note = document.createElement("p");
  note.textContent = "Três itens iniciais do protótipo, disponíveis para qualquer classe. Bônus não se acumulam ao trocar. Sem lojas, saque, consumo ou durabilidade nesta versão.";
  root.append(note);
  return root;
}
