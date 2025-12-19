import { useState } from 'react';
import { updateProductPrice, updateProductCost } from '../../services/products';
import { faPenToSquare, faTrash, faShoppingCart, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ItemListContainer.module.scss';

const ProductCard = ({ item, isAuthenticated, onDelete, onAddToCart }) => {
  // Estado autónomo por tarjeta
  const [count, setCount] = useState(1);

  const [showPriceEdit, setShowPriceEdit] = useState(false);
  const [newPrice, setNewPrice] = useState('');

  const [showCostEdit, setShowCostEdit] = useState(false);
  const [newCost, setNewCost] = useState('');

  const savePrice = async () => {
    const parsed = parseFloat(newPrice);
    if (!parsed) return;

    try {
      await updateProductPrice(item.id, parsed);
      setShowPriceEdit(false);
      setNewPrice('');
    } catch {
      alert('Error updating price.');
    }
  };

  const saveCost = async () => {
    const parsed = parseFloat(newCost);
    if (!parsed) return;

    try {
      await updateProductCost(item.id, parsed);
      setShowCostEdit(false);
      setNewCost('');
    } catch {
      alert('Error updating cost.');
    }
  };

  const priceStr = (item.price ?? '').toString();
  const costStr = (item.cost ?? '').toString();

  return (
    <div className={styles['card']}>
      {isAuthenticated && (
        <button
          onClick={() => onDelete(item.id)}
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

            {showPriceEdit ? (
              <div className={styles['price-edit-wrapper']}>
                <span className={styles['currency']}>$</span>
                <input
                  type="number"
                  className={styles['price-input']}
                  value={newPrice || item.price}
                  onChange={(e) => setNewPrice(e.target.value)}
                  onBlur={() => {
                    if (newPrice && newPrice !== priceStr) savePrice();
                    else {
                      setShowPriceEdit(false);
                      setNewPrice('');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') savePrice();
                    else if (e.key === 'Escape') {
                      setShowPriceEdit(false);
                      setNewPrice('');
                    }
                  }}
                  autoFocus
                  placeholder={item.price}
                />
              </div>
            ) : (
              <div
                className={styles['price-display']}
                onClick={() => {
                  if (!isAuthenticated) return;
                  setShowPriceEdit(true);
                  setNewPrice(priceStr);
                }}
              >
                <span className={styles['price-main']}>${item.price}</span>
                {isAuthenticated && (
                  <FontAwesomeIcon icon={faPenToSquare} className={styles['edit-icon']} />
                )}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className={styles['cost-section']}>
              <label className={styles['cost-label']}>Costo</label>

              {showCostEdit ? (
                <div className={styles['cost-edit-wrapper']}>
                  <span className={styles['currency-small']}>$</span>
                  <input
                    type="number"
                    className={styles['cost-input']}
                    value={newCost || item.cost}
                    onChange={(e) => setNewCost(e.target.value)}
                    onBlur={() => {
                      if (newCost && newCost !== costStr) saveCost();
                      else {
                        setShowCostEdit(false);
                        setNewCost('');
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveCost();
                      else if (e.key === 'Escape') {
                        setShowCostEdit(false);
                        setNewCost('');
                      }
                    }}
                    autoFocus
                    placeholder={item.cost}
                  />
                </div>
              ) : (
                <div
                  className={styles['cost-display']}
                  onClick={() => {
                    setShowCostEdit(true);
                    setNewCost(costStr);
                  }}
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
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              className={styles['stepper-btn']}
              aria-label="Disminuir cantidad"
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>

            <span className={styles['stepper-value']}>{count}</span>

            <button
              onClick={() => setCount((c) => c + 1)}
              className={styles['stepper-btn']}
              aria-label="Aumentar cantidad"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <button onClick={() => onAddToCart(item, count)} className={styles['btn-primary']}>
            <FontAwesomeIcon icon={faShoppingCart} />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;