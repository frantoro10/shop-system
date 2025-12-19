import { useContext } from 'react';
import { ProductsContext } from '../../contexts/ProductsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './SearchBar.module.scss';

const SearchBar = () => {
  const { filters, setFilters } = useContext(ProductsContext);
  const value = filters.searchQuery || '';

  const onChange = (e) => {
    const next = e.target.value;
    setFilters((prev) => ({ ...prev, searchQuery: next }));
  };

  const clear = () => {
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  };

  return (
    <div className={styles['search-container']}>
      <div className={styles['search-wrapper']}>
        <FontAwesomeIcon icon={faSearch} className={styles['search-icon']} />
        <input
          value={value}
          onChange={onChange}
          type="search"
          placeholder="Buscar productos…"
          aria-label="Buscar"
          className={styles['search-input']}
        />
        {value && (
          <button onClick={clear} className={styles['clear-button']} aria-label="Limpiar búsqueda">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;