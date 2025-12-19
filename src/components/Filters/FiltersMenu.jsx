import React, { useContext } from 'react';
import styles from './FiltersMenu.module.scss';
import { ProductsContext } from '../../contexts/ProductsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCandyCane, faShoppingBasket, faBottleWater, faCheese, faPrescriptionBottle } from '@fortawesome/free-solid-svg-icons';

const FiltersMenu = () => {
  const { filters, setFilters } = useContext(ProductsContext);
  const selected = filters.selectedCheckboxes || {};

  const toggle = (e) => {
    const key = e.target.value.toLowerCase();
    const isChecked = e.target.checked;

    setFilters((prev) => ({
      ...prev,
      selectedCheckboxes: { ...(prev.selectedCheckboxes || {}), [key]: isChecked },
    }));
  };

  return (
    <div className={styles['filter-wrapper']}>
      <div className={styles['filter-menu']}>
        <label className={styles['checkbox-label']}>
          <input className={styles['checkbox-input']} type="checkbox" value="kiosco" onChange={toggle} checked={!!selected['kiosco']} />
          <span className={styles['checkbox-text']}>
            <FontAwesomeIcon icon={faCandyCane} className={styles['category-icon']} />
            Kiosco
          </span>
        </label>

        <label className={styles['checkbox-label']}>
          <input className={styles['checkbox-input']} type="checkbox" value="almacen" onChange={toggle} checked={!!selected['almacen']} />
          <span className={styles['checkbox-text']}>
            <FontAwesomeIcon icon={faShoppingBasket} className={styles['category-icon']} />
            Almacen
          </span>
        </label>

        <label className={styles['checkbox-label']}>
          <input className={styles['checkbox-input']} type="checkbox" value="bebidas" onChange={toggle} checked={!!selected['bebidas']} />
          <span className={styles['checkbox-text']}>
            <FontAwesomeIcon icon={faBottleWater} className={styles['category-icon']} />
            Bebidas
          </span>
        </label>

        <label className={styles['checkbox-label']}>
          <input className={styles['checkbox-input']} type="checkbox" value="lacteos" onChange={toggle} checked={!!selected['lacteos']} />
          <span className={styles['checkbox-text']}>
            <FontAwesomeIcon icon={faCheese} className={styles['category-icon']} />
            Lacteos
          </span>
        </label>

        <label className={styles['checkbox-label']}>
          <input className={styles['checkbox-input']} type="checkbox" value="farmacia" onChange={toggle} checked={!!selected['farmacia']} />
          <span className={styles['checkbox-text']}>
            <FontAwesomeIcon icon={faPrescriptionBottle} className={styles['category-icon']} />
            Farmacia
          </span>
        </label>
      </div>
    </div>
  );
};

export default FiltersMenu;


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