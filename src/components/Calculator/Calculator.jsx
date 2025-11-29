import Modal from 'react-modal';
import { useState, useContext } from 'react';
import { ProductsContext } from '../../contexts/ProductsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faX, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import styles from './Calculator.module.scss'

const Calculator = () => {
  const [openModal, setOpenModal] = useState(false);
  const { cartProducts, removeProductCart } = useContext(ProductsContext);

  const handleShow = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const totalPrice = () => {
    return cartProducts.reduce((acc, product) => acc + product.price, 0);
  }

  return (
    <>
      {/* Trigger Button - Preserved as requested */}
      {!openModal && (
        <div className={styles["calculator-icon-wrapper"]}>
          <button 
            className={styles["calculator-trigger"]} 
            onClick={handleShow}
            aria-label="Abrir carrito"
          >
            <FontAwesomeIcon icon={faCalculator} />
            {cartProducts.length > 0 && (
              <span className={styles["cart-badge"]}>{cartProducts.length}</span>
            )}
          </button>
        </div>
      )}

      <Modal 
        isOpen={openModal} 
        onRequestClose={handleClose}
        className={styles["modal-content"]}
        overlayClassName={styles["modal-overlay"]}
        style={{
          overlay: {},
          content: {}
        }}
        ariaHideApp={false}
      >
        {/* Header */}
        <div className={styles["modal-header"]}>
          <h2>Mi Carrito</h2>
          <button 
            onClick={handleClose}
            className={styles["close-button"]}
            aria-label="Cerrar carrito"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        {/* Body */}
        <div className={styles["modal-body"]}>
          {cartProducts.length === 0 ? (
            <div className={styles["empty-state"]}>
              <div className={styles["empty-icon"]}>🛒</div>
              <h3>Tu carrito está vacío</h3>
              <p>¡Agrega productos deliciosos para comenzar!</p>
            </div>
          ) : (
            <div className={styles["cart-list"]}>
              {cartProducts.map((product) => (
                <div key={product.id} className={styles["cart-item"]}>
                  <div className={styles["item-image"]}>
                    <img src={product.img} alt={product.name} />
                  </div>
                  
                  <div className={styles["item-details"]}>
                    <h4 className={styles["item-name"]}>{product.name}</h4>
                    <div className={styles["item-meta"]}>
                      <span className={styles["item-quantity"]}>Cant: {product.quantity}</span>
                      <span className={styles["item-unit-price"]}>x ${product.unitPrice}</span>
                    </div>
                    <div className={styles["item-total"]}>
                      ${product.price}
                    </div>
                  </div>

                  <button 
                    className={styles["remove-button"]}
                    onClick={() => removeProductCart(product.id)}
                    aria-label="Eliminar producto"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartProducts.length > 0 && (
          <div className={styles["modal-footer"]}>
            <div className={styles["total-row"]}>
              <span>Total a Pagar</span>
              <span className={styles["total-amount"]}>${totalPrice()}</span>
            </div>
            <button className={styles["checkout-button"]}>
              Finalizar Compra
            </button>
          </div>
        )}
      </Modal>
    </>
  )
}

export default Calculator