import { useState } from 'react';
import MIRADashboard from './components/MIRADashboard';
import MetricAlignment from './components/MetricAlignment';
import DataQuality from './components/DataQuality';
import QueryTracker from './components/QueryTracker';
import DataLineage from './components/DataLineage';
import MacroContext from './components/MacroContext';
import { BarChart2, GitMerge, ShieldCheck, Terminal, Share2, TrendingUp, Activity } from 'lucide-react';
import './App.css';

const TABS = [
  { id: 'mira', label: 'MIRA Overview', icon: BarChart2 },
  { id: 'metrics', label: 'Metric Alignment', icon: GitMerge },
  { id: 'dq', label: 'Data Quality', icon: ShieldCheck },
  { id: 'queries', label: 'Query Tracker', icon: Terminal },
  { id: 'lineage', label: 'Data Lineage', icon: Share2 },
  { id: 'macro', label: 'Macro Context', icon: TrendingUp },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('mira');

  const renderTab = () => {
    switch (activeTab) {
      case 'mira': return <MIRADashboard />;
      case 'metrics': return <MetricAlignment />;
      case 'dq': return <DataQuality />;
      case 'queries': return <QueryTracker />;
      case 'lineage': return <DataLineage />;
      case 'macro': return <MacroContext />;
      default: return null;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo-mark">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="app-name">MerchantIQ</div>
            <div className="app-sub">Global Payments Solutions · Data Strategy &amp; Governance</div>
          </div>
        </div>
        <div className="header-right">
          <div className="live-badge">
            <span className="live-dot" />
            MCM ADS · Live
          </div>
          <div className="ts">Nov 8, 2024 · 09:41 ET</div>
        </div>
      </header>

      <nav className="tab-nav">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`tab-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {renderTab()}
      </main>
    </div>
  );
}
