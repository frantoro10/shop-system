import React from 'react';
import styles from "./MainLayout.module.scss";

const MainLayout = ({children}) => {
  return (
    <div className={styles.mainDiv}>
      {children}
    </div>
  )
}

export default MainLayout