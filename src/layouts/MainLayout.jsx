import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./MainLayout.module.scss";
import { AuthContext } from '../contexts/AuthContext';
import Calculator from '../components/Calculator/Calculator';

const MainLayout = ({children}) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className={styles.mainDiv}>
      {/* Sticky Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Brand Logo */}
          <div className={styles.brandSection} onClick={() => navigate('/')}>
            <img src="/images/brand/bigbull-logo2.png" alt="Big Bull Logo" /> 
          </div>

          {/* Actions Section */}
          <div className={styles.actionsSection}>
            {/* Calculator/Cart Button */}
            <div className={styles.calculatorWrapper}>
              <Calculator />
            </div>

            {/* Auth Button */}
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className={`${styles.authButton} ${styles.logoutButton}`}
              >
                Cerrar Sesión
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className={styles.authButton}
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}

export default MainLayout