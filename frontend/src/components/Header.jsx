import React from 'react';
import './Header.css';
import gastosImg from '../img/gastos.png';

const Header = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="header">
      <div className="date-badge">{formattedDate}</div>
      <h1>🧾 GastoTrack</h1>
      <img src={gastosImg} alt="grafico" className="header-image" />
    </header>
  );
};

export default Header;
