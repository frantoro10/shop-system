// Generate image path for manual upload
// User must manually add the image to public/images/products/ folder
export async function uploadImage(file) {
  if (!file) throw new Error('No file provided');

  // Create unique filename with timestamp to avoid duplicates
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/\s+/g, '_'); // Replace spaces with underscores
  const fileName = `${timestamp}_${cleanFileName}`;
  
  // Generate the path where the image should be placed
  const imagePath = `/images/products/${fileName}`;

  // Return path and filename for user reference
  return {
    path: imagePath,
    fileName: fileName,
    message: `Agrega manualmente la imagen a: public/images/products/${fileName}`
  };
}