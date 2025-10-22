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
      <div>
        <FontAwesomeIcon icon={faCalculator} size="2xl" className={` ${styles["calculator-icon"]}`} onClick={handleShow} />
      </div>

      <Modal isOpen={openModal} className={`${styles["modal"]}`}>

        <div>
          <FontAwesomeIcon icon={faX} onClick={handleClose} size="2xl" style={{marginLeft: "1rem", marginTop: "1rem"}}/>
        </div>
        <div className={`${styles["total-price"]}`}>
          <p>Total: <span>${totalPrice()}</span> </p>
        </div>
        {
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
        }
      </Modal>

    </div>
  )
}

export default Calculator