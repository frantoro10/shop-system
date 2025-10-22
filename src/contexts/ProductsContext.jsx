import React, { createContext, useState, useEffect } from 'react';
// firebase para importar array de objetos - collection
import {getFirestore, collection, getDocs} from 'firebase/firestore';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {

  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]); //Estado para la calculadora - Modal
  const [selectedCount, setSelectedCount] = useState(1); // Estado para el contador
  const [filterProducts, setFilterProducts] = useState([]);
  // filtrado estado para sort y checkboxes
  const [filters,setFilters] = useState({
    selectedCheckboxes: {},
    // selectedSortOption: ''  (En caso de que haga componente para ordenar mayor a menor viceversa.)
  })

  const removeProductCart = (productId) => {
    setCartProducts(cartProducts.filter(product => product.id !== productId))
  }

  // Get base de datos - firebase
  useEffect(() => {
   const db = getFirestore();
   const productsCollection = collection(db, "kioscoProducts") 
    getDocs(productsCollection).then((snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data() }));
      setProducts(productsData);
    }).catch((error) => console.log(error)); 

  }, []);

  // Filtros
  useEffect (() => {
    const applyFilters = () => {

      // array de filtrado utilizando al array original "products" con un (spread ...)
      let filtered = [...products];

      // Filtrar por categorías seleccionadas
      
      // selectedCategories tiene un valor de array con todas las keys del objeto que se encuentra dentro del objeto padre filters "filters.selectedCheckboxes". Creamos el array en base a las propiedades de ese objeto con el metodo Object.keys, luego a este array lo concatenamos "." con un metodo de array "filter" para filtrar todas las propiedades y luego avanzar con las condicionales de filtro.

      // Recordar que el valor de estas propiedades se sacan del componente "FiltersMenu" en el cual esta hecha la logica para obtener estas propiedades de objeto "KEYS", consumiendo el objeto "filters" proporcionado en este contexto.

      const selectedCategories = Object.keys(filters.selectedCheckboxes).filter(
          key => filters.selectedCheckboxes[key]
      );

      // Aqui se genera la condicional en base al array de keys. Si es mayor a 0 (Si existen valores), filtramos al array filtered (que tiene los valores de los productos {objetos}). Que se filtra?, se filtra en base al array selectedCategories usando el metodo .includes para filtrar los valores que coincidan con los valores de la propiedad .title || (o) .brand

      if (selectedCategories.length > 0) {
        filtered = filtered.filter(product =>
          selectedCategories.includes(product.category.toLowerCase()) ||
          selectedCategories.includes(product.subCategory.toLowerCase())
      );
      }

      // Iniciamos la siguiente logica de filtrado en base al componente "SortSelector"

      // Aplicar ordenamiento si hay una opción seleccionada.   
      // if (filters.selectedSortOption === 'menorPrecio') {
      //     filtered.sort((a, b) => a.price - b.price);
      // } else if (filters.selectedSortOption === 'mayorPrecio') {
      //     filtered.sort((a, b) => b.price - a.price);
      // }

      // Actualizar el estado de los productos filtrados
      setFilterProducts(filtered);
  };

  applyFilters();
}, [products, filters]);

  return (
    
    <ProductsContext.Provider value={{ products, setProducts, filters, setFilters, filterProducts,setFilterProducts, cartProducts, setCartProducts, selectedCount,setSelectedCount, removeProductCart }}> 
      {children}
    </ProductsContext.Provider>
  );
};