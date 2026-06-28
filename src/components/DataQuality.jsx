import { useState } from 'react';
import { DATA_QUALITY_ISSUES, MERCHANTS } from '../data/merchantData';

const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export default function DataQuality() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const open = DATA_QUALITY_ISSUES.filter(i => i.status === 'Open').length;
  const inprog = DATA_QUALITY_ISSUES.filter(i => i.status === 'In Progress').length;
  const resolved = DATA_QUALITY_ISSUES.filter(i => i.status === 'Resolved').length;
  const critical = DATA_QUALITY_ISSUES.filter(i => i.severity === 'Critical').length;

  const filtered = DATA_QUALITY_ISSUES
    .filter(i => statusFilter === 'All' || i.status === statusFilter)
    .filter(i => severityFilter === 'All' || i.severity === severityFilter)
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const getMerchantName = (id) => MERCHANTS.find(m => m.id === id)?.name || id;

  return (
    <div>
      <div className="page-title">Data Quality Issue Management</div>
      <div className="page-sub">Enterprise Data Management (EDM) compliance · Lineage · Controls · Issue Tracking</div>

      <div className="kpi-row">
        <div className="kpi-card" style={{ borderLeft: '3px solid var(--critical)' }}>
          <div className="kpi-label">Open Issues</div>
          <div className="kpi-value" style={{ color: 'var(--critical)' }}>{open}</div>
          <div className="kpi-delta neg">Requires action</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '3px solid var(--orange)' }}>
          <div className="kpi-label">In Progress</div>
          <div className="kpi-value" style={{ color: 'var(--orange)' }}>{inprog}</div>
          <div className="kpi-delta neutral">Under investigation</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '3px solid var(--green)' }}>
          <div className="kpi-label">Resolved</div>
          <div className="kpi-value" style={{ color: 'var(--green)' }}>{resolved}</div>
          <div className="kpi-delta pos">This period</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '3px solid var(--red)' }}>
          <div className="kpi-label">Critical Severity</div>
          <div className="kpi-value" style={{ color: 'var(--red)' }}>{critical}</div>
          <div className="kpi-delta neg">Priority escalation</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Active Issue Queue</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="sel" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {['All', 'Open', 'In Progress', 'Resolved'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="sel" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
              {['All', 'Critical', 'High', 'Medium', 'Low'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Field / Attribute</th>
              <th>Source System</th>
              <th>Merchant</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Raised</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((issue) => (
              <>
                <tr key={issue.id} style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === issue.id ? null : issue.id)}>
                  <td><code style={{ fontSize: 11, color: 'var(--navy)' }}>{issue.id}</code></td>
                  <td><code style={{ fontSize: 11 }}>{issue.field}</code></td>
                  <td style={{ fontSize: 11 }}>{issue.source}</td>
                  <td style={{ fontSize: 11 }}>{getMerchantName(issue.merchant)}</td>
                  <td><span className={`badge badge-${issue.severity.toLowerCase()}`}>{issue.severity}</span></td>
                  <td><span className={`badge badge-${issue.status === 'In Progress' ? 'progress' : issue.status.toLowerCase()}`}>{issue.status}</span></td>
                  <td style={{ fontSize: 11, color: 'var(--text-3)' }}>{issue.owner}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-3)' }}>{issue.raised}</td>
                  <td style={{ fontSize: 11, color: 'var(--navy)', fontWeight: 600 }}>{expanded === issue.id ? '▲' : '▼'}</td>
                </tr>
                {expanded === issue.id && (
                  <tr key={`${issue.id}-exp`}>
                    <td colSpan={9} style={{ background: 'var(--surface-2)', padding: '12px 16px' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>
                        <strong>Description:</strong> {issue.description}
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>EDM Control: <strong>Data Quality</strong></div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Lineage Impact: <strong>Source → MCM ADS → MIRA</strong></div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>SLA: <strong>{issue.severity === 'Critical' ? '24hr' : issue.severity === 'High' ? '72hr' : '5 days'}</strong></div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-title">EDM Policy Compliance Status</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { policy: 'Data Quality Controls', status: 'Partial', note: '2 open High+ issues' },
            { policy: 'Metadata Integrity', status: 'Compliant', note: 'Last certified Oct 31' },
            { policy: 'Data Lineage Documentation', status: 'Compliant', note: 'MCM ADS lineage current' },
            { policy: 'Issue Management SLA', status: 'At Risk', note: 'DQ-876 approaching 72hr' },
          ].map((p, i) => (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: 6,
              background: p.status === 'Compliant' ? 'var(--green-bg)' : p.status === 'At Risk' ? 'var(--orange-bg)' : 'var(--yellow-bg)',
              border: `1px solid ${p.status === 'Compliant' ? '#9AE6B4' : p.status === 'At Risk' ? '#FBD38D' : '#F6E05E'}`
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{p.policy}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: p.status === 'Compliant' ? 'var(--green)' : p.status === 'At Risk' ? 'var(--orange)' : 'var(--yellow)' }}>{p.status}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{p.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
