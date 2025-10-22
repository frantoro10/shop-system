import { useState, useContext } from 'react';
import { updateProductPrice, updateProductCost } from '../../services/products';
import { ProductsContext } from '../../contexts/ProductsContext';
import Count from '../Count/Count';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ItemListContainer.module.scss';

const ItemListContainer = ({ productsData }) => {
  const { cartProducts, setCartProducts } = useContext(ProductsContext);
  const [newPrices, setNewPrices] = useState({});
  const [showChangePrice, setShowChangePrice] = useState({});
  const [newCostPrices, setNewCostPrices] = useState({});
  const [showCostPrices, setShowCostPrices] = useState({});
  const [productCounts, setProductCounts] = useState({});

  // Add products to the cart
  const handleAddProducts = (product) => {
    const existingProductIndex = cartProducts.findIndex((item) => item.id === product.id);
    const updatedCartProducts = [...cartProducts];
    const selectedCount = productCounts[product.id] || 1;

    if (existingProductIndex !== -1) {
      updatedCartProducts[existingProductIndex].price += product.price * selectedCount;
      updatedCartProducts[existingProductIndex].quantity += selectedCount;
    } else {
      updatedCartProducts.push({
        ...product,
        quantity: selectedCount,
        price: product.price * selectedCount,
        unitPrice: product.price,
      });
    }
    setCartProducts(updatedCartProducts);
  };

  // Update product count
  const handleChangeCount = (productId, newCount) => {
    setProductCounts({
      ...productCounts,
      [productId]: newCount,
    });
  };

  // Update product price
  const handleChangePrice = (productId, newPrice) => {
    setNewPrices({
      ...newPrices,
      [productId]: newPrice,
    });
  };

  // Toggle price change input visibility
  const toggleChangePrice = (productId) => {
    setShowChangePrice({
      ...showChangePrice,
      [productId]: !showChangePrice[productId],
    });
  };

  // Update product price in Firebase
  const changePrice = async (productId) => {
    try {
      await updateProductPrice(productId, parseFloat(newPrices[productId]));
      toggleChangePrice(productId);
    } catch (error) {
      alert('Error updating price.');
    }
  };

  // Update product cost
  const handleChangeCostPrice = (productId, newPrice) => {
    setNewCostPrices({
      ...newCostPrices,
      [productId]: newPrice,
    });
  };

  // Toggle cost change input visibility
  const toggleChangeCostPrice = (productId) => {
    setShowCostPrices({
      ...showCostPrices,
      [productId]: !showCostPrices[productId],
    });
  };

  // Update product cost in Firebase
  const changeCostPrice = async (productId) => {
    try {
      await updateProductCost(productId, parseFloat(newCostPrices[productId]));
      toggleChangeCostPrice(productId);
    } catch (error) {
      alert('Error updating cost price.');
    }
  };

  return (
    <div className={styles['product-container']}>
      {productsData.map((item) => (
        <div className={styles['card-container']} key={item.id}>
          <div className={styles['card-img']}>
            <img src={item.img} alt={item.name} />
          </div>
          <div className={`${styles['card-info']} d-flex flex-column`}>
            <span className={styles['card-name']}>{item.name}</span>
            <div className={`${styles['price-container']} d-flex`}>
              <div className={styles['price-box']}>
                <span>${item.price}</span>
              </div>
              <FontAwesomeIcon
                icon={faPenToSquare}
                onClick={() => toggleChangePrice(item.id)}
                size="xl"
                style={{ cursor: 'pointer' }}
              />
            </div>

            <div className={`${styles['cost-container']} d-flex justify-content-center`}>
              <span>C: ${item.cost}</span>
              <FontAwesomeIcon
                icon={faPenToSquare}
                onClick={() => toggleChangeCostPrice(item.id)}
                size="lg"
                style={{ cursor: 'pointer' }}
              />
            </div>

            <Count
              count={productCounts[item.id] || 1}
              onChangeCount={(newCount) => handleChangeCount(item.id, newCount)}
            />
            <button onClick={() => handleAddProducts(item)} className={styles['add-button']}>
              Add to Cart
            </button>

            {showCostPrices[item.id] && (
              <div>
                <input
                  type="number"
                  value={newCostPrices[item.id] || ''}
                  onChange={(e) => handleChangeCostPrice(item.id, e.target.value)}
                  placeholder="Enter new cost price"
                />
                <button onClick={() => changeCostPrice(item.id)}>Update Cost</button>
              </div>
            )}

            {showChangePrice[item.id] && (
              <div>
                <input
                  type="number"
                  value={newPrices[item.id] || ''}
                  onChange={(e) => handleChangePrice(item.id, e.target.value)}
                  placeholder="Enter new price"
                />
                <button onClick={() => changePrice(item.id)}>Update Price</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemListContainer;
