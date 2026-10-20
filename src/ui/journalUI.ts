import type { Campaign } from "../game/campaign";
import { journalEntries } from "../game/journal";
export function journalPanel(c: Campaign): HTMLDetailsElement {
  const root = document.createElement("details");
  root.className = "journal-panel";
  const title = document.createElement("summary");
  title.textContent = "Diário da jornada";
  title.dataset.action = "journal";
  root.append(title);
  const list = document.createElement("ul");
  for (const text of journalEntries(c)) {
    const li = document.createElement("li"); li.textContent = text; list.append(li);
  }
  root.append(list);
  return root;
}
