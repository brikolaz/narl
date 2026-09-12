---
name: test
description: Manually run the NARL tester agent on the current change.
---

Spawn the custom agent named `tester`.

Give it the current task context available in this session and the complete current git diff (`git diff HEAD`, including staged and unstaged changes).

Ask it to inspect coverage, add only meaningful missing behavioral/regression/invariant tests, and run the relevant test commands according to its configured tester instructions.
Do not write tests or modify production code yourself in parallel.
Wait for the tester to finish, then return its concise report.
