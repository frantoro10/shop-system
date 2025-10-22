import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import styles from "./MainLayout.module.scss";

const MainLayout = ({children}) => {
  const { logout, user } = useContext(AuthContext);

  // Handle logout button click
  const handleLogout = async () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      await logout();
    }
  };

  return (
    <div className={styles.mainDiv}>
      {/* Logout button in top right corner */}
      {user && (
        <div className={styles['logout-container']}>
          <span className={styles['user-email']}>{user.email}</span>
          <button onClick={handleLogout} className={styles['logout-button']}>
            Cerrar Sesión
          </button>
        </div>
      )}
      {children}
    </div>
  )
}

export default MainLayout