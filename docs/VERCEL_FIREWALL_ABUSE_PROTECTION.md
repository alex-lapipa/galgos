# GALGOS Vercel Firewall — Anonymous API Abuse Protection

Status: **live in canonical Vercel project `galgos`**

Last verified: 2026-09-01

## Purpose

GALGOS is a free, anonymous public research platform. Expensive retrieval and generation endpoints therefore need burst protection without introducing login, blocking normal human research, or bypassing the canonical infrastructure boundary.

The protection layer is implemented in **Vercel Firewall**, before requests reach application retrieval/generation. Neon remains accessible only through the Vercel application/runtime path.

## Live rules

### GALGOS Ask burst limit

- Path: `/api/ask`
- Action: rate limit
- Algorithm: fixed window
- Key: source IP
- Limit: **20 requests / 300 seconds / IP**
- Exceeded action: rate limit
- State: enabled and published

Purpose: cap bursts against AI retrieval + generation while leaving ordinary anonymous research and the Ask contract evaluator comfortably inside the limit.

### GALGOS Search burst limit

- Path: `/api/search`
- Action: rate limit
- Algorithm: fixed window
- Key: source IP
- Limit: **60 requests / 300 seconds / IP**
- Exceeded action: rate limit
- State: enabled and published

Purpose: cap embedding/retrieval bursts while preserving the full 48-case external Gold retrieval run from a single IP.

## Why fixed-window

Vercel rejected the initially considered `token_bucket` algorithm because it is Enterprise-only for the current plan. No token-bucket rule was published. The rules were recreated with the supported fixed-window algorithm, staged disabled, inspected, enabled in draft, and only then published.

## Production validation

After publication:

### Retrieval Gold

`GALGOS_BASE_URL=https://galgos.alexlawton.ai pnpm rag:eval:gold:http`

- 48 cases evaluated
- 48 expected-family hits
- 100% recall
- 0 HTTP failures / 0 rate-limit failures
- average distinct documents: 7.13
- average source-role diversity: 4.56
- worst single-document concentration: 0.20

### Ask contract

The 11-case production Ask contract sample was executed from one IP under the live firewall rule.

All 11 requests returned HTTP 200 and individually passed:

- paragraph citation coverage = 1.0;
- valid citation IDs;
- valid rendered citation markers;
- required Evidence-status conclusion;
- inspectable citation provenance.

A shell wrapper subsequently returned a local zsh error because `status` was used as a variable name; that occurred after the evaluator requests completed and is not an application or firewall failure.

## Operational rule

Do not lower these limits without rerunning the production Gold and Ask contract workloads from a single source IP. Do not add BotID to `/api/ask` or `/api/search` unless the non-browser evaluation path has first been redesigned and verified; BotID is designed to classify automated clients and could therefore block legitimate GALGOS regression testing.

## Administration

Read live rules before making changes:

```bash
vercel firewall rules list --expand --scope la-pipa-is-la-pipa
```

Firewall edits are staged until explicitly published. Always inspect draft changes before publication and prefer additive/reversible changes.

## Evidence boundary

Firewall rules are infrastructure controls only. They do not alter evidence classification, retrieval ranking, corpus truth status, claims, citations, graph semantics, or historical interpretation.
