import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faSliders } from '@fortawesome/free-solid-svg-icons';
import FiltersMenu from './FiltersMenu';
import styles from './MobileFiltersSheet.module.scss';

const MobileFiltersSheet = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles['overlay']}
      className={styles['sheet']}
      ariaHideApp={false}
    >
      <div className={styles['header']}>
        <div className={styles['title']}>
          <FontAwesomeIcon icon={faSliders} />
          <h3>Filtros</h3>
        </div>
        <button className={styles['close']} onClick={onClose} aria-label="Cerrar filtros">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <div className={styles['body']}>
        <FiltersMenu />
      </div>

      <div className={styles['footer']}>
        <button className={styles['primary']} onClick={onClose}>
          Ver resultados
        </button>
      </div>
    </Modal>
  );
};

export default MobileFiltersSheet;