export const MERCHANTS = [
  { id: 'M001', name: 'Whole Foods Market', segment: 'Grocery', region: 'Northeast', tier: 'Enterprise' },
  { id: 'M002', name: 'Target Corporation', segment: 'Retail', region: 'Midwest', tier: 'Enterprise' },
  { id: 'M003', name: 'Shell Oil Products', segment: 'Fuel & Convenience', region: 'South', tier: 'Enterprise' },
  { id: 'M004', name: 'Marriott International', segment: 'Hospitality', region: 'West', tier: 'Strategic' },
  { id: 'M005', name: 'Delta Air Lines', segment: 'Travel', region: 'Southeast', tier: 'Strategic' },
  { id: 'M006', name: 'CVS Health', segment: 'Pharmacy', region: 'Northeast', tier: 'Enterprise' },
  { id: 'M007', name: "McDonald's Corp", segment: 'QSR', region: 'Midwest', tier: 'Enterprise' },
  { id: 'M008', name: 'Home Depot', segment: 'Home Improvement', region: 'South', tier: 'Enterprise' },
];

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function generateMonthlyVolume(merchantId) {
  const bases = { M001:42, M002:78, M003:31, M004:19, M005:55, M006:28, M007:91, M008:63 };
  const base = bases[merchantId] || 40;
  return MONTHS.map((month, i) => {
    const seed = (base * (i + 1) * 7919) % 100;
    const variance = (seed - 50) / 100;
    return {
      month,
      volume: Math.round(base * (1 + variance * 0.3) * 1e6),
      txCount: Math.round(base * (1 + variance * 0.25) * 1000),
      declineRate: parseFloat((2.1 + (seed % 20) / 100).toFixed(2)),
      chargebackRate: parseFloat((0.08 + (seed % 10) / 1000).toFixed(3)),
    };
  });
}

export const DATA_QUALITY_ISSUES = [
  { id: 'DQ-2024-0891', field: 'merchant_category_code', source: 'MIRA', severity: 'High', status: 'Open', merchant: 'M003', description: 'MCC 5541 mapped inconsistently across MCM ADS and legacy EDW. 3,412 transactions misclassified.', raised: '2024-11-02', owner: 'Data Governance' },
  { id: 'DQ-2024-0876', field: 'transaction_date', source: 'MCM ADS', severity: 'Critical', status: 'In Progress', merchant: 'M005', description: 'Settlement date vs authorization date mismatch causing T+1 reporting variance of $2.3M.', raised: '2024-10-28', owner: 'Technology' },
  { id: 'DQ-2024-0854', field: 'interchange_fee', source: 'Legacy EDW', severity: 'Medium', status: 'Resolved', merchant: 'M002', description: 'Fee schedule version mismatch between source and reporting layer. Corrected via lineage patch.', raised: '2024-10-14', owner: 'Operations' },
  { id: 'DQ-2024-0841', field: 'merchant_dba_name', source: 'MCM ADS', severity: 'Low', status: 'Open', merchant: 'M007', description: "DBA name spelling inconsistency causing deduplication failures in analytics layer.", raised: '2024-10-09', owner: 'Data Governance' },
  { id: 'DQ-2024-0829', field: 'auth_response_code', source: 'MIRA', severity: 'High', status: 'In Progress', merchant: 'M001', description: 'Response code 05 (Do Not Honor) missing from 8% of decline records in MIRA reporting layer.', raised: '2024-09-30', owner: 'Technology' },
  { id: 'DQ-2024-0812', field: 'currency_code', source: 'MCM ADS', severity: 'Medium', status: 'Resolved', merchant: 'M004', description: 'ISO 4217 currency code for EUR transactions populated as null for 241 cross-border settlements.', raised: '2024-09-22', owner: 'Data Governance' },
];

export const METRIC_ALIGNMENT = [
  { metric: 'Total Gross Volume', miraValue: 4821.3, mcmValue: 4821.3, legacyValue: 4798.1, unit: '$M', aligned: false, delta: 23.2 },
  { metric: 'Net Revenue', miraValue: 186.4, mcmValue: 186.4, legacyValue: 186.4, unit: '$M', aligned: true, delta: 0 },
  { metric: 'Transaction Count', miraValue: 94821, mcmValue: 94821, legacyValue: 93102, unit: 'K', aligned: false, delta: 1719 },
  { metric: 'Avg Ticket Size', miraValue: 50.84, mcmValue: 50.84, legacyValue: 51.56, unit: '$', aligned: false, delta: -0.72 },
  { metric: 'Decline Rate', miraValue: 2.34, mcmValue: 2.34, legacyValue: 2.34, unit: '%', aligned: true, delta: 0 },
  { metric: 'Chargeback Rate', miraValue: 0.089, mcmValue: 0.091, legacyValue: 0.089, unit: '%', aligned: false, delta: 0.002 },
  { metric: 'Interchange Revenue', miraValue: 142.7, mcmValue: 142.7, legacyValue: 141.9, unit: '$M', aligned: false, delta: 0.8 },
  { metric: 'Auth Approval Rate', miraValue: 97.66, mcmValue: 97.66, legacyValue: 97.66, unit: '%', aligned: true, delta: 0 },
];

