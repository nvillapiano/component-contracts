#!/usr/bin/env bash

# Validate Component Token Usage
#
# This script ensures all component CSS files use ONLY component tokens,
# not semantic or primitive tokens directly.
#
# Exits with status 1 if violations are found, 0 if all checks pass.

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS=0

echo "🔍 Validating component token usage..."
echo ""

# Define forbidden token patterns (semantic and primitive)
# These should NEVER appear in component CSS files
# NOTE: Structural tokens (space-*, radius-*, duration-*, text-size-*, border-width-*, weight-*) are OK
# NOTE: System tokens (focus-ring-*, surface-default) are OK
FORBIDDEN_PATTERNS=(
  "var(--ds-brand-[0-9]"     # Semantic brand color tokens (brand-500, etc.)
  "var(--ds-error-[0-9]"     # Semantic error color tokens
  "var(--ds-neutral-[0-9]"   # Semantic neutral color tokens
  "var(--ds-red-[0-9]"       # Primitive red color tokens
  "var(--ds-blue-[0-9]"      # Primitive blue color tokens
  "var(--ds-green-[0-9]"     # Primitive green color tokens
)

# Find all component CSS files
CSS_FILES=$(find apps/web apps/web-components -name "*.css" \
  \( -path "*/components/*" -o -path "*/molecules/*" \) \
  2>/dev/null || true)

if [ -z "$CSS_FILES" ]; then
  echo "⚠️  No component CSS files found"
  exit 0
fi

for file in $CSS_FILES; do
  # Extract component name from path
  COMPONENT=$(basename "$(dirname "$file")")

  # Check each forbidden pattern
  for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
    # Skip checks if this is a component-specific token
    # e.g., --ds-button-text- is OK, but --ds-text- is not
    COMPONENT_PATTERN="var(--ds-${COMPONENT}-"

    if grep -q "$pattern" "$file"; then
      # Make sure it's not a component-specific token
      if ! grep "$pattern" "$file" | grep -q "$COMPONENT_PATTERN"; then
        echo -e "${RED}✗ ${file}${NC}"
        echo "  Found forbidden token pattern: ${pattern}"
        grep -n "$pattern" "$file" | grep -v "$COMPONENT_PATTERN" | head -3 | sed 's/^/    Line: /'
        echo ""
        VIOLATIONS=$((VIOLATIONS + 1))
      fi
    fi
  done
done

if [ $VIOLATIONS -eq 0 ]; then
  echo -e "${GREEN}✓ All component CSS files use correct token hierarchy${NC}"
  exit 0
else
  echo -e "${RED}✗ Found $VIOLATIONS file(s) with token usage violations${NC}"
  echo ""
  echo "Fix by:"
  echo "1. Identifying the semantic token being used (e.g., --ds-brand-500)"
  echo "2. Creating a component token in packages/tokens/src/component/{component}.tokens.json"
  echo "3. Updating the CSS to use the component token"
  echo ""
  echo "See: .claude/COMPONENT_IMPLEMENTATION_GUIDE.md"
  exit 1
fi
