# bkit Plugin Setup

This repo uses the **bkit** Claude Code plugin from
[popup-studio-ai/bkit-claude-code](https://github.com/popup-studio-ai/bkit-claude-code)
to coordinate multi-agent feature delivery (PDCA + Sprint flows) on top of Claude Code.

## Installed version

- Marketplace: `bkit-marketplace`
- Plugin: `bkit@bkit-marketplace`
- Version: `2.1.17`
- Scope: user (available to every project on this machine)

## How it was installed

```bash
claude plugin marketplace add popup-studio-ai/bkit-claude-code
claude plugin install bkit@bkit-marketplace
```

## What the plugin gives us

| Command   | Purpose |
|-----------|---------|
| `/sprint` | Multi-feature releases — spawns `sprint-master-planner`, `sprint-orchestrator`, `sprint-qa-flow`, `sprint-report-writer` |
| `/pdca`   | Single-feature PDCA loop — spawns the 34-agent specialist team (pm-lead, cto-lead, gap-detector, pdca-iterator, qa-lead, report-generator, …) |
| `/control`| Sets autonomy level L0–L4 |

The plugin also ships 44 skills, 21 hook events, 40 templates, 2 MCP servers and 175 lib modules.
We use it together with the project-level OMC `ultragoal` workflow:
ultragoal owns the durable cross-session ledger; bkit drives the in-session multi-agent execution.

## Verification

```bash
$ claude plugin list | grep -A 3 bkit
❯ bkit@bkit-marketplace
    Version: 2.1.17
    Scope: user
    Status: ✔ enabled
```

## Prerequisites met

- Claude Code runtime 2.1.123+ (current install satisfies)
- Optional: `export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` to enable parallel agent teams
