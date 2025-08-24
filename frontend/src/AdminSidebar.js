import React from 'react';
import { Icon } from 'semantic-ui-react'

export default function AdminSidebar({ activePane, setActivePane }) {
  return (
    <div style={{
      width: 180,
      background: '#7c4dff',
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 32,
      boxShadow: '2px 0 12px #a084ca22',
    }}>
      <img src={require('../assets/librarynicolilac.png')} alt="Ohara Library Logo" style={{ width: 100, height: 100, marginBottom: 24, borderRadius: '50%' }} />
      <h2>Ohara Library</h2>
      <div style={{ width: '100%' }}>
        <SidebarButton label="Dashboard" active={activePane === 'dashboard'} onClick={() => setActivePane('dashboard')} icon={"dashboard"} />
        <SidebarButton label="Books" active={activePane === 'books'} onClick={() => setActivePane('books')} icon={"book"}/>
      </div>
      <div style={{ flex: 1 }} />
      <SidebarButton label="Settings" active={activePane === 'settings'} onClick={() => setActivePane('settings')} icon={"setting"} />
    </div>
  );
}

function SidebarButton({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: active ? '#fff' : 'transparent',
        color: active ? '#7c4dff' : '#fff',
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
        boxShadow: active ? '0 2px 8px #a084ca22' : undefined,
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      <span><Icon name={icon} /></span>
      {label}
    </button>
  );
}
