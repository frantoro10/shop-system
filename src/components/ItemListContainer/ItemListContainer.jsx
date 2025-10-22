import { useState, useContext, useEffect } from 'react';
import { updateProductPrice, updateProductCost, deleteProduct as deleteProductService } from '../../services/products';
import { ProductsContext } from '../../contexts/ProductsContext';
import Count from '../Count/Count';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ItemListContainer.module.scss';

const ItemListContainer = ({ productsData, onProductDeleted, isAuthenticated }) => {
  const { cartProducts, setCartProducts } = useContext(ProductsContext);
  
  // State for each product: count, price editing, cost editing
  const [productState, setProductState] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 10; // 10 items per page on mobile

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset to page 1 when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [productsData]);

  // Get state for a specific product with defaults
  const getProductState = (productId) => ({
    count: 1,
    showPriceEdit: false,
    showCostEdit: false,
    newPrice: '',
    newCost: '',
    ...productState[productId],
  });

  // Update state for a specific product
  const updateProductState = (productId, updates) => {
    setProductState({
      ...productState,
      [productId]: { ...getProductState(productId), ...updates },
    });
  };

  // Add product to cart with quantity
  const addToCart = (product) => {
    const count = getProductState(product.id).count;
    const existingIndex = cartProducts.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      const updated = [...cartProducts];
      updated[existingIndex].quantity += count;
      updated[existingIndex].price += product.price * count;
      setCartProducts(updated);
    } else {
      setCartProducts([
        ...cartProducts,
        {
          ...product,
          quantity: count,
          price: product.price * count,
          unitPrice: product.price,
        },
      ]);
    }
  };

  // Save new price to Firebase
  const savePrice = async (productId) => {
    const newPrice = parseFloat(getProductState(productId).newPrice);
    if (!newPrice) return;

    try {
      await updateProductPrice(productId, newPrice);
      updateProductState(productId, { showPriceEdit: false, newPrice: '' });
    } catch (error) {
      alert('Error updating price.');
    }
  };

  // Save new cost to Firebase
  const saveCost = async (productId) => {
    const newCost = parseFloat(getProductState(productId).newCost);
    if (!newCost) return;

    try {
      await updateProductCost(productId, newCost);
      updateProductState(productId, { showCostEdit: false, newCost: '' });
    } catch (error) {
      alert('Error updating cost.');
    }
  };

  // Delete product from Firestore
  const deleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await deleteProductService(productId);
      if (onProductDeleted) onProductDeleted();
      alert('Producto eliminado exitosamente!');
    } catch (error) {
      alert('Error al eliminar el producto.');
    }
  };

  // Pagination logic
  const totalPages = isMobile ? Math.ceil(productsData.length / itemsPerPage) : 1;
  const startIndex = isMobile ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = isMobile ? startIndex + itemsPerPage : productsData.length;
  const currentProducts = isMobile ? productsData.slice(startIndex, endIndex) : productsData;

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles['product-container']}>
      {currentProducts.map((item) => {
        const state = getProductState(item.id);
        
        return (
          <div className={styles['card-container']} key={item.id}>
            <div className={styles['card-img']}>
              <img src={item.img} alt={item.name} />
            </div>
            
            <div className={`${styles['card-info']} d-flex flex-column`}>
              <span className={styles['card-name']}>{item.name}</span>
              
              {/* Price Display and Edit */}
              <div className={`${styles['price-container']} d-flex`}>
                <div className={styles['price-box']}>
                  <span>${item.price}</span>
                </div>
                {isAuthenticated && (
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => updateProductState(item.id, { showPriceEdit: !state.showPriceEdit })}
                    size="xl"
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </div>

              {/* Cost Display and Edit - Only for authenticated users */}
              {isAuthenticated && (
                <div className={`${styles['cost-container']} d-flex justify-content-center`}>
                  <span>C: ${item.cost}</span>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => updateProductState(item.id, { showCostEdit: !state.showCostEdit })}
                    size="lg"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              )}

              {/* Quantity Counter */}
              <Count
                count={state.count}
                onChangeCount={(newCount) => updateProductState(item.id, { count: newCount })}
              />
              
              <button onClick={() => addToCart(item)} className={styles['add-button']}>
                Agregar
              </button>

              {/* Delete Product Button - Only for authenticated users */}
              {isAuthenticated && (
                <button 
                  onClick={() => deleteProduct(item.id)} 
                  className={styles['delete-button']}
                >
                  Eliminar Producto
                </button>
              )}

              {/* Edit Cost Input - Only for authenticated users */}
              {isAuthenticated && state.showCostEdit && (
                <div className={styles['edit-section']}>
                  <input
                    type="number"
                    value={state.newCost}
                    onChange={(e) => updateProductState(item.id, { newCost: e.target.value })}
                    placeholder="Nuevo costo"
                    className={styles['edit-input']}
                  />
                  <button onClick={() => saveCost(item.id)} className={styles['save-button']}>
                    Guardar Costo
                  </button>
                </div>
              )}

              {/* Edit Price Input - Only for authenticated users */}
              {isAuthenticated && state.showPriceEdit && (
                <div className={styles['edit-section']}>
                  <input
                    type="number"
                    value={state.newPrice}
                    onChange={(e) => updateProductState(item.id, { newPrice: e.target.value })}
                    placeholder="Nuevo precio"
                    className={styles['edit-input']}
                  />
                  <button onClick={() => savePrice(item.id)} className={styles['save-button']}>
                    Guardar Precio
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Pagination Controls - Only on Mobile */}
      {isMobile && totalPages > 1 && (
        <div className={styles['pagination-container']}>
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
            className={styles['pagination-button']}
          >
            ← Anterior
          </button>
          
          <div className={styles['pagination-info']}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`${styles['page-number']} ${currentPage === pageNum ? styles['active'] : ''}`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            className={styles['pagination-button']}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemListContainer;
