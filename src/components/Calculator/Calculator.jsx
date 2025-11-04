import Modal from 'react-modal';
import { useState, useEffect, useContext } from 'react';
import { ProductsContext } from '../../contexts/ProductsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faX } from '@fortawesome/free-solid-svg-icons'
import styles from './Calculator.module.scss'

const Calculator = () => {
  const [openModal, setOpenModal] = useState(false); // Estado para controlar la visibilidad del modal. Se pasa como atributo al componente <Modal isOpen={openModal}> 
  const { cartProducts, removeProductCart } = useContext(ProductsContext); // Accedemos al array del carrito de productos


  const handleShow = () => {
    setOpenModal(true);
  } // Boton para mostrar modal (true)

  const handleClose = () => {
    setOpenModal(false);
  } // Boton para ocultar modal (false)

  const totalPrice = () => {
    let allPrices = 0;
    cartProducts.forEach((product) => {
      allPrices += product.price;
    })
    return (allPrices)
  }


  return (
    <div>
      {/* Only show calculator icon when modal is closed */}
      {!openModal && (
        <div className={styles["calculator-icon-wrapper"]}>
          <FontAwesomeIcon icon={faCalculator} size="xl" className={` ${styles["calculator-icon"]}`} onClick={handleShow} />
          {cartProducts.length > 0 && (
            <span className={styles["cart-badge"]}>{cartProducts.length}</span>
          )}
        </div>
      )}

      {/* Modal with proper overlay styling */}
      <Modal 
        isOpen={openModal} 
        className={`${styles["modal"]}`}
        overlayClassName={styles["modal-overlay"]}
      >
        <button 
          onClick={handleClose}
          className={styles["close-button"]}
          aria-label="Cerrar carrito"
        >
          <FontAwesomeIcon icon={faX} />
        </button>

        <div className={`${styles["total-price"]}`}>
          <p>Total: <span>${totalPrice()}</span> </p>
        </div>
        
        {cartProducts.length === 0 ? (
          <div className={styles["empty-cart"]}>
            <p>🛒</p>
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos para comenzar tu compra</p>
          </div>
        ) : (
          cartProducts.map((product) => {
            return (
                     
                <div key={product.id} className={`${styles["calculator-product"]} d-flex flex-column`}>
                <div className={`${styles["product-xIcon"]}`}>
                  <FontAwesomeIcon icon={faX} onClick={() => removeProductCart(product.id)} size="xl" />
                </div>
                  <img src={product.img} alt="Producto del Kiosco" />
                  <div className="d-flex flex-column">
                    <span>{product.name}</span>
                    <span>Precio unidad: <span>${product.unitPrice}</span></span> {/* unitPrice es agregado en ItemListContainer no en Firebase */}
                    <span>Precio cantidad: <span className={`${styles["quantity-price"]}`}>${product.price}</span></span>
                    <span>Cantidad: <span className={`${styles["quantity-price"]}`} >{product.quantity}</span></span>
                  </div>
                </div>
              
            )
          })
        )}
      </Modal>

    </div>
  )
}

export default Calculator