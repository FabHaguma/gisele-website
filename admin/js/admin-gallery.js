// admin/js/admin-gallery.js
document.addEventListener('DOMContentLoaded', async () => {
    // Ensure supabaseClient is available
    if (typeof supabaseClient === 'undefined') {
        console.error('Supabase client (supabaseClient) is not defined. Make sure supabase-client.js is loaded and initialized correctly.');
        alert('Supabase client is not available. Admin functionality may not work.');
        return;
    }

    // --- Cloudinary Configuration (ensure cloudinary-upload.js has these too, or centralize) ---
    // These are needed here IF cloudinary-upload.js doesn't expose them globally
    // or if you want this script to be self-contained for Cloudinary part.
    // It's better if cloudinary-upload.js handles its own config.
    const CLOUDINARY_CLOUD_NAME_GALLERY = 'duxkzhbro'; // From cloudinary-upload.js
    const CLOUDINARY_UPLOAD_PRESET_GALLERY = 'gisele_gallery_uploads'; // From cloudinary-upload.js

    // --- DOM Elements ---
    const galleryImageForm = document.getElementById('galleryImageForm');
    const galleryImageIdInput = document.getElementById('galleryImageId');
    const galleryImageUploadInput = document.getElementById('galleryImageUpload');
    const galleryUploadToCloudinaryBtn = document.getElementById('galleryUploadToCloudinaryBtn');
    const galleryUploadStatusEl = document.getElementById('galleryUploadStatus');
    const galleryImagePreviewEl = document.getElementById('galleryImagePreview');
    const galleryImageUrlInput = document.getElementById('galleryImageUrl');
    const galleryImageTitleInput = document.getElementById('galleryImageTitle');
    const galleryImageAltTextInput = document.getElementById('galleryImageAltText');
    const galleryImageSortOrderInput = document.getElementById('galleryImageSortOrder');
    const galleryIsPublicCheckbox = document.getElementById('galleryIsPublic');
    const saveGalleryImageBtn = document.getElementById('saveGalleryImageBtn');
    const cancelEditGalleryBtn = document.getElementById('cancelEditGalleryBtn');
    const galleryFormStatusEl = document.getElementById('galleryFormStatus');

    const galleryTableBody = document.getElementById('galleryTableBody');
    const loadingGalleryMsg = document.getElementById('loadingGalleryMsg');

    // Display user email (from auth.js, but good to have a fallback or ensure auth.js runs first)
    const userEmailSpan = document.getElementById('userEmail');
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session && session.user && userEmailSpan) {
            userEmailSpan.textContent = session.user.email;
        } else if (userEmailSpan) {
            userEmailSpan.textContent = 'Not logged in';
            // Potentially redirect here if auth.js hasn't already
        }
    });


    // --- Utility Functions ---
    function displayGalleryStatus(message, isError = false) {
        if (galleryFormStatusEl) {
            galleryFormStatusEl.textContent = message;
            galleryFormStatusEl.className = isError ? 'error-message status-message' : 'success-message status-message';
            setTimeout(() => { galleryFormStatusEl.textContent = ''; }, 5000);
        }
    }

    function resetGalleryForm() {
        galleryImageForm.reset();
        galleryImageIdInput.value = '';
        galleryImageUrlInput.value = ''; // Clear readonly field too
        if (galleryImagePreviewEl) galleryImagePreviewEl.style.display = 'none';
        if (galleryUploadStatusEl) galleryUploadStatusEl.textContent = '';
        saveGalleryImageBtn.textContent = 'Save Gallery Image';
        if (cancelEditGalleryBtn) cancelEditGalleryBtn.style.display = 'none';
    }

    // --- Cloudinary Upload Logic (adapted from cloudinary-upload.js) ---
    if (galleryUploadToCloudinaryBtn) {
        galleryUploadToCloudinaryBtn.addEventListener('click', async () => {
            if (!galleryImageUploadInput || !galleryImageUploadInput.files || galleryImageUploadInput.files.length === 0) {
                if (galleryUploadStatusEl) galleryUploadStatusEl.textContent = 'Please select an image file first.';
                return;
            }

            const file = galleryImageUploadInput.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET_GALLERY); // Use specific preset

            if (galleryUploadStatusEl) galleryUploadStatusEl.textContent = 'Uploading to Cloudinary...';

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME_GALLERY}/image/upload`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.error) {
                    console.error('Cloudinary Upload Error:', data.error.message);
                    if (galleryUploadStatusEl) galleryUploadStatusEl.textContent = `Error: ${data.error.message}`;
                    return;
                }
                if (galleryUploadStatusEl) galleryUploadStatusEl.textContent = 'Cloudinary upload successful!';
                if (galleryImageUrlInput) galleryImageUrlInput.value = data.secure_url;
                if (galleryImagePreviewEl) {
                    galleryImagePreviewEl.src = data.secure_url;
                    galleryImagePreviewEl.style.display = 'block';
                }
            } catch (error) {
                console.error('Network or other error during Cloudinary upload:', error);
                if (galleryUploadStatusEl) galleryUploadStatusEl.textContent = 'Cloudinary upload failed. Check console.';
            }
        });
    }

    // --- Load Gallery Images for Table ---
    async function loadGalleryImages() {
        if (loadingGalleryMsg) loadingGalleryMsg.style.display = 'block';
        if (galleryTableBody) galleryTableBody.innerHTML = '';

        try {
            const { data: images, error } = await supabaseClient
                .from('gallery_images')
                .select('*')
                .order('sort_order', { ascending: true, nullsFirst: false }) // Show ordered items first
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching gallery images:', error);
                if (loadingGalleryMsg) loadingGalleryMsg.textContent = 'Error loading gallery images.';
                return;
            }

            if (loadingGalleryMsg) loadingGalleryMsg.style.display = 'none';

            if (images && images.length > 0) {
                images.forEach(img => {
                    const row = galleryTableBody.insertRow();

                    // --- Create a Cloudinary thumbnail URL ---
                    let thumbnailUrl = img.image_url; // Default to original if transformation fails
                    if (img.image_url && img.image_url.includes('res.cloudinary.com')) {
                        // Example transformation: width 100, height 100, crop to fill, good quality
                        // You can adjust these parameters:
                        // w_100 = width 100px
                        // h_100 = height 100px
                        // c_fill = crop mode 'fill' (maintains aspect ratio, crops if needed to fill dimensions)
                        // c_thumb = another good crop mode for thumbnails
                        // g_auto = gravity auto for cropping
                        // q_auto:good = good quality
                        const transformations = 'w_100,h_100,c_fill,g_auto,q_auto:good';
                        
                        // Find the /upload/ part and insert transformations
                        const parts = img.image_url.split('/upload/');
                        if (parts.length === 2) {
                            thumbnailUrl = `${parts[0]}/upload/${transformations}/${parts[1]}`;
                        }
                    }
                    // --- End Thumbnail URL creation ---

                    row.innerHTML = `
                        <td><img src="${thumbnailUrl}" alt="${img.alt_text || 'Gallery image'}" class="table-thumbnail"></td>
                        <td>${img.title || 'N/A'}</td>
                        <td>${img.alt_text || 'N/A'}</td>
                        <td>${img.is_public ? 'Yes' : 'No'}</td>
                        <td>${img.sort_order !== null ? img.sort_order : 'N/A'}</td>
                        <td>
                            <button data-id="${img.id}" class="action-btn edit-btn">Edit</button>
                            <button data-id="${img.id}" class="action-btn delete-btn">Delete</button>
                        </td>
                    `;
                });
                addGalleryActionListeners(); // Ensure this is called after rows are added
            } else {
                if (galleryTableBody) galleryTableBody.innerHTML = '<tr><td colspan="6">No gallery images found. Add some!</td></tr>';
            }
        } catch (err) {
            console.error('Unexpected error loading gallery images:', err);
            if (loadingGalleryMsg) loadingGalleryMsg.textContent = 'Unexpected error.';
        }
    }

    // --- Add/Edit Gallery Image ---
    if (galleryImageForm) {
        galleryImageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const imageId = galleryImageIdInput.value;

            const imageData = {
                image_url: galleryImageUrlInput.value,
                title: galleryImageTitleInput.value || null,
                alt_text: galleryImageAltTextInput.value || null,
                sort_order: galleryImageSortOrderInput.value ? parseInt(galleryImageSortOrderInput.value) : null,
                is_public: galleryIsPublicCheckbox.checked
            };

            if (!imageData.image_url) {
                displayGalleryStatus('Image URL (from Cloudinary) is required.', true);
                return;
            }

            try {
                let responseError;
                if (imageId) { // Editing
                    const { error } = await supabaseClient
                        .from('gallery_images')
                        .update(imageData)
                        .eq('id', imageId);
                    responseError = error;
                } else { // Adding new
                    const { error } = await supabaseClient
                        .from('gallery_images')
                        .insert([imageData]);
                    responseError = error;
                }

                if (responseError) {
                    console.error('Error saving gallery image:', responseError);
                    displayGalleryStatus(`Error: ${responseError.message}`, true);
                } else {
                    displayGalleryStatus('Gallery image saved successfully!', false);
                    resetGalleryForm();
                    await loadGalleryImages(); // Refresh table
                }
            } catch (err) {
                console.error('Unexpected error saving gallery image:', err);
                displayGalleryStatus('An unexpected error occurred.', true);
            }
        });
    }

    if (cancelEditGalleryBtn) {
        cancelEditGalleryBtn.addEventListener('click', () => {
            resetGalleryForm();
        });
    }

    // --- Event Listeners for Edit/Delete Buttons in Table ---
    function addGalleryActionListeners() {
        const editButtons = galleryTableBody.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const imageId = e.target.dataset.id;
                await populateFormForEdit(imageId);
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see form
            });
        });

        const deleteButtons = galleryTableBody.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const imageId = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this gallery image?')) {
                    try {
                        const { error } = await supabaseClient
                            .from('gallery_images')
                            .delete()
                            .eq('id', imageId);

                        if (error) {
                            console.error('Error deleting gallery image:', error);
                            alert('Error: ' + error.message);
                        } else {
                            alert('Gallery image deleted.');
                            await loadGalleryImages(); // Refresh
                        }
                    } catch (err) {
                        console.error('Unexpected error deleting:', err);
                        alert('An unexpected error occurred.');
                    }
                }
            });
        });
    }

    async function populateFormForEdit(imageId) {
        try {
            const { data: img, error } = await supabaseClient
                .from('gallery_images')
                .select('*')
                .eq('id', imageId)
                .single();

            if (error || !img) {
                console.error('Error fetching image for edit:', error);
                displayGalleryStatus('Could not load image data for editing.', true);
                return;
            }

            galleryImageIdInput.value = img.id;
            galleryImageUrlInput.value = img.image_url;
            galleryImageTitleInput.value = img.title || '';
            galleryImageAltTextInput.value = img.alt_text || '';
            galleryImageSortOrderInput.value = img.sort_order !== null ? img.sort_order : '0';
            galleryIsPublicCheckbox.checked = img.is_public;

            if (galleryImagePreviewEl && img.image_url) {
                galleryImagePreviewEl.src = img.image_url;
                galleryImagePreviewEl.style.display = 'block';
            }
            saveGalleryImageBtn.textContent = 'Update Gallery Image';
            if (cancelEditGalleryBtn) cancelEditGalleryBtn.style.display = 'inline-block';

        } catch (err) {
            console.error('Unexpected error populating form:', err);
        }
    }


    // --- Initial Load ---
    if (galleryTableBody) { // Only load if on the manage-gallery page
        await loadGalleryImages();
    }
});