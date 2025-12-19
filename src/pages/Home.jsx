import { useState, useContext } from 'react';
import styles from './Home.module.scss';
import { ProductsContext } from '../contexts/ProductsContext';
import { AuthContext } from '../contexts/AuthContext';
import ItemListContainer from '../components/ItemListContainer/ItemListContainer';
import FiltersMenu from '../components/Filters/FiltersMenu';
import SearchBar from '../components/Filters/SearchBar';
import ProductForm from '../components/ProductForm/ProductForm';
import MobileFiltersSheet from '../components/Filters/MobileFiltersSheet';

const Home = () => {
  const { filterProducts, refreshProducts, filters } = useContext(ProductsContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [showProductForm, setShowProductForm] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);

  // Refresh products list after creating or deleting
  const handleProductChange = () => {
    refreshProducts();
  };

  const activeCount = Object.values(filters.selectedCheckboxes || {}).filter(Boolean).length;

  return (
    <div className={styles['page-container']}>
      {/* Only show create product button if authenticated */}
      {isAuthenticated && (
        <div className={styles['adminActions']}>
          <button
            onClick={() => setShowProductForm(!showProductForm)}
            className={styles['toggle-form-button']}
          >
            {showProductForm ? 'Cerrar Formulario' : 'Crear Nuevo Producto'}
          </button>
        </div>
      )}

      {/* Product Creation Form - only if authenticated */}
      {isAuthenticated && showProductForm && (
        <ProductForm onProductCreated={handleProductChange} />
      )}

      {/* Top Bar with Search and Filter Button */}
      <div className={styles['topBar']}>
        <SearchBar />

        <div className={styles['mobileToolbar']}>
          <button className={styles['filtersButton']} onClick={() => setOpenFilters(true)}>
            Filtros
            {activeCount > 0 && <span className={styles['filtersBadge']}>{activeCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <MobileFiltersSheet isOpen={openFilters} onClose={() => setOpenFilters(false)} />

      <div className={styles['content']}>
        {/* Desktop Filters Menu */}
        <aside className={styles['desktopFilters']}>
          <FiltersMenu />
        </aside>

        {/* Products Results Section */}
        <section className={styles['results']}>
          <ItemListContainer
            productsData={filterProducts}
            onProductDeleted={handleProductChange}
            isAuthenticated={isAuthenticated}
          />
        </section>
      </div>
    </div>
  );
};

export default Home;