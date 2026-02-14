type Row = Record<string, any>;

const isBlank = (v: any) =>
  v === null || v === undefined || (typeof v === 'string' && v.trim() === '');

const toNumber = (v: any): number | null => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v !== 'string') return null;
  const s = v.trim();
  if (!s) return null;
  const n = Number(s.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
};

const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / (a.length || 1);

const quantile = (a: number[], q: number) => {
  if (!a.length) return null;

  const b = [...a].sort((x, y) => x - y);
  const pos = (b.length - 1) * q;

  const base = Math.floor(pos);
  const rest = pos - base;

  const v0 = b[base];
  if (v0 === undefined) return null;

  const v1 = b[base + 1];
  if (v1 === undefined) return v0;

  return v0 + rest * (v1 - v0);
};

export function profileCsv(headers: string[], rows: Row[]) {
  const n = rows.length;
  const columns: any[] = [];

  for (const h of headers) {
    const values = rows.map(r => r?.[h]);
    const missing = values.filter(isBlank).length;
    const nonMissing = values.filter(v => !isBlank(v));

    const nums = nonMissing.map(toNumber).filter((x): x is number => x !== null);

    // top categories
    const freq = new Map<string, number>();
    for (const v of nonMissing.slice(0, 5000)) {
      const key = String(v).slice(0, 200);
      freq.set(key, (freq.get(key) ?? 0) + 1);
    }
    const topValues = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([value, count]) => ({ value, count }));

    let type: 'number' | 'string' = 'string';
    if (nums.length >= Math.max(5, nonMissing.length * 0.8)) type = 'number';

    const col: any = {
      name: h,
      type,
      missing,
      missingRate: n ? missing / n : 1,
      distinctApprox: new Set(nonMissing.slice(0, 5000).map(String)).size,
      topValues,
    };

    if (type === 'number') {
      const q1 = quantile(nums, 0.25);
      const q3 = quantile(nums, 0.75);
      const iqr = q1 !== null && q3 !== null ? q3 - q1 : null;
      const lower = iqr !== null && q1 !== null ? q1 - 1.5 * iqr : null;
      const upper = iqr !== null && q3 !== null ? q3 + 1.5 * iqr : null;

      col.stats = {
        min: Math.min(...nums),
        max: Math.max(...nums),
        mean: mean(nums),
        q1,
        median: quantile(nums, 0.5),
        q3,
        outlierCount:
          lower === null || upper === null
            ? null
            : nums.filter(x => x < lower || x > upper).length,
      };
    }

    columns.push(col);
  }

  return { rowCount: rows.length, columnCount: headers.length, headers, columns };
}
