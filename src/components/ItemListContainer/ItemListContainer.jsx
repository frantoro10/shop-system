import { useContext } from 'react';
import { deleteProduct as deleteProductService } from '../../services/products';
import { ProductsContext } from '../../contexts/ProductsContext';
import styles from './ItemListContainer.module.scss';
import Pagination from '../Pagination/Pagination';
import ProductCard from './ProductCard';
import { useProductPagination } from './useProductPagination';

const ItemListContainer = ({ productsData, onProductDeleted, isAuthenticated }) => {
  // Orquestación: carrito + paginación + render
  const { cartProducts, setCartProducts } = useContext(ProductsContext);

  const { itemsPerPage, currentProducts, handleSliceChange } = useProductPagination(productsData);

  const addToCart = (product, count) => {
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

  return (
    <div className={styles['product-container']}>
      {currentProducts.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          isAuthenticated={isAuthenticated}
          onDelete={deleteProduct}
          onAddToCart={addToCart}
        />
      ))}

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
