// admin/js/cloudinary-upload.js

// --- Cloudinary Configuration ---
const CLOUDINARY_CLOUD_NAME = 'duxkzhbro'; // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'giseles_blog_unsigned'; // Replace with your unsigned upload preset name
// --- ---

document.addEventListener('DOMContentLoaded', () => {
    const imageUploadInput = document.getElementById('imageUpload');
    const uploadButton = document.getElementById('uploadButton');
    const uploadStatusEl = document.getElementById('uploadStatus');
    const thumbnailPreviewEl = document.getElementById('thumbnailPreview');
    const postThumbnailUrlInput = document.getElementById('postThumbnailUrl');

    if (uploadButton) {
        uploadButton.addEventListener('click', async () => {
            if (!imageUploadInput || !imageUploadInput.files || imageUploadInput.files.length === 0) {
                if (uploadStatusEl) uploadStatusEl.textContent = 'Please select an image file first.';
                return;
            }

            const file = imageUploadInput.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            if (uploadStatusEl) uploadStatusEl.textContent = 'Uploading...';

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.error) {
                    console.error('Cloudinary Upload Error:', data.error.message);
                    if (uploadStatusEl) uploadStatusEl.textContent = `Error: ${data.error.message}`;
                    return;
                }

                console.log('Cloudinary Upload Success:', data);
                if (uploadStatusEl) uploadStatusEl.textContent = 'Upload successful!';
                
                if (postThumbnailUrlInput) postThumbnailUrlInput.value = data.secure_url; // Or data.url
                
                if (thumbnailPreviewEl) {
                    thumbnailPreviewEl.src = data.secure_url;
                    thumbnailPreviewEl.style.display = 'block';
                }

            } catch (error) {
                console.error('Network or other error during upload:', error);
                if (uploadStatusEl) uploadStatusEl.textContent = 'Upload failed. Check console.';
            }
        });
    }
});