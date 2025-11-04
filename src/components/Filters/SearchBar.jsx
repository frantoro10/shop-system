import {useState,useContext} from 'react';
import {ProductsContext} from '../../contexts/ProductsContext';
import {Col, Container, Form, Row} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './SearchBar.module.scss';

const SearchBar = () => {
    const {products, setProducts} = useContext(ProductsContext);
    const {setFilterProducts} = useContext(ProductsContext);
    const [searchValue, setSearchValue] = useState('');

    const searchProduct = (e) => {
        const search = e.target.value.toLowerCase();
        setSearchValue(search);
        
        // Filtrados el array de productos, los valores de la propiedad "name" que coincidan con el valor ingresado en "search"
        const filteredProducts = products.filter((item) => 
            item.name.toLowerCase().includes(search) || 
            item.category.toLowerCase().includes(search)
        );
        setFilterProducts(filteredProducts);
    }

    const clearSearch = () => {
        setSearchValue('');
        setFilterProducts([]);
    }

  return (
    <div>
        <Container className={`${styles["search-container"]}`}>
            <Row>
                <Col>
                    <div className={styles["search-wrapper"]}>
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className={styles["search-icon"]}
                        />
                        <Form className={styles["search-form"]}>
                            <Form.Control
                                onChange={searchProduct}
                                value={searchValue}
                                type="search"
                                placeholder="Buscar productos o categorías..."
                                aria-label="Search"
                                className={`${styles["search-input"]}`}
                            />
                        </Form>
                        {searchValue && (
                            <button 
                                onClick={clearSearch}
                                className={styles["clear-button"]}
                                aria-label="Clear search"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default SearchBar