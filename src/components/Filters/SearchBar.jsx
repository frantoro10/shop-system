import {useState,useContext} from 'react';
import {ProductsContext} from '../../contexts/ProductsContext';
import {Col, Container, Form, Row} from "react-bootstrap";
import styles from './SearchBar.module.scss';

const SearchBar = () => {
    const {products, setProducts} = useContext(ProductsContext);
    const {setFilterProducts} = useContext(ProductsContext);

    const searchProduct = (e) => {
        e.preventDefault();
        // Almacenamos en search valor de la barra de busqueda
        const search = e.target.value.toLowerCase();
        // Filtrados el array de productos, los valores de la propiedad "name" que coincidan con el valor ingresado en "search"
        const filteredProducts = products.filter((item) => item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search));
        // Otra manera
        // const filteredProducts = products.filter((item) => {
        //     const regex = new RegExp(search.toLowerCase(), 'g');
        //     return regex.test(item.name.toLowerCase());
        // });
        setFilterProducts(filteredProducts);
        console.log(filteredProducts);
    }

  return (
    <div>
        <Container className={`${styles["search-container"]}`}>
            <Row>
                <Col>
                    <Form>
                        <Form.Control
                            onChange={searchProduct}
                            type="search"
                            placeholder="Buscar"
                            aria-label="Search"
                            className={`${styles["search-input"]}`}
                        />
                    </Form>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default SearchBar