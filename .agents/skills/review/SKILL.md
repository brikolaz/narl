---
name: review
description: Manually run the NARL reviewer agent on the current change.
---

Spawn the custom agent named `reviewer`.

Give it the current task context available in this session and the complete current git diff (`git diff HEAD`, including staged and unstaged changes).

Ask it to review the change according to its configured reviewer instructions.
Do not perform a parallel review yourself.
Do not modify production code or tests as part of this skill.
Wait for the reviewer to finish, then return its material findings concisely.
