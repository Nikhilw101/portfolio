import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Eye, Clock, Activity, Shield, RefreshCw, LogOut,
  MapPin, MousePointer, Lock, ArrowLeft, KeyRound, Award,
  CheckCircle, Settings, Monitor, Globe, Zap, BarChart2,
  Compass, Calendar, UserCheck
} from 'lucide-react';
import './SecretAdmin.css';

// ─── Helpers ────────────────────────────────────────────────────────────────
function fmtTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function fmtDate(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return `${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
}
function fmtDwell(ms) {
  if (!ms) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
function eventBadgeClass(type) {
  if (type === 'page_view') return 'badge-view';
  if (type === 'click') return 'badge-click';
  if (type === 'section_dwell') return 'badge-dwell';
  return 'badge-view';
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function SecretAdmin({ onBackToSite }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auth form
  const [authTab, setAuthTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  // In-dashboard change password
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [changeOldPw, setChangeOldPw] = useState('');
  const [changeNewPw, setChangeNewPw] = useState('');
  const [loggedEmail, setLoggedEmail] = useState('');

  // ── Fetch Stats ────────────────────────────────────────────────
  const fetchStats = useCallback(async (authToken) => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?token=${encodeURIComponent(authToken)}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data);
        setIsAuthenticated(true);
        setError('');
      } else {
        if (res.status === 401) {
          sessionStorage.removeItem('admin_token');
          setIsAuthenticated(false);
          setError('Session expired. Please sign in again.');
        } else {
          setError(data.error || 'Failed to fetch stats');
        }
      }
    } catch {
      setError('Cannot reach analytics API');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check stored session on first render
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token');
    const savedEmail = sessionStorage.getItem('admin_email');
    if (saved) {
      setToken(saved);
      if (savedEmail) setLoggedEmail(savedEmail);
      fetchStats(saved);
    }
  }, [fetchStats]);

  // Auto-refresh every 15s
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    const id = setInterval(() => fetchStats(token), 15000);
    return () => clearInterval(id);
  }, [isAuthenticated, token, fetchStats]);

  // ── Login ──────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg(''); setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: email.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('admin_email', email.trim());
        setToken(data.token);
        setLoggedEmail(email.trim());
        setIsAuthenticated(true);
        fetchStats(data.token);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Authentication server error');
    } finally {
      setLoading(false);
    }
  };

  // ── Reset Password (from login screen) ────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg(''); setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          email: email.trim(),
          password: securityAnswer,
          securityAnswer,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Password reset! You can now sign in.');
        setAuthTab('login');
        setPassword(''); setNewPassword(''); setSecurityAnswer('');
      } else {
        setError(data.error || 'Reset failed');
      }
    } catch {
      setError('Error processing reset');
    } finally {
      setLoading(false);
    }
  };

  // ── Change Password (from dashboard) ──────────────────────────
  const handleChangePw = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg(''); setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          email: loggedEmail,
          password: changeOldPw,
          newPassword: changeNewPw,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Password changed successfully!');
        setChangeOldPw(''); setChangeNewPw('');
        setShowSecurityPanel(false);
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch {
      setError('Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_email');
    setToken(''); setIsAuthenticated(false); setStats(null);
  };

  // ─────────────────────────────────────────────────────────────
  // LOGIN / RESET SCREEN
  // ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="admin-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ padding: '1.25rem 1.5rem' }}>
          <button onClick={onBackToSite} className="btn-admin">
            <ArrowLeft size={15} /> Back to Portfolio
          </button>
        </div>

        <div className="login-box">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '0.8rem', borderRadius: '50%', background: 'rgba(56,189,248,0.1)', marginBottom: '0.75rem' }}>
              <Shield size={36} color="#38bdf8" />
            </div>
            <div className="login-title">Analytics Dashboard</div>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.25rem 0 0' }}>
              Portfolio Admin · MongoDB Atlas
            </p>
          </div>

          <div className="auth-tab-group">
            <button
              className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthTab('login'); setError(''); setSuccessMsg(''); }}
            >
              <Lock size={14} /> Sign In
            </button>
            <button
              className={`auth-tab-btn ${authTab === 'reset' ? 'active' : ''}`}
              onClick={() => { setAuthTab('reset'); setError(''); setSuccessMsg(''); }}
            >
              <KeyRound size={14} /> Reset Password
            </button>
          </div>

          {error && <div className="alert-error">{error}</div>}
          {successMsg && <div className="alert-success">{successMsg}</div>}

          {authTab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" className="input-field" value={email}
                  onChange={e => setEmail(e.target.value)} autoComplete="email" required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" className="input-field" value={password}
                  onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
              </div>
              <button type="submit" className="btn-admin btn-admin-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }} disabled={loading}>
                {loading ? <RefreshCw size={16} className="spin" /> : <Lock size={16} />} Sign In
              </button>
            </form>
          )}

          {authTab === 'reset' && (
            <form onSubmit={handleResetPassword}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" className="input-field" value={email}
                  onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Current Password or Security Answer</label>
                <input type="text" className="input-field" value={securityAnswer}
                  onChange={e => setSecurityAnswer(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>New Password</label>
                <input type="password" className="input-field" value={newPassword}
                  onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-admin btn-admin-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }} disabled={loading}>
                {loading ? <RefreshCw size={16} className="spin" /> : <CheckCircle size={16} />} Save New Password
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // DASHBOARD SCREEN
  // ─────────────────────────────────────────────────────────────
  const s = stats?.summary || {};
  const maxDwellSec = Math.max(...(stats?.sectionHeatmap?.map(x => x.seconds) || [0]), 1);

  return (
    <div className="admin-container">

      {/* ── HEADER ── */}
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Analytics Dashboard</h1>
          <p>MongoDB Atlas · {loggedEmail}</p>
        </div>
        <div className="admin-header-actions">
          <div className="badge-live">
            <span className="pulse-dot" />
            {s.liveActiveVisitors ?? 0} Live
          </div>
          <button onClick={() => fetchStats(token)} className="btn-admin" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button onClick={() => { setShowSecurityPanel(v => !v); setError(''); setSuccessMsg(''); }} className="btn-admin">
            <Settings size={15} /> Security
          </button>
          <button onClick={onBackToSite} className="btn-admin">
            <ArrowLeft size={15} /> Portfolio
          </button>
          <button onClick={handleLogout} className="btn-admin btn-danger">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {successMsg && <div className="alert-success">{successMsg}</div>}

      {/* ── CHANGE PASSWORD PANEL ── */}
      {showSecurityPanel && (
        <div className="panel-card" style={{ marginBottom: '1.5rem', borderColor: 'rgba(56,189,248,0.35)' }}>
          <div className="panel-title"><KeyRound size={17} color="#38bdf8" /> Change Password</div>
          <form onSubmit={handleChangePw}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label>Current Password</label>
              <input type="password" className="input-field" value={changeOldPw}
                onChange={e => setChangeOldPw(e.target.value)} required />
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label>New Password</label>
              <input type="password" className="input-field" value={changeNewPw}
                onChange={e => setChangeNewPw(e.target.value)} required />
            </div>
            <button type="submit" className="btn-admin btn-admin-primary"
              style={{ padding: '0.75rem 1.25rem' }} disabled={loading}>
              Update
            </button>
          </form>
        </div>
      )}

      {/* ── SUMMARY CARDS ── */}
      <div className="stats-grid">
        <StatCard icon={<Users size={21} />} color="#38bdf8"
          value={s.totalUniqueVisitors ?? 0} label="Unique Visitors" />
        <StatCard icon={<Eye size={21} />} color="#818cf8"
          value={s.totalPageViews ?? 0} label="Total Page Views" />
        <StatCard icon={<Zap size={21} />} color="#4ade80"
          value={s.liveActiveVisitors ?? 0} label="Active Now" />
        <StatCard icon={<Clock size={21} />} color="#fb923c"
          value={`${s.avgDwellSeconds ?? 0}s`} label="Avg Dwell / Visitor" />
      </div>

      {/* ── TRAFFIC SOURCES & UNIQUE VISITORS DIRECTORY ── */}
      <div className="dashboard-grid">

        {/* Traffic Sources */}
        <div className="panel-card">
          <div className="panel-title"><Compass size={17} color="#38bdf8" /> Traffic Sources (Where Users Came From)</div>
          {stats?.trafficSources?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.trafficSources.map((src, i) => {
                const total = s.totalUniqueVisitors || 1;
                const pct = Math.round((src.count / total) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600 }}>{src.source}</span>
                      <span style={{ color: '#38bdf8', fontWeight: 700 }}>{src.count} user{src.count !== 1 ? 's' : ''} ({pct}%)</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${Math.max(5, pct)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState text="No traffic source data recorded yet." />
          )}
        </div>

        {/* Click Interactions */}
        <div className="panel-card">
          <div className="panel-title"><MousePointer size={17} color="#818cf8" /> Button & Link Clicks</div>
          {stats?.clickInteractions?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {stats.clickInteractions.map((item, i) => (
                <div key={i} className="click-card">
                  <div className="click-card-label" title={item.target}>{item.target}</div>
                  <div className="click-card-value">{item.count}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>click{item.count !== 1 ? 's' : ''}</div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="No button clicks recorded yet." />
          )}
        </div>
      </div>

      {/* ── UNIQUE USERS DIRECTORY ── */}
      <div className="panel-card" style={{ marginBottom: '1.5rem' }}>
        <div className="panel-title"><UserCheck size={17} color="#4ade80" /> Unique User Directory (IDs, Visit Counts & Activity)</div>
        {stats?.uniqueVisitorsList?.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="activity-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Visit Count</th>
                  <th>1st Time Visited</th>
                  <th>Latest Visited</th>
                  <th>Traffic Source</th>
                  <th>Location</th>
                  <th>Device / OS</th>
                </tr>
              </thead>
              <tbody>
                {stats.uniqueVisitorsList.map((usr, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{
                        background: 'rgba(56,189,248,0.15)',
                        color: '#38bdf8',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '0.3rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        fontSize: '0.82rem'
                      }}>
                        {usr.visitorId}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        background: 'rgba(74,222,128,0.15)',
                        color: '#4ade80',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {usr.visitCount} Visit{usr.visitCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {fmtDate(usr.firstSeen)}
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {fmtDate(usr.lastSeen)}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#e2e8f0' }}>
                        {usr.trafficSource}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {usr.location?.city || '—'}, {usr.location?.country || '—'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {usr.device?.os || '—'} · {usr.device?.browser || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState text="No unique user profiles created yet." />
        )}
      </div>

      {/* ── ROW 2: Heatmap + Geolocation ── */}
      <div className="dashboard-grid">

        {/* Section Heatmap */}
        <div className="panel-card">
          <div className="panel-title"><BarChart2 size={17} color="#38bdf8" /> Section Attention (seconds)</div>
          {stats?.sectionHeatmap?.length > 0 ? (
            <div className="bar-list">
              {stats.sectionHeatmap.map((sec, i) => (
                <div key={i}>
                  <div className="bar-item-header">
                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>#{sec.section}</span>
                    <span style={{ color: '#94a3b8' }}>{sec.seconds}s &nbsp;·&nbsp; {sec.views} session{sec.views !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill"
                      style={{ width: `${Math.max(4, Math.min(100, (sec.seconds / maxDwellSec) * 100))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="No section dwell data yet." />
          )}
        </div>

        {/* Geolocation */}
        <div className="panel-card">
          <div className="panel-title"><MapPin size={17} color="#4ade80" /> Visitor Locations (IP-derived)</div>
          {stats?.locationBreakdown?.length > 0 ? (
            <table className="activity-table">
              <thead><tr><th>Country</th><th>City</th><th>Visitors</th></tr></thead>
              <tbody>
                {stats.locationBreakdown.map((loc, i) => (
                  <tr key={i}>
                    <td>{loc.country}</td>
                    <td>{loc.city}</td>
                    <td style={{ fontWeight: 700, color: '#38bdf8' }}>{loc.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState text="No geolocation data available yet." />
          )}
        </div>
      </div>

      {/* ── ROW 3: Recruiter Leads ── */}
      {stats?.recruiterLeads?.length > 0 && (
        <div className="panel-card" style={{ marginBottom: '1.5rem' }}>
          <div className="panel-title"><Award size={17} color="#fb923c" /> High-Intent Visitors (Resume Download or 60s+ Dwell)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {stats.recruiterLeads.map((rec, i) => (
              <div key={i} style={{ background: 'rgba(15,23,42,0.6)', padding: '0.85rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {rec.location?.city || '—'}, {rec.location?.country || '—'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.2rem', fontFamily: 'monospace', fontWeight: 600 }}>
                    ID: {rec._id}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Triggers: {(rec.triggers || []).join(', ') || 'N/A'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge-tag badge-click">Recruiter</span>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem' }}>{fmtTime(rec.lastActive)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RECENT EVENT LOG ── */}
      <div className="panel-card">
        <div className="panel-title"><Activity size={17} color="#c084fc" /> Recent Event Log (Last 25)</div>
        {stats?.recentActivity?.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User ID & Visit #</th>
                  <th>Event</th>
                  <th>Target / Section</th>
                  <th>Dwell</th>
                  <th>Source</th>
                  <th>Location</th>
                  <th>OS · Browser</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((act, i) => (
                  <tr key={i}>
                    <td style={{ color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {fmtTime(act.timestamp)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{
                          background: 'rgba(56,189,248,0.12)',
                          color: '#38bdf8',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '0.25rem',
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          fontSize: '0.78rem'
                        }}>
                          {act.visitorId || 'ANON'}
                        </span>
                        {act.visitNumber && (
                          <span style={{
                            fontSize: '0.7rem',
                            color: act.isFirstVisit ? '#4ade80' : '#94a3b8',
                            fontWeight: 600
                          }}>
                            {act.isFirstVisit ? '1st visit' : `v#${act.visitNumber}`}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge-tag ${eventBadgeClass(act.eventType)}`}>
                        {act.eventType}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{act.target || '—'}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {fmtDwell(act.dwellTimeMs)}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                      {act.trafficSource || act.referrer || 'Direct'}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {act.location?.city || '—'}, {act.location?.country || '—'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {act.os || act.deviceType || '—'}
                      {act.browser ? ` · ${act.browser}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState text="No events logged yet. Visit the portfolio to generate data." />
        )}
      </div>

      <div style={{ textAlign: 'center', color: '#334155', fontSize: '0.75rem', marginTop: '1.5rem', paddingBottom: '1rem' }}>
        Last refreshed: {stats?.generatedAt ? new Date(stats.generatedAt).toLocaleTimeString() : '—'} · Auto-refreshes every 15s
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatCard({ icon, color, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: `${color}22`, color }}>
        {icon}
      </div>
      <div className="stat-val">{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 1rem' }}>
      <Globe size={28} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
      <div>{text}</div>
    </div>
  );
}

