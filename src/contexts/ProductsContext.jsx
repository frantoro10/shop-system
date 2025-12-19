import React, { createContext, useState, useEffect } from 'react';
// firebase para importar array de objetos - collection
import { fetchProducts } from '../services/products';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {

  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]); //Estado para la calculadora - Modal
  const [selectedCount, setSelectedCount] = useState(1); // Estado para el contador
  const [filterProducts, setFilterProducts] = useState([]);
  // filtrado estado para sort y checkboxes
  const [filters,setFilters] = useState({
    selectedCheckboxes: {},
    searchQuery: '',
  })

  const removeProductCart = (productId) => {
    setCartProducts(cartProducts.filter(product => product.id !== productId))
  }

  // Fetch products from Firebase
  const loadProducts = () => {
    fetchProducts()
      .then(setProducts)
      .catch((error) => console.log(error));
  };

  // Get base de datos - firebase
  useEffect(() => {
    loadProducts();
  }, []);

  // Filtros
  useEffect (() => {
    const applyFilters = () => {
      let filtered = [...products];

      const selectedCategories = Object.keys(filters.selectedCheckboxes || {}).filter(
        (key) => filters.selectedCheckboxes[key]
      );

      if (selectedCategories.length > 0) {
        filtered = filtered.filter((product) => {
          const category = (product?.category ?? '').toLowerCase();
          const subCategory = (product?.subCategory ?? '').toLowerCase();
          return selectedCategories.includes(category) || selectedCategories.includes(subCategory);
        });
      }

      const q = (filters.searchQuery || '').trim().toLowerCase();
      if (q) {
        filtered = filtered.filter((product) =>
          (product?.name || '').toLowerCase().includes(q) ||
          (product?.category || '').toLowerCase().includes(q)
        );
      }

      setFilterProducts(filtered);
    };

    applyFilters();
  }, [products, filters]);

  return (
    <ProductsContext.Provider value={{ 
      products, 
      setProducts, 
      filters, 
      setFilters, 
      filterProducts,
      setFilterProducts, 
      cartProducts, 
      setCartProducts, 
      selectedCount,
      setSelectedCount, 
      removeProductCart,
      refreshProducts: loadProducts
    }}> 
      {children}
    </ProductsContext.Provider>
  );
};