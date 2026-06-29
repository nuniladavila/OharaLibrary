import React, { useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Input, Dropdown, Button, ButtonOr, Icon, Image } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { COLORS, DARK_COLORS, COOL_FONTS } from './constants'; // Import your color constants and dark theme


function HomePageAlt() {
  const navigate = useNavigate();

  const handleAdminClick = async () => {
    const password = window.prompt('Enter admin password:');
    if (!password) return;
    localStorage.setItem('ohara_admin_pwd', password);
    navigate('/admin-panel');
  };

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
      <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
        <iframe
          src="https://crocus-pram-bbd.notion.site/ebd//38efd1abb4cf80c7962aec12e364cc1e"
          style={{ display: 'block', width: '100%', height: '100%', border: 0, margin: 0, padding: 0 }}
          allowFullScreen
        />
      </div>
      <Icon link name='lemon' className="lemon-icon" onClick={handleAdminClick} style={{ position: "absolute", left: "1rem", top: "1rem", color:COLORS.accentColor, zIndex: 2 }}/>
    </>
  );
}

export default HomePageAlt;
