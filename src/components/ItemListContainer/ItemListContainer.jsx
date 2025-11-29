import { useState, useContext, useEffect, useRef } from 'react';
import { updateProductPrice, updateProductCost, deleteProduct as deleteProductService } from '../../services/products';
import { ProductsContext } from '../../contexts/ProductsContext';
import Count from '../Count/Count';
import { faPenToSquare, faTrash, faShoppingCart, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ItemListContainer.module.scss';

const ItemListContainer = ({ productsData, onProductDeleted, isAuthenticated }) => {
  const { cartProducts, setCartProducts } = useContext(ProductsContext);
  
  // State for each product: count, price editing, cost editing
  const [productState, setProductState] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

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

  // Dynamic items per page based on screen size
  const itemsPerPage = isMobile ? 10 : 24; // 10 for mobile, 30 for tablet/desktop

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

  // Pagination logic - applies to all screen sizes
  const totalPages = Math.ceil(productsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = productsData.slice(startIndex, endIndex);

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
          <div className={styles['card']} key={item.id}>
            {/* Delete Icon - Top Right (Only for authenticated) */}
            {isAuthenticated && (
              <button 
                onClick={() => deleteProduct(item.id)} 
                className={styles['delete-icon']}
                aria-label="Eliminar producto"
                title="Eliminar producto"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}

            {/* Offer Badge - Top Left (Only if has special condition) */}
            {item.category && item.category.toLowerCase() === 'oferta' && (
              <div className={styles['offer-badge']}>OFERTA</div>
            )}
            
            {/* Product Image */}
            <div className={styles['image-container']}>
              <img src={item.img} alt={item.name} />
            </div>
            
            {/* Product Info */}
            <div className={styles['card-content']}>
              {/* Product Name */}
              <h3 className={styles['product-name']}>{item.name}</h3>
              
              {/* Price and Cost Container */}
              <div className={styles['price-cost-container']}>
                {/* Price Section with Inline Editing */}
                <div className={styles['price-section']}>
                  <label className={styles['price-label']}>Precio Unitario</label>
                  {state.showPriceEdit ? (
                    <div className={styles['price-edit-wrapper']}>
                      <span className={styles['currency']}>$</span>
                      <input
                        type="number"
                        className={styles['price-input']}
                        value={state.newPrice || item.price}
                        onChange={(e) => updateProductState(item.id, { newPrice: e.target.value })}
                        onBlur={() => {
                          if (state.newPrice && state.newPrice !== item.price.toString()) {
                            savePrice(item.id);
                          } else {
                            updateProductState(item.id, { showPriceEdit: false, newPrice: '' });
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            savePrice(item.id);
                          } else if (e.key === 'Escape') {
                            updateProductState(item.id, { showPriceEdit: false, newPrice: '' });
                          }
                        }}
                        autoFocus
                        placeholder={item.price}
                      />
                    </div>
                  ) : (
                    <div 
                      className={styles['price-display']}
                      onClick={() => isAuthenticated && updateProductState(item.id, { showPriceEdit: true, newPrice: item.price.toString() })}
                    >
                      <span className={styles['price-main']}>${item.price}</span>
                      {isAuthenticated && (
                        <FontAwesomeIcon 
                          icon={faPenToSquare} 
                          className={styles['edit-icon']}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Cost Display - Only for authenticated */}
                {isAuthenticated && (
                  <div className={styles['cost-section']}>
                    <label className={styles['cost-label']}>Costo</label>
                    {state.showCostEdit ? (
                      <div className={styles['cost-edit-wrapper']}>
                        <span className={styles['currency-small']}>$</span>
                        <input
                          type="number"
                          className={styles['cost-input']}
                          value={state.newCost || item.cost}
                          onChange={(e) => updateProductState(item.id, { newCost: e.target.value })}
                          onBlur={() => {
                            if (state.newCost && state.newCost !== item.cost.toString()) {
                              saveCost(item.id);
                            } else {
                              updateProductState(item.id, { showCostEdit: false, newCost: '' });
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveCost(item.id);
                            } else if (e.key === 'Escape') {
                              updateProductState(item.id, { showCostEdit: false, newCost: '' });
                            }
                          }}
                          autoFocus
                          placeholder={item.cost}
                        />
                      </div>
                    ) : (
                      <div 
                        className={styles['cost-display']}
                        onClick={() => updateProductState(item.id, { showCostEdit: true, newCost: (item.cost || '').toString() })}
                      >
                        <span className={styles['cost-value']}>${item.cost || 0}</span>
                        <FontAwesomeIcon 
                          icon={faPenToSquare} 
                          className={styles['cost-edit-icon']}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Controls Container - Stepper and Button */}
              <div className={styles['controls-container']}>
                {/* Quantity Stepper */}
                <div className={styles['stepper']}>
                  <button 
                    onClick={() => updateProductState(item.id, { count: Math.max(1, state.count - 1) })}
                    className={styles['stepper-btn']}
                    aria-label="Disminuir cantidad"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className={styles['stepper-value']}>{state.count}</span>
                  <button 
                    onClick={() => updateProductState(item.id, { count: state.count + 1 })}
                    className={styles['stepper-btn']}
                    aria-label="Aumentar cantidad"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                
                {/* Add to Cart Button - Primary Action */}
                <button onClick={() => addToCart(item)} className={styles['btn-primary']}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Pagination Controls - All screen sizes */}
      {totalPages > 1 && (
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
