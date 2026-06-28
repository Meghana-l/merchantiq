import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { MERCHANTS, generateMonthlyVolume } from '../data/merchantData';

const SEGMENTS = ['All', 'Grocery', 'Retail', 'QSR', 'Travel', 'Hospitality', 'Pharmacy', 'Fuel & Convenience', 'Home Improvement'];
const COLORS = ['#012169','#C8102E','#276749','#C05621','#7B6000','#553C9A','#2C7A7B','#744210'];

const PIE_DATA = [
  { name: 'Grocery', value: 18 },
  { name: 'Retail', value: 24 },
  { name: 'QSR', value: 21 },
  { name: 'Travel', value: 12 },
  { name: 'Fuel & Conv.', value: 10 },
  { name: 'Other', value: 15 },
];

export default function MIRADashboard() {
  const [merchant, setMerchant] = useState('M001');
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const data = generateMonthlyVolume(merchant);
  const selected = MERCHANTS.find(m => m.id === merchant);

  const totalVol = (data.reduce((s, d) => s + d.volume, 0) / 1e9).toFixed(2);
  const totalTx = (data.reduce((s, d) => s + d.txCount, 0) / 1e6).toFixed(2);
  const avgDecline = (data.reduce((s, d) => s + d.declineRate, 0) / data.length).toFixed(2);
  const avgCB = (data.reduce((s, d) => s + d.chargebackRate, 0) / data.length).toFixed(3);

  const getAI = async () => {
    setLoading(true);
    setAiText('');
    const last3 = data.slice(-3);
    const prompt = `You are a Merchant Services Business Analyst at Bank of America's Global Payments Solutions team. Analyze this 3-month transaction data for ${selected.name} (${selected.segment} segment): ${JSON.stringify(last3)}. Give a 2-sentence executive insight on volume trend and chargeback risk. Be specific about numbers.`;
    try {
      const res = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const d = await res.json();
      setAiText(d.text);
    } catch {
      setAiText('AI commentary unavailable. Ensure GROQ_API_KEY is set.');
    }
    setLoading(false);
  };

  const fmt = (n) => n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : `$${(n/1e3).toFixed(0)}K`;

  return (
    <div>
      <div className="page-title">MIRA Reporting Overview</div>
      <div className="page-sub">Merchant Commerce Insight Reporting & Analytics · MCM ADS · YTD 2024</div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>Merchant:</label>
        <select className="sel" value={merchant} onChange={e => { setMerchant(e.target.value); setAiText(''); }}>
          {MERCHANTS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <span className="badge badge-low" style={{ marginLeft: 4 }}>{selected.segment}</span>
        <span className="badge badge-aligned">{selected.tier}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-3)' }}>Region: {selected.region}</span>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Gross Volume YTD</div>
          <div className="kpi-value">${totalVol}B</div>
          <div className="kpi-delta pos">↑ 8.3% vs prior year</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Transaction Count</div>
          <div className="kpi-value">{totalTx}M</div>
          <div className="kpi-delta pos">↑ 5.1% vs prior year</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg Decline Rate</div>
          <div className="kpi-value">{avgDecline}%</div>
          <div className="kpi-delta neg">↑ 0.12pp vs benchmark</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Chargeback Rate</div>
          <div className="kpi-value">{avgCB}%</div>
          <div className="kpi-delta neutral">Within EDM threshold</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>Monthly Gross Volume</div>
            <button className="btn btn-primary btn-sm" onClick={getAI} disabled={loading}>
              {loading ? <><span className="spinner" />Analyzing…</> : '✦ AI Insight'}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#012169" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#012169" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={v => `$${(v/1e6).toFixed(0)}M`} tick={{ fontSize: 10 }} width={52} />
              <Tooltip formatter={(v) => fmt(v)} labelStyle={{ fontWeight: 600 }} />
              <Area type="monotone" dataKey="volume" stroke="#012169" strokeWidth={2} fill="url(#volGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          {aiText && (
            <div className="ai-box">
              <div className="ai-label">✦ AI Variance Commentary</div>
              <div className="ai-text">{aiText}</div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Monthly Chargeback & Decline Rates</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} barGap={2}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={36} />
              <Tooltip labelStyle={{ fontWeight: 600 }} />
              <Bar dataKey="declineRate" name="Decline %" fill="#C8102E" radius={[2,2,0,0]} />
              <Bar dataKey="chargebackRate" name="Chargeback %" fill="#012169" radius={[2,2,0,0]} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Volume Share by Segment</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PIE_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${value}%`} labelLine={false}>
                {PIE_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Segment Performance Breakdown</div>
          {[
            { label: "McDonald's (QSR)", vol: '$1.09B', pct: 91 },
            { label: 'Target (Retail)', vol: '$0.94B', pct: 78 },
            { label: 'Delta (Travel)', vol: '$0.66B', pct: 55 },
            { label: 'Whole Foods (Grocery)', vol: '$0.50B', pct: 42 },
            { label: 'Home Depot (Home Impr.)', vol: '$0.76B', pct: 63 },
            { label: 'CVS (Pharmacy)', vol: '$0.34B', pct: 28 },
          ].map((s, i) => (
            <div className="seg-bar-wrap" key={i}>
              <div className="seg-bar-label">{s.label}</div>
              <div className="seg-bar-track">
                <div className="seg-bar-fill" style={{ width: `${s.pct}%`, background: COLORS[i % COLORS.length] }} />
              </div>
              <div className="seg-bar-val">{s.vol}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
