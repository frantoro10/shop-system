import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from "./Home.module.scss"
import { ProductsContext } from "../contexts/ProductsContext"
import { AuthContext } from "../contexts/AuthContext"
import ItemListContainer from "../components/ItemListContainer/ItemListContainer"
import FiltersMenu from "../components/Filters/FiltersMenu"
import SearchBar from "../components/Filters/SearchBar";
import Calculator from '../components/Calculator/Calculator';
import ProductForm from '../components/ProductForm/ProductForm';

const Home = () => {

  const navigate = useNavigate();
  const { products, filterProducts, refreshProducts } = useContext(ProductsContext);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [showProductForm, setShowProductForm] = useState(false);

  // Refresh products list after creating or deleting
  const handleProductChange = () => {
    refreshProducts();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className=''>
      <div className={`${styles["brand-container"]} mt-1 d-flex flex-row  align-items-center justify-content-center`}>
        <img src="/images/brand/big-bull.webp" alt="" />
        <h1 className='mb-2 ms-2 ' style={{ fontSize: "2em" }}>Big Bull</h1>
        
        {/* Login/Logout Button */}
        <div className={styles['auth-button-container']}>
          {isAuthenticated ? (
            null /* Logout button removed as per recent edits */
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className={styles['auth-button']}
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
      
      {/* Only show calculator if authenticated */}
      {isAuthenticated && (
        <div className={`${styles["calculator-container"]}`}>
          <Calculator/>
        </div>
      )}

      {/* Only show create product button if authenticated */}
      {isAuthenticated && (
        <div className='text-center my-3'>
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

      <div className='my-3'>
        <SearchBar />
      </div>

      <div className='container-fluid border '>
        <div className='row flex-row'>
          <div className={` ${styles["filter-container"]} col-12 col-md-1  d-flex justify-content-center `}>
            <FiltersMenu />
          </div>
          <div className='col-12 col-md-11'>
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