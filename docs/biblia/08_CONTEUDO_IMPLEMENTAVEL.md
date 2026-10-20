# Contratos de dados e implementação de conteúdo
## IDs de cena
SCN_001_LAST_DAY, SCN_002_AWAKEN, SCN_003_MANA, SCN_004_CASTLE_GATE, SCN_005_THRONE, SCN_006_DOMAIN, SCN_007_TRACKS, SCN_008_MISUNDERSTANDING, SCN_009_INVITATION, SCN_010_RETURN, SCN_011_REPAIR, SCN_012_TRAIN, SCN_013_MARKET, SCN_014_CONTRACT, SCN_015_FIRST_BANNER.

## Flags propostas
`starterKitClaimed`, `manaTutorialDone`, `castleClaimed`, `castleName`, `domainName`, `survivorTrust`, `survivorsInvited`, `survivorsSettledIds`, `caelRecruited`, `firstChampionId`, `firstBuildingRepaired`, `marketIntroduced`, `firstContractDone`, `actOneComplete`.

## Eventos
`PlayerArrived`, `SystemTutorialSeen`, `ManaExerciseCompleted`, `CastleInspected`, `ClaimRequested`, `CastleNamed`, `SurvivorEncounterResolved`, `InvitationResolved`, `SettlerArrived`, `TrainingSessionResolved`, `ChampionNominated`, `BuildingRepaired`, `GoodsTraded`, `ContractResolved`, `TerritoryNamed`.

## Invariantes
Recompensa com event ID idempotente; ataques resolvidos uma vez; eventos de cena reentrantes sem repetir grant; save inclui versão e migração; NPC morto não reaparece em lista de trabalhadores; membro em expedição delegada não entra simultaneamente em combate; treinamento não cria recursos; nome deve ser sanitizado e limitado; opção de adiar não bloqueia progresso irreversivelmente.

## Proposta de dados
```ts
type TrainingResult = {
  activityId: string;
  participantId: string;
  grade: 'assistido' | 'bronze' | 'prata' | 'ouro';
  skillXp: number;
  fatigue: number;
  materialCosts: Record<string, number>;
  eventId: string; // chave de idempotência
};
type DomainOrder = {
  orderId: string;
  assignedPersonIds: string[];
  startsOnWorldTick: number;
  endsOnWorldTick: number;
  resourceBudget: Record<string, number>;
};
```

## Cenários E2E mínimos
Nova jornada, salvar/recarregar em todos os capítulos, tutorial adiado, reivindicação adiada, vitória/derrota no confronto, recrutamento recusado, treino com falha, treino delegado, equipamento mudado, troca comercial, conclusão do arco sem duplicar suprimentos/XP.
