import React from 'react'
import styles from './FiltersMenu.module.scss'
import { ProductsContext } from '../../contexts/ProductsContext'
import { useState, useContext, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Category icons for filter menu
import { faCandyCane, faShoppingBasket, faBottleWater, faCheese, faPrescriptionBottle } from '@fortawesome/free-solid-svg-icons'


const FiltersMenu = () => {

    const { products, setProducts } = useContext(ProductsContext)
    const { filterProducts, setFilterProducts } = useContext(ProductsContext)

    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});


    const filterCategory = (e) => {
        const category = e.target.value.toLowerCase();
        const isChecked = e.target.checked;

        // Actualiza el estado de los checkbox seleccionados
        setSelectedCheckboxes((prevState) => ({
            ...prevState,
            [category]: isChecked,
        }));
    };

    useEffect(() => {
        // Filtra los productos según los checkbox seleccionados
        const filteredProducts = products.filter((item) => {
            if (Object.keys(selectedCheckboxes).length === 0) {
                // Si no hay ningún checkbox seleccionado, muestra todos los productos
                return true;
            }
            return selectedCheckboxes[item.category.toLowerCase()]
        });

        setFilterProducts(filteredProducts);
        
    }, [selectedCheckboxes, setFilterProducts, products]);


    return (
        <div className={styles['filter-wrapper']}>
            <div className={styles['filter-menu']}>
                <label className={styles['checkbox-label']}>
                    <input 
                        className={styles['checkbox-input']} 
                        type="checkbox" 
                        name="category" 
                        value="kiosco" 
                        onChange={filterCategory} 
                        checked={selectedCheckboxes['kiosco'] || false} 
                    />
                    <span className={styles['checkbox-text']}>
                        <FontAwesomeIcon icon={faCandyCane} className={styles['category-icon']} />
                        Kiosco
                    </span>
                </label>
                <label className={styles['checkbox-label']}>
                    <input 
                        className={styles['checkbox-input']} 
                        type="checkbox" 
                        name="category" 
                        value="almacen" 
                        onChange={filterCategory} 
                        checked={selectedCheckboxes['almacen'] || false} 
                    />
                    <span className={styles['checkbox-text']}>
                        <FontAwesomeIcon icon={faShoppingBasket} className={styles['category-icon']} />
                        Almacen
                    </span>
                </label>
                <label className={styles['checkbox-label']}>
                    <input 
                        className={styles['checkbox-input']} 
                        type="checkbox" 
                        name="category" 
                        value="bebidas" 
                        onChange={filterCategory} 
                        checked={selectedCheckboxes['bebidas'] || false} 
                    />
                    <span className={styles['checkbox-text']}>
                        <FontAwesomeIcon icon={faBottleWater} className={styles['category-icon']} />
                        Bebidas
                    </span>
                </label>
                <label className={styles['checkbox-label']}>
                    <input 
                        className={styles['checkbox-input']} 
                        type="checkbox" 
                        name="category" 
                        value="lacteos" 
                        onChange={filterCategory} 
                        checked={selectedCheckboxes['lacteos'] || false} 
                    />
                    <span className={styles['checkbox-text']}>
                        <FontAwesomeIcon icon={faCheese} className={styles['category-icon']} />
                        Lacteos
                    </span>
                </label>
                <label className={styles['checkbox-label']}>
                    <input 
                        className={styles['checkbox-input']} 
                        type="checkbox" 
                        name="category" 
                        value="farmacia" 
                        onChange={filterCategory} 
                        checked={selectedCheckboxes['farmacia'] || false} 
                    />
                    <span className={styles['checkbox-text']}>
                        <FontAwesomeIcon icon={faPrescriptionBottle} className={styles['category-icon']} />
                        Farmacia
                    </span>
                </label>
            </div>
        </div>
    )
}

export default FiltersMenu


{/* <ul>
<li>
    <label>
        <input type="checkbox" name="brand" value="cervezas" onChange={filterCategory} checked={selectedCheckboxes['cervezas'] || false}  />
        <span>Cervezas</span>
    </label>
</li>
<li>
    <label>
        <input type="checkbox" name="brand" value="gaseosas" onChange={filterCategory} checked={selectedCheckboxes['gaseosas'] || false} />
        <span>Gaseosas</span>
    </label>
</li>
<li>
    <label>
        <input type="checkbox" name="brand" value="corsair" onChange={filterCategory} checked={selectedCheckboxes['corsair'] || false} />
        <span>Latas de cerveza</span>
    </label>
</li>
<li>
    <label>
        <input type="checkbox" name="brand" value="intel" onChange={filterCategory} checked={selectedCheckboxes['intel'] || false} />
        <span>Latas de gaseosas</span>
    </label>
</li>
{/* <li>
    <label>
        <input type="checkbox" name="brand" value="adata" onChange={filterCategory} checked={selectedCheckboxes['adata'] || false} />
        Adata
    </label>
</li> */}
// </ul> */}