import { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { updateProductPrice, updateProductCost, deleteProduct as deleteProductService } from '../../services/products';
import { ProductsContext } from '../../contexts/ProductsContext';
import { faPenToSquare, faTrash, faShoppingCart, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ItemListContainer.module.scss';
import Pagination from '../Pagination/Pagination';

const ItemListContainer = ({ productsData, onProductDeleted, isAuthenticated }) => {
  const { cartProducts, setCartProducts } = useContext(ProductsContext);

  const [productState, setProductState] = useState({});

  // Responsive items-per-page (no UI del paginador aquí)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const itemsPerPage = isMobile ? 10 : 24;

  // Slice controlado por Pagination
  const [slice, setSlice] = useState({ startIndex: 0, endIndex: itemsPerPage });
  useEffect(() => {
    setSlice({ startIndex: 0, endIndex: itemsPerPage });
  }, [itemsPerPage]);

  const currentProducts = useMemo(
    () => productsData.slice(slice.startIndex, slice.endIndex),
    [productsData, slice.startIndex, slice.endIndex]
  );

  const getProductState = (productId) => ({
    count: 1,
    showPriceEdit: false,
    showCostEdit: false,
    newPrice: '',
    newCost: '',
    ...productState[productId],
  });

  const updateProductState = (productId, updates) => {
    setProductState({
      ...productState,
      [productId]: { ...getProductState(productId), ...updates },
    });
  };

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
        { ...product, quantity: count, price: product.price * count, unitPrice: product.price },
      ]);
    }
  };

  const savePrice = async (productId) => {
    const newPrice = parseFloat(getProductState(productId).newPrice);
    if (!newPrice) return;

    try {
      await updateProductPrice(productId, newPrice);
      updateProductState(productId, { showPriceEdit: false, newPrice: '' });
    } catch {
      alert('Error updating price.');
    }
  };

  const saveCost = async (productId) => {
    const newCost = parseFloat(getProductState(productId).newCost);
    if (!newCost) return;

    try {
      await updateProductCost(productId, newCost);
      updateProductState(productId, { showCostEdit: false, newCost: '' });
    } catch {
      alert('Error updating cost.');
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await deleteProductService(productId);
      if (onProductDeleted) onProductDeleted();
      alert('Producto eliminado exitosamente!');
    } catch {
      alert('Error al eliminar el producto.');
    }
  };

  const handleSliceChange = useCallback(({ startIndex, endIndex }) => {
    setSlice((prev) =>
      prev.startIndex === startIndex && prev.endIndex === endIndex
        ? prev
        : { startIndex, endIndex }
    );
  }, []);

  return (
    <div className={styles['product-container']}>
      {currentProducts.map((item) => {
        const state = getProductState(item.id);

        return (
          <div className={styles['card']} key={item.id}>
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

            {item.category && item.category.toLowerCase() === 'oferta' && (
              <div className={styles['offer-badge']}>OFERTA</div>
            )}

            <div className={styles['image-container']}>
              <img src={item.img} alt={item.name} />
            </div>

            <div className={styles['card-content']}>
              <h3 className={styles['product-name']}>{item.name}</h3>

              <div className={styles['price-cost-container']}>
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
                          if (state.newPrice && state.newPrice !== item.price.toString()) savePrice(item.id);
                          else updateProductState(item.id, { showPriceEdit: false, newPrice: '' });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') savePrice(item.id);
                          else if (e.key === 'Escape') updateProductState(item.id, { showPriceEdit: false, newPrice: '' });
                        }}
                        autoFocus
                        placeholder={item.price}
                      />
                    </div>
                  ) : (
                    <div
                      className={styles['price-display']}
                      onClick={() =>
                        isAuthenticated &&
                        updateProductState(item.id, { showPriceEdit: true, newPrice: item.price.toString() })
                      }
                    >
                      <span className={styles['price-main']}>${item.price}</span>
                      {isAuthenticated && <FontAwesomeIcon icon={faPenToSquare} className={styles['edit-icon']} />}
                    </div>
                  )}
                </div>

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
                            if (state.newCost && state.newCost !== item.cost.toString()) saveCost(item.id);
                            else updateProductState(item.id, { showCostEdit: false, newCost: '' });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveCost(item.id);
                            else if (e.key === 'Escape') updateProductState(item.id, { showCostEdit: false, newCost: '' });
                          }}
                          autoFocus
                          placeholder={item.cost}
                        />
                      </div>
                    ) : (
                      <div
                        className={styles['cost-display']}
                        onClick={() =>
                          updateProductState(item.id, { showCostEdit: true, newCost: (item.cost || '').toString() })
                        }
                      >
                        <span className={styles['cost-value']}>${item.cost || 0}</span>
                        <FontAwesomeIcon icon={faPenToSquare} className={styles['cost-edit-icon']} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className={styles['controls-container']}>
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

                <button onClick={() => addToCart(item)} className={styles['btn-primary']}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className={styles.paginationRow}>
        <Pagination
          totalItems={productsData.length}
          itemsPerPage={itemsPerPage}
          onSliceChange={handleSliceChange}
        />
      </div>
    </div>
  );
};

export default ItemListContainer;
