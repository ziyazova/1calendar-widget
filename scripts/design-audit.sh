#!/usr/bin/env bash
#
# design-audit.sh — grep-based audit for design-system drift.
#
# What it flags:
#   1. Raw hex color literals in code files outside allowed directories
#      (themes/ stores tokens, components/widgets/ is frozen user content).
#   2. `styled.` and `styled(` declarations inside pages/ and components/layout/
#      (pages should COMPOSE from shared, not stylize directly).
#
# Not a hard failure — reports counts and top offenders so the trend is
# visible. Wire into CI with `npm run audit:design` to watch drift over time.
#
# See SIMPLIFICATION_PLAN.md §7 (Guardrails) and CLAUDE.md (design rules).

set -eo pipefail

cd "$(dirname "$0")/.."

RED=$'\033[0;31m'
YELLOW=$'\033[0;33m'
GREEN=$'\033[0;32m'
BOLD=$'\033[1m'
RESET=$'\033[0m'

echo "${BOLD}─── Design-system audit ───${RESET}"
echo ""

# ─────────────────────────────────────────────────────────────
# 1. Raw hex literals outside themes/ and components/widgets/
# ─────────────────────────────────────────────────────────────

echo "${BOLD}1. Raw hex literals outside themes/ and components/widgets/${RESET}"

# 6-digit hexes in .ts/.tsx excluding allowed dirs.
# Passing through awk to tally per-file counts.
hex_total=0
hex_report=$(
  grep -rnE '#[0-9A-Fa-f]{6}' \
    --include='*.ts' \
    --include='*.tsx' \
    --exclude-dir='node_modules' \
    --exclude-dir='dist' \
    src/ 2>/dev/null \
  | grep -vE 'src/presentation/themes/' \
  | grep -vE 'src/presentation/components/widgets/' \
  | grep -vE 'src/test/' \
  || true
)

if [ -n "$hex_report" ]; then
  hex_total=$(echo "$hex_report" | wc -l | tr -d ' ')
  echo "  ${YELLOW}${hex_total} occurrences${RESET} (top 10 offending files):"
  echo "$hex_report" \
    | awk -F: '{print $1}' \
    | sort \
    | uniq -c \
    | sort -rn \
    | head -10 \
    | awk '{ printf "    %4d  %s\n", $1, $2 }'
else
  echo "  ${GREEN}✓ none${RESET}"
fi

echo ""

# ─────────────────────────────────────────────────────────────
# 2. styled.* declarations in pages/ and components/layout/
# ─────────────────────────────────────────────────────────────

echo "${BOLD}2. styled declarations in pages/ and components/layout/${RESET}"

styled_total=0
styled_report=$(
  grep -rnE '\b(styled\.[a-zA-Z]+|styled\()' \
    --include='*.ts' \
    --include='*.tsx' \
    --exclude-dir='node_modules' \
    --exclude-dir='dist' \
    src/presentation/pages/ \
    src/presentation/components/layout/ 2>/dev/null \
  || true
)

if [ -n "$styled_report" ]; then
  styled_total=$(echo "$styled_report" | wc -l | tr -d ' ')
  echo "  ${YELLOW}${styled_total} occurrences${RESET} (top 10 offending files):"
  echo "$styled_report" \
    | awk -F: '{print $1}' \
    | sort \
    | uniq -c \
    | sort -rn \
    | head -10 \
    | awk '{ printf "    %4d  %s\n", $1, $2 }'
else
  echo "  ${GREEN}✓ none${RESET}"
fi

echo ""
echo "${BOLD}─── Summary ───${RESET}"
echo "  Raw hex:      $hex_total"
echo "  styled in pages/: $styled_total"
echo ""
echo "  Thresholds are advisory. See TODO_AFTER_MIGRATION.md for context."
echo "  Violations are expected for legitimately-unique local patterns"
echo "  (plan §1 rule 3) — we track the trend, not zero."
