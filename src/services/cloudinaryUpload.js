// Cloudinary unsigned image upload service
// Short English comments only.
export async function uploadProductImage(file) {
    if (!file) throw new Error('No file provided');

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const base = import.meta.env.VITE_CLOUDINARY_BASE_URL || 'https://api.cloudinary.com/v1_1';
    
    // Debug: Log configuration (remove after testing)
    console.log('🔧 Cloudinary Config:', {
        cloudName,
        preset,
        base,
        hasFile: !!file,
        fileSize: file.size,
        fileType: file.type
    });
    
    if (!cloudName || !preset) {
        throw new Error('Missing Cloudinary configuration');
    }

    // Basic client side validation
    const maxBytes = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxBytes) {
        throw new Error('File too large (max 2MB)');
    }
    if (!/^image\//.test(file.type)) {
        throw new Error('Invalid file type');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    formData.append('folder', 'products');

    console.log('📤 Uploading to:', `${base}/${cloudName}/image/upload`);

    const res = await fetch(`${base}/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    });

    console.log('📥 Response status:', res.status);

    if (!res.ok) {
        const text = await res.text();
        console.error('❌ Upload failed:', text);
        throw new Error('Cloudinary upload failed: ' + text);
    }

    const data = await res.json();
    return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format
    };
}