export const AD_HOC_QUERIES = [
  { id: 'Q-0441', title: 'Q4 YoY Grocery Segment Volume', requestor: 'Sarah Chen, Merchant Risk', priority: 'High', status: 'Complete', eta: 'Nov 8', created: '2024-11-05', sql: "SELECT segment, month, year, SUM(gross_volume) as vol\nFROM mcm_ads.transactions\nWHERE segment='Grocery'\nGROUP BY segment, month, year\nORDER BY year, month" },
  { id: 'Q-0440', title: 'Chargeback Trend — QSR Merchants', requestor: 'Marcus Johnson, Operations', priority: 'Critical', status: 'In Progress', eta: 'Nov 9', created: '2024-11-07', sql: "SELECT merchant_id, reporting_month,\n  chargeback_rate, chargeback_amt\nFROM mira.cb_summary\nWHERE segment='QSR'\nORDER BY chargeback_rate DESC" },
  { id: 'Q-0439', title: 'Cross-border Settlement Null Currency Fix', requestor: 'Data Governance Team', priority: 'Medium', status: 'In Progress', eta: 'Nov 12', created: '2024-11-06', sql: "UPDATE mcm_ads.settlements\nSET currency_code = ISO_LOOKUP(country_code)\nWHERE currency_code IS NULL\n  AND settlement_type = 'CROSS_BORDER'" },
  { id: 'Q-0438', title: 'Enterprise Merchant Auth Rate by Region', requestor: 'David Park, Analytics', priority: 'Low', status: 'Queued', eta: 'Nov 15', created: '2024-11-07', sql: "SELECT region,\n  AVG(auth_approval_rate) as avg_auth_rate,\n  COUNT(merchant_id) as merchant_count\nFROM mcm_ads.auth_summary\nWHERE tier='Enterprise'\nGROUP BY region\nORDER BY avg_auth_rate ASC" },
  { id: 'Q-0437', title: 'MIRA vs Legacy EDW Volume Reconciliation', requestor: 'Regulatory Reporting', priority: 'Critical', status: 'Complete', eta: 'Nov 6', created: '2024-11-04', sql: "SELECT a.period,\n  a.gross_vol as mira_vol,\n  b.gross_vol as edw_vol,\n  (a.gross_vol - b.gross_vol) AS delta\nFROM mira.summary a\nJOIN edw.summary b ON a.period = b.period\nWHERE ABS(a.gross_vol - b.gross_vol) > 1000" },
];

export const LINEAGE_NODES = [
  { id: 'src1', label: 'Visa/MC Network Feed', type: 'source', x: 60, y: 60 },
  { id: 'src2', label: 'Merchant Onboarding DB', type: 'source', x: 60, y: 170 },
  { id: 'src3', label: 'Settlement Processor', type: 'source', x: 60, y: 280 },
  { id: 'ing1', label: 'MCM ADS Ingestion', type: 'ingestion', x: 240, y: 110 },
  { id: 'ing2', label: 'Legacy EDW Extract', type: 'ingestion', x: 240, y: 260 },
  { id: 'proc1', label: 'MCM ADS Core', type: 'processing', x: 420, y: 110 },
  { id: 'proc2', label: 'DQ Controls', type: 'processing', x: 420, y: 230 },
  { id: 'out1', label: 'MIRA Reporting', type: 'output', x: 600, y: 60 },
  { id: 'out2', label: 'Regulatory Reports', type: 'output', x: 600, y: 180 },
  { id: 'out3', label: 'Analytics Layer', type: 'output', x: 600, y: 300 },
];

export const LINEAGE_EDGES = [
  ['src1','ing1'],['src2','ing1'],['src2','ing2'],['src3','ing1'],['src3','ing2'],
  ['ing1','proc1'],['ing2','proc1'],['proc1','proc2'],
  ['proc1','out1'],['proc2','out2'],['proc1','out3'],
];
