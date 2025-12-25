import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';
import { COLORS } from '../constants';

export default function AdminSidebar() {
  const location = useLocation();
  return (
    <div style={{
      width: 200,
      background: COLORS.darkerAccent,
      color: '#fff',
      // height: '100vh',
      // position: 'fixed; left:0;top:0;',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 32,
      borderRadius: '0 90px 90px 0'
    }}>
  <Link to="/">
    <img src={require('../../assets/librarynicolilac.png')} alt="Ohara Library Logo" style={{ width: 100, height: 100, marginBottom: 24, borderRadius: '50%', cursor: 'pointer' }} />
  </Link>
      <h2>Ohara Library</h2>
      <div style={{ width: '100%' }}>
        <SidebarButton label="Dashboard" to="/admin-panel/dashboard" active={location.pathname === '/admin-panel/dashboard'} icon={"dashboard"} />
        <SidebarButton label="Books" to="/admin-panel/books" active={location.pathname === '/admin-panel/books'} icon={"book"}/>
      </div>
      <div style={{ flex: 1 }} />
      <SidebarButton label="Settings" to="#" active={false} icon={"setting"} />
    </div>
  );
}

function SidebarButton({ label, to, active, icon }) {
  return (
    <Link to={to} style={{
      width: '100%',
      background: active ? 'white' : 'transparent',
      color: active ? COLORS.accentColor : '#fff',
      border: 'none',
      padding: '1rem 0',
      fontWeight: active ? 700 : 500,
      fontSize: 16,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 8,
      marginBottom: 8,
      boxShadow: active ? '0 2px 8px #FF704322' : undefined,
      transition: 'background 0.2s, color 0.2s',
      textDecoration: 'none',
    }}>
      <span><Icon name={icon} /></span>
      {label}
    </Link>
  );
}
