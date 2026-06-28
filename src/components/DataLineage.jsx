import { useState } from 'react';
import { LINEAGE_NODES, LINEAGE_EDGES } from '../data/merchantData';

const TYPE_COLORS = {
  source: '#553C9A',
  ingestion: '#C05621',
  processing: '#012169',
  output: '#276749',
};

const TYPE_BG = {
  source: '#f5f3ff',
  ingestion: '#fff7ed',
  processing: '#e8f0ff',
  output: '#f0fff4',
};

export default function DataLineage() {
  const [hover, setHover] = useState(null);

  const getNode = (id) => LINEAGE_NODES.find(n => n.id === id);

  const isHighlighted = (nodeId) => {
    if (!hover) return true;
    if (hover === nodeId) return true;
    return LINEAGE_EDGES.some(([a, b]) => (a === hover && b === nodeId) || (b === hover && a === nodeId));
  };

  return (
    <div>
      <div className="page-title">Data Lineage & Architecture</div>
      <div className="page-sub">MCM ADS data pipeline · Source-to-reporting traceability · EDM lineage controls</div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Merchant Data Pipeline — End-to-End Lineage</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16 }}>Hover a node to trace upstream/downstream dependencies</div>

        <svg width="100%" viewBox="0 0 700 380" style={{ display: 'block' }}>
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f2f5" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="700" height="380" fill="url(#grid)" />

          {/* Layer labels */}
          {[
            { x: 60, label: 'Source Systems', color: '#553C9A' },
            { x: 240, label: 'Ingestion Layer', color: '#C05621' },
            { x: 420, label: 'Processing & DQ', color: '#012169' },
            { x: 600, label: 'Reporting Outputs', color: '#276749' },
          ].map((l, i) => (
            <text key={i} x={l.x} y={22} textAnchor="middle" fontSize="10" fontWeight="700" fill={l.color} fontFamily="Inter, sans-serif" letterSpacing="0.5">
              {l.label.toUpperCase()}
            </text>
          ))}

          {/* Edges */}
          {LINEAGE_EDGES.map(([a, b], i) => {
            const na = getNode(a);
            const nb = getNode(b);
            if (!na || !nb) return null;
            const ax = na.x + 80;
            const ay = na.y + 22;
            const bx = nb.x;
            const by = nb.y + 22;
            const mx = (ax + bx) / 2;
            const isActive = hover && ((a === hover || b === hover));
            return (
              <path key={i}
                d={`M ${ax} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${bx} ${by}`}
                fill="none"
                stroke={isActive ? TYPE_COLORS[getNode(a).type] : '#cbd5e0'}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isActive ? 'none' : '4 3'}
                opacity={!hover || isActive ? 1 : 0.2}
              />
            );
          })}

          {/* Nodes */}
          {LINEAGE_NODES.map(node => {
            const active = isHighlighted(node.id);
            const color = TYPE_COLORS[node.type];
            const bg = TYPE_BG[node.type];
            return (
              <g key={node.id}
                className="lineage-node"
                onMouseEnter={() => setHover(node.id)}
                onMouseLeave={() => setHover(null)}
                opacity={active ? 1 : 0.25}
                transform={`translate(${node.x}, ${node.y + 30})`}
              >
                <rect width="80" height="44" rx="6" fill={hover === node.id ? color : bg} stroke={color} strokeWidth={hover === node.id ? 0 : 1.5} />
                {node.label.split('\n').map((line, li) => (
                  <text key={li} x="40" y={16 + li * 14} textAnchor="middle" fontSize="9"
                    fill={hover === node.id ? 'white' : color} fontFamily="Inter, sans-serif" fontWeight="600">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Pipeline Layer Summary</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Layer</th>
                <th>System</th>
                <th>Owner</th>
                <th>SLA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { layer: 'Source', system: 'Visa/MC Network Feed', owner: 'Technology', sla: 'T+0 real-time', status: 'Live' },
                { layer: 'Source', system: 'Merchant Onboarding DB', owner: 'Operations', sla: 'T+0 batch', status: 'Live' },
                { layer: 'Ingestion', system: 'MCM ADS Ingestion', owner: 'Technology', sla: 'T+1 6AM ET', status: 'Live' },
                { layer: 'Ingestion', system: 'Legacy EDW Extract', owner: 'Technology', sla: 'T+1 8AM ET', status: 'Migrating' },
                { layer: 'Processing', system: 'MCM ADS Core', owner: 'Data Engineering', sla: 'T+1 10AM ET', status: 'Live' },
                { layer: 'Processing', system: 'DQ Controls', owner: 'Data Governance', sla: 'T+1 10AM ET', status: 'Live' },
                { layer: 'Output', system: 'MIRA Reporting', owner: 'Analytics', sla: 'T+1 12PM ET', status: 'Live' },
              ].map((r, i) => (
                <tr key={i}>
                  <td><span style={{ fontSize: 10, fontWeight: 700, color: TYPE_COLORS[r.layer.toLowerCase()] || 'var(--text-3)' }}>{r.layer}</span></td>
                  <td style={{ fontWeight: 500 }}>{r.system}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.owner}</td>
                  <td><code style={{ fontSize: 10 }}>{r.sla}</code></td>
                  <td>
                    <span className={`badge ${r.status === 'Live' ? 'badge-aligned' : 'badge-progress'}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Metadata Integrity Checks</div>
          {[
            { check: 'MCM ADS schema version', result: 'v4.2.1 — Current', pass: true },
            { check: 'Column-level lineage coverage', result: '94.2% of critical fields', pass: true },
            { check: 'Business glossary alignment', result: '12 unmapped terms', pass: false },
            { check: 'Data classification tags', result: 'PII tags 100% complete', pass: true },
            { check: 'Retention policy flags', result: '7-year retention applied', pass: true },
            { check: 'Sensitive field masking', result: 'PAN masked in all outputs', pass: true },
            { check: 'Legacy EDW deprecation', result: 'Q1 2025 target — On track', pass: true },
          ].map((c, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: i < 6 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.check}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.result}</span>
                <span style={{ fontSize: 14 }}>{c.pass ? '✅' : '⚠️'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
