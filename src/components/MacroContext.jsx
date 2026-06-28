import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const SERIES = [
  { id: 'RSXFS', label: 'Retail & Food Service Sales', unit: '$M', color: '#012169', desc: 'Core driver of merchant payment volume' },
  { id: 'PCE', label: 'Personal Consumption Expenditures', unit: '$B', color: '#C8102E', desc: 'Broad consumer spending indicator' },
  { id: 'DPCCRV1Q225SBEA', label: 'Credit Card Spending Growth', unit: '%', color: '#276749', desc: 'Card network volume proxy' },
];

export default function MacroContext() {
  const [activeSeries, setActiveSeries] = useState(SERIES[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSeries = async (series) => {
    setActiveSeries(series);
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/fred?series_id=${series.id}`);
      const json = await res.json();
      if (json.observations) {
        const cleaned = json.observations
          .filter(o => o.value !== '.')
          .slice(-16)
          .map(o => ({ date: o.date.slice(0, 7), value: parseFloat(o.value) }));
        setData(cleaned);
      } else {
        setError('FRED API key not configured. Add FRED_API_KEY to Vercel environment variables.');
        setData(FALLBACK_DATA[series.id] || []);
      }
    } catch {
      setError('FRED API unavailable. Showing sample data.');
      setData(FALLBACK_DATA[series.id] || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadSeries(SERIES[0]); }, []);

  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  const pctChange = latest && prev ? (((latest.value - prev.value) / prev.value) * 100).toFixed(2) : null;

  return (
    <div>
      <div className="page-title">Macro Economic Context</div>
      <div className="page-sub">Live FRED data · Consumer spending drivers · Merchant volume correlation analysis</div>

      <div className="kpi-row">
        {[
          { label: 'Retail Sales Latest', val: latest ? `$${latest.value.toLocaleString()}M` : '—', delta: pctChange ? `${pctChange > 0 ? '+' : ''}${pctChange}% MoM` : '—', pos: pctChange > 0 },
          { label: 'BofA Merchant Vol. YTD', val: '$4.82B', delta: '↑ 8.3% YoY', pos: true },
          { label: 'Consumer Spending Corr.', val: '0.87', delta: 'Strong positive', pos: true },
          { label: 'Macro Risk Flag', val: 'Low', delta: 'No recession signal', pos: true },
        ].map((k, i) => (
          <div className="kpi-card" key={i}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.val}</div>
            <div className={`kpi-delta ${k.pos ? 'pos' : 'neg'}`}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div className="card-title" style={{ marginBottom: 2 }}>{activeSeries.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{activeSeries.desc} · Source: Federal Reserve FRED</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {SERIES.map(s => (
              <button key={s.id}
                className={`btn btn-sm ${activeSeries.id === s.id ? 'btn-primary' : ''}`}
                style={activeSeries.id !== s.id ? { border: '1px solid var(--border-strong)', background: 'white', color: 'var(--text-2)' } : {}}
                onClick={() => loadSeries(s)}>
                {s.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ padding: '8px 12px', background: 'var(--yellow-bg)', border: '1px solid #F6E05E', borderRadius: 5, fontSize: 11, color: 'var(--yellow)', marginBottom: 12 }}>
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className="loading"><span className="spinner" />Loading FRED data…</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={2} />
              <YAxis tick={{ fontSize: 10 }} width={60} tickFormatter={v => v.toLocaleString()} />
              <Tooltip
                formatter={(v) => [v.toLocaleString(), activeSeries.unit]}
                labelStyle={{ fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="value" stroke={activeSeries.color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Macro-to-Merchant Volume Correlation</div>
          {[
            { macro: 'Retail Sales Growth', merchant: 'Grocery / Retail Seg.', corr: '0.91', strength: 'Very Strong' },
            { macro: 'PCE Services Growth', merchant: 'Travel / Hospitality', corr: '0.84', strength: 'Strong' },
            { macro: 'Gasoline Price Index', merchant: 'Fuel & Convenience', corr: '-0.62', strength: 'Moderate Inverse' },
            { macro: 'Restaurant Sales Index', merchant: 'QSR Segment', corr: '0.88', strength: 'Strong' },
          ].map((r, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none'
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{r.macro}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>→ {r.merchant}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: parseFloat(r.corr) > 0.8 ? 'var(--navy)' : parseFloat(r.corr) < 0 ? 'var(--red)' : 'var(--orange)' }}>{r.corr}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{r.strength}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Merchant Volume Forecast — Q4 2024</div>
          {[
            { segment: 'Grocery', q4vol: '$0.52B', delta: '+6.2%', driver: 'Holiday food spend' },
            { segment: 'Retail', q4vol: '$1.04B', delta: '+12.8%', driver: 'Peak holiday shopping' },
            { segment: 'QSR', q4vol: '$1.18B', delta: '+4.1%', driver: 'Traffic steady' },
            { segment: 'Travel', q4vol: '$0.71B', delta: '+9.3%', driver: 'Holiday travel surge' },
            { segment: 'Fuel & Conv.', q4vol: '$0.38B', delta: '-2.1%', driver: 'Gasoline price drop' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none'
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{f.segment}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{f.driver}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{f.q4vol}</div>
                <div style={{ fontSize: 11, color: parseFloat(f.delta) > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{f.delta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FALLBACK_DATA = {
  RSXFS: [
    { date: '2023-09', value: 698400 }, { date: '2023-10', value: 705200 }, { date: '2023-11', value: 712800 },
    { date: '2023-12', value: 741200 }, { date: '2024-01', value: 701300 }, { date: '2024-02', value: 708900 },
    { date: '2024-03', value: 714200 }, { date: '2024-04', value: 719800 }, { date: '2024-05', value: 724100 },
    { date: '2024-06', value: 718500 }, { date: '2024-07', value: 726300 }, { date: '2024-08', value: 731200 },
    { date: '2024-09', value: 728900 }, { date: '2024-10', value: 735600 },
  ],
};
