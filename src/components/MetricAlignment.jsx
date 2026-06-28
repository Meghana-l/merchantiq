import { useState } from 'react';
import { METRIC_ALIGNMENT } from '../data/merchantData';

export default function MetricAlignment() {
  const [filter, setFilter] = useState('All');
  const aligned = METRIC_ALIGNMENT.filter(m => m.aligned).length;
  const misaligned = METRIC_ALIGNMENT.filter(m => !m.aligned).length;

  const filtered = filter === 'All' ? METRIC_ALIGNMENT
    : filter === 'Aligned' ? METRIC_ALIGNMENT.filter(m => m.aligned)
    : METRIC_ALIGNMENT.filter(m => !m.aligned);

  return (
    <div>
      <div className="page-title">Cross-Source Metric Alignment</div>
      <div className="page-sub">Reconciliation across MIRA · MCM ADS · Legacy EDW · Nov 2024 reporting period</div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Total Metrics</div>
          <div className="kpi-value">{METRIC_ALIGNMENT.length}</div>
          <div className="kpi-delta neutral">Tracked this period</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Fully Aligned</div>
          <div className="kpi-value" style={{ color: 'var(--green)' }}>{aligned}</div>
          <div className="kpi-delta pos">Across all 3 sources</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Misaligned</div>
          <div className="kpi-value" style={{ color: 'var(--red)' }}>{misaligned}</div>
          <div className="kpi-delta neg">Require investigation</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Alignment Rate</div>
          <div className="kpi-value">{Math.round((aligned / METRIC_ALIGNMENT.length) * 100)}%</div>
          <div className="kpi-delta neutral">Target: 100%</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Metric Reconciliation Matrix</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Aligned', 'Misaligned'].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : ''}`}
                style={filter !== f ? { border: '1px solid var(--border-strong)', background: 'white', color: 'var(--text-2)' } : {}}
                onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Unit</th>
                <th>MIRA Value</th>
                <th>MCM ADS Value</th>
                <th>Legacy EDW Value</th>
                <th>Delta</th>
                <th>Status</th>
                <th>Source of Truth</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{m.metric}</td>
                  <td><code style={{ fontSize: 11 }}>{m.unit}</code></td>
                  <td>{m.miraValue.toLocaleString()}</td>
                  <td>{m.mcmValue.toLocaleString()}</td>
                  <td style={{ color: m.legacyValue !== m.miraValue ? 'var(--red)' : 'inherit', fontWeight: m.legacyValue !== m.miraValue ? 600 : 400 }}>
                    {m.legacyValue.toLocaleString()}
                  </td>
                  <td>
                    {m.delta !== 0
                      ? <span style={{ color: 'var(--red)', fontWeight: 600 }}>{m.delta > 0 ? '+' : ''}{m.delta}</span>
                      : <span style={{ color: 'var(--green)' }}>—</span>}
                  </td>
                  <td>
                    <span className={`badge ${m.aligned ? 'badge-aligned' : 'badge-misaligned'}`}>
                      {m.aligned ? 'Aligned' : 'Misaligned'}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {m.aligned ? 'MCM ADS / MIRA' : 'MCM ADS (preferred)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Alignment Notes</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { metric: 'Total Gross Volume', note: 'Legacy EDW uses authorization date; MIRA/MCM ADS use settlement date. T+1 lag creates $23.2M structural gap for current period. Not a data error — definitional difference.', severity: 'high' },
            { metric: 'Transaction Count', note: 'Legacy EDW excludes declined authorizations from count. MIRA includes all auth attempts per network rules. Gap of 1,719K represents declined transactions.', severity: 'high' },
            { metric: 'Chargeback Rate', note: 'MCM ADS includes pre-arbitration cases; MIRA excludes. 0.002pp difference. Governance team reviewing definition alignment for Q1 2025 reporting cycle.', severity: 'medium' },
            { metric: 'Interchange Revenue', note: '$0.8M delta traced to fee schedule version mismatch (DQ-2024-0854). Resolved via lineage patch Oct 14. Legacy EDW pending refresh.', severity: 'medium' },
          ].map((n, i) => (
            <div key={i} style={{
              padding: '10px 12px',
              border: `1px solid ${n.severity === 'high' ? 'var(--orange-bg)' : 'var(--border)'}`,
              borderLeft: `3px solid ${n.severity === 'high' ? 'var(--orange)' : 'var(--text-3)'}`,
              borderRadius: 6, background: n.severity === 'high' ? 'var(--orange-bg)' : 'var(--surface-2)'
            }}>
              <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4, color: 'var(--navy)' }}>{n.metric}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6 }}>{n.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
