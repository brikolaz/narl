# Items

## Invariants

- Weapon classification is determined exclusively by the isWeapon helper

- Armor classification is determined exclusively by the isArmor helper

- BonusStats apply globally to all equipped items

- Base entity stats, such as DefComponent, DmgComponent, and similar stat components, apply only to the entity they belong to

- Base stats do not implicitly become global equipment bonuses

- Equipment-wide effects must be represented explicitly through BonusStats, rather than inferred from base entity stats