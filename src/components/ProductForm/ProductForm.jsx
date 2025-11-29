import { useState } from 'react';
import { createProduct } from '../../services/products';
import { uploadProductImage } from '../../services/cloudinaryUpload';
import styles from './ProductForm.module.scss';

const ProductForm = ({ onProductCreated }) => {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    price: '',
    cost: '',
  });
  const [imageFile, setImageFile] = useState(null); // raw file
  const [imagePreview, setImagePreview] = useState(''); // local preview
  const [loading, setLoading] = useState(false); // global submit state
  const [error, setError] = useState(''); // error message
  const [uploadingImage, setUploadingImage] = useState(false); // image upload phase

  // Update form field values
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image file selection
  // Handle file selection and create preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setError("Only JPG, PNG o Webp.");
      setImageFile(null);
      setImagePreview('');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 *1024) {
      setError("La imagen no debe pesar mas de 5MB.")
      setImageFile(null);
      setImagePreview('');
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Submit new product to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let uploadedUrl = '';
    try {
      if (imageFile) {
        setUploadingImage(true);
        const result = await uploadProductImage(imageFile); // upload to Cloudinary
        uploadedUrl = result.url; // secure URL
      }

      const productData = {
        category: formData.category,
        subCategory: formData.category,
        name: formData.name,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        img: uploadedUrl, // store Cloudinary URL
      };

      await createProduct(productData); // save product
      alert('Producto creado exitosamente!');

      // Reset form state
      setFormData({ category: '', name: '', price: '', cost: '' });
      setImageFile(null);
      setImagePreview('');
      if (onProductCreated) onProductCreated();
    } catch (err) {
      console.error('Create product error:', err);
      setError(err.message || 'Error al crear el producto');
    } finally {
      setUploadingImage(false);
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
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleImageChange}
            required={true}
            disabled={loading}
          />
          {imageFile && <span className={styles['file-name']}>{imageFile.name}</span>}
          {imagePreview && (
            <div style={{ marginTop: '0.5rem' }}>
              <img src={imagePreview} alt="preview" style={{ maxWidth: '160px', borderRadius: '8px' }} />
            </div>
          )}
          {uploadingImage && <p style={{ fontSize: '0.8rem' }}>Subiendo imagen...</p>}
          {error && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error}</p>}
        </div>

        <button type="submit" disabled={loading} className={styles['submit-button']}>
          {loading ? 'Creando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;