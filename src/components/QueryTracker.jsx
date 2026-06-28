import { useState } from 'react';
import { AD_HOC_QUERIES } from '../data/merchantData';

export default function QueryTracker() {
  const [selected, setSelected] = useState(AD_HOC_QUERIES[0]);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? AD_HOC_QUERIES : AD_HOC_QUERIES.filter(q => q.status === filter);
  const critCount = AD_HOC_QUERIES.filter(q => q.priority === 'Critical').length;
  const openCount = AD_HOC_QUERIES.filter(q => q.status !== 'Complete').length;

  return (
    <div>
      <div className="page-title">Ad-Hoc Query Tracker</div>
      <div className="page-sub">Merchant reporting requests · SQL queue · MCM ADS · MIRA · Legacy EDW</div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Total Requests</div>
          <div className="kpi-value">{AD_HOC_QUERIES.length}</div>
          <div className="kpi-delta neutral">This sprint</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Open / In Progress</div>
          <div className="kpi-value" style={{ color: 'var(--orange)' }}>{openCount}</div>
          <div className="kpi-delta neg">Pending delivery</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Critical Priority</div>
          <div className="kpi-value" style={{ color: 'var(--red)' }}>{critCount}</div>
          <div className="kpi-delta neg">Regulatory / Ops escalation</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Completed</div>
          <div className="kpi-value" style={{ color: 'var(--green)' }}>{AD_HOC_QUERIES.filter(q => q.status === 'Complete').length}</div>
          <div className="kpi-delta pos">Delivered on time</div>
        </div>
      </div>

      <div className="two-col" style={{ gap: 16 }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>Query Queue</div>
            <select className="sel" value={filter} onChange={e => setFilter(e.target.value)}>
              {['All', 'Queued', 'In Progress', 'Complete'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filtered.map(q => (
              <div
                key={q.id}
                onClick={() => setSelected(q)}
                style={{
                  padding: '10px 12px',
                  border: `1px solid ${selected?.id === q.id ? 'var(--navy)' : 'var(--border)'}`,
                  borderLeft: `3px solid ${q.priority === 'Critical' ? 'var(--red)' : q.priority === 'High' ? 'var(--orange)' : 'var(--border-strong)'}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  background: selected?.id === q.id ? '#f0f4ff' : 'var(--surface)',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{q.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{q.id} · {q.requestor}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className={`badge badge-${q.priority.toLowerCase()}`}>{q.priority}</span>
                    <span className={`badge badge-${q.status === 'In Progress' ? 'progress' : q.status.toLowerCase()}`}>{q.status}</span>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 6 }}>ETA: {q.eta} · Created: {q.created}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selected && (
            <div className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div className="card-title" style={{ marginBottom: 2 }}>{selected.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{selected.id} · Requested by {selected.requestor}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className={`badge badge-${selected.priority.toLowerCase()}`}>{selected.priority}</span>
                  <span className={`badge badge-${selected.status === 'In Progress' ? 'progress' : selected.status.toLowerCase()}`}>{selected.status}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'ETA', val: selected.eta },
                  { label: 'Created', val: selected.created },
                  { label: 'Source', val: 'MCM ADS / MIRA' },
                ].map((d, i) => (
                  <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 5, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2 }}>{d.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{d.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>SQL</div>
              <div className="sql-block">{selected.sql}</div>

              <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 5, fontSize: 11, color: 'var(--text-3)' }}>
                <strong>Lineage:</strong> {selected.id.includes('439') ? 'mcm_ads.settlements → DQ Control → EDW sync' : selected.id.includes('437') ? 'mira.summary ↔ edw.summary reconciliation check' : 'mcm_ads.transactions → mira.reporting_layer'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
