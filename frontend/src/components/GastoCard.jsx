import React from 'react';
import styles from '../styles/GastoCard.module.css';

const GastoCard = ({ gasto, onDelete, onEdit }) => {
  const esConsumo = gasto.tipo === 'consumo';
  const estadoClase = gasto.anticipado ? styles.pendiente : styles.pagada;
  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      onDelete(gasto._id);
    }
  };

  const handleEdit = () => {
    onEdit(gasto);
  };

  return (
    <div className={`${styles.card} ${estadoClase}`}>
      <div className={styles.content}>
        <div className={styles.filaSuperior}>
          <div className={styles.fecha}>
            {gasto.anticipado ? '⏳ Pendiente' : '💸 Pagada' } · 📅 {new Date(gasto.fecha).toLocaleDateString()}
          </div>
          <div className={styles.botones}>
            <button
              className={`${styles.boton} ${styles.editar}`}
              onClick={handleEdit}
              title="Editar"
            >
              ✏️
            </button>
            <button
              className={`${styles.boton} ${styles.eliminar}`}
              onClick={handleDelete}
              title="Eliminar"
            >
              ❌
            </button>
          </div>
        </div>

        <div className={styles.filaIntermedia}>
          <div className={styles.nombre}>{gasto.nombre}</div>
          <div className={styles.monto}>💰 {gasto.monto} €</div>
        </div>

        <div className={styles.filaInferior}>
          {gasto.categoria && (
            <div className={styles.categoria}>🏷️ {gasto.categoria}</div>
          )}
          {esConsumo && gasto.cantidad && (
            <div className={styles.consumo}>
              ⚡ {gasto.cantidad} {gasto.unidad || ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GastoCard;