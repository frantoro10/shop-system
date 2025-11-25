import React, { useState, useContext } from 'react'
import styles from "./Home.module.scss"
import { ProductsContext } from "../contexts/ProductsContext"
import { AuthContext } from "../contexts/AuthContext"
import ItemListContainer from "../components/ItemListContainer/ItemListContainer"
import FiltersMenu from "../components/Filters/FiltersMenu"
import SearchBar from "../components/Filters/SearchBar";
import ProductForm from '../components/ProductForm/ProductForm';

const Home = () => {
  const { products, filterProducts, refreshProducts } = useContext(ProductsContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [showProductForm, setShowProductForm] = useState(false);

  // Refresh products list after creating or deleting
  const handleProductChange = () => {
    refreshProducts();
  };

  return (
    <div className={styles["page-container"]}>
      {/* Only show create product button if authenticated */}
      {isAuthenticated && (
        <div className='text-center my-4'>
          <button 
            onClick={() => setShowProductForm(!showProductForm)}
            className={styles['toggle-form-button']}
          >
            {showProductForm ? 'Cerrar Formulario' : 'Crear Nuevo Producto'}
          </button>
        </div>
      )}

      {/* Product Creation Form - only if authenticated */}
      {isAuthenticated && showProductForm && <ProductForm onProductCreated={handleProductChange} />}

      {/* Search Bar */}
      <div className='my-4'>
        <SearchBar />
      </div>

      <div className='container-fluid'>
        <div className='row flex-row'>
          <div className={` ${styles["filter-container"]} col-12 col-sm-4 col-md-4 col-lg-3 col-xl-3 col-xxl-2 d-flex justify-content-center `}>
            <FiltersMenu />
          </div>
          <div className='col-12 col-sm-8 col-md-8 col-lg-9 col-xl-9 col-xxl-10'>
            {filterProducts.length > 0 ? (
              <ItemListContainer 
                productsData={filterProducts} 
                onProductDeleted={handleProductChange}
                isAuthenticated={isAuthenticated}
              />
            ) : (
              <ItemListContainer 
                productsData={products} 
                onProductDeleted={handleProductChange}
                isAuthenticated={isAuthenticated}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home