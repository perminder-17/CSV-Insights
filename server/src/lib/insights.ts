export function heuristicInsights(profile: any, totals: { rowCount: number; columnCount: number }) {
  const cols = profile.columns as any[];

  const worstMissing = [...cols]
    .sort((a, b) => b.missingRate - a.missingRate)
    .slice(0, 3);

  const numeric = cols.filter((c) => c.type === 'number');
  const outliery = [...numeric]
    .filter((c) => c?.stats?.outlierCount !== null)
    .sort((a, b) => (b.stats.outlierCount ?? 0) - (a.stats.outlierCount ?? 0))
    .slice(0, 3);

  return [
    `# CSV Insights Report`,
    ``,
    `## Quick summary`,
    `- Rows: **${totals.rowCount}**`,
    `- Columns: **${totals.columnCount}**`,
    ``,
    `## Things that stand out`,
    ...(worstMissing.length
      ? [
          `### Missing data to review`,
          ...worstMissing.map((c) => `- **${c.name}** missing ${(c.missingRate * 100).toFixed(1)}%`),
          ``,
        ]
      : []),
    ...(outliery.length
      ? [
          `### Possible outliers (numeric)`,
          ...outliery.map((c) => `- **${c.name}** outliers ~ ${c.stats.outlierCount}`),
          ``,
        ]
      : []),
    `## What to check next`,
    `- Verify column types (numbers stored as strings?)`,
    `- Check duplicates / unique ID columns`,
    `- Validate ranges (negative values, unrealistic spikes)`,
    ``,
  ].join('\n');
}
