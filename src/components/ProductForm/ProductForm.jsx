import { useState } from 'react';
import { createProduct } from '../../services/products';
import { uploadImage } from '../../utils/imageUpload';
import styles from './ProductForm.module.scss';

const ProductForm = ({ onProductCreated }) => {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    price: '',
    cost: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update form field values
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Submit new product to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate image path
      const imageInfo = await uploadImage(imageFile);

      // Create product data object
      const productData = {
        category: formData.category,
        subCategory: formData.category,
        name: formData.name,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        img: imageInfo.path,
      };

      // Save to Firestore
      await createProduct(productData);
      
      // Show instructions to user
      alert(`Producto creado exitosamente!\n\n${imageInfo.message}`);
      
      // Reset form
      setFormData({ category: '', name: '', price: '', cost: '' });
      setImageFile(null);
      
      // Notify parent component
      if (onProductCreated) onProductCreated();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['form-container']}>
      <h2>Crear Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className={styles['product-form']}>
        <div className={styles['form-group']}>
          <label>Categoría</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Ej: bebidas, kiosco"
            required
          />
        </div>

        <div className={styles['form-group']}>
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div className={styles['form-group']}>
          <label>Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Precio de venta"
            step="0.01"
            required
          />
        </div>

        <div className={styles['form-group']}>
          <label>Costo</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="Precio de costo"
            step="0.01"
            required
          />
        </div>

        <div className={styles['form-group']}>
          <label>Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imageFile && <span className={styles['file-name']}>{imageFile.name}</span>}
        </div>

        <button type="submit" disabled={loading} className={styles['submit-button']}>
          {loading ? 'Creando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;