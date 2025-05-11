// js/gallery.js (Public Site - Modified for Supabase)
document.addEventListener('DOMContentLoaded', async () => {
    // ... (rest of your gallery fetching logic from Supabase) ...
    // Ensure this part is correct for adding click listeners:
    images.forEach(imageConfig => {
        // ... (gallery item creation) ...
        
        imgElement.addEventListener('click', () => {
            // Pass the FULL resolution image URL and alt text
            openImageModal(imageConfig.image_url, imageConfig.alt_text || imageConfig.title || 'Gallery Image');
        });

        galleryGrid.appendChild(galleryItem);
    });
});

// openImageModal function - Let's ensure it's robust
function openImageModal(src, altText) {
    const existingModal = document.getElementById('imageModal');
    if (existingModal) {
        existingModal.remove(); // Remove any old modal to prevent issues
    }

    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modalImageCaption');
    modal.style.position = 'fixed';
    modal.style.zIndex = '2000';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.overflow = 'auto'; // Allow scrolling if image is huge (though we try to fit it)
    modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
    modal.style.display = 'flex'; // Use flexbox to center content
    modal.style.alignItems = 'center'; // Vertical centering
    modal.style.justifyContent = 'center'; // Horizontal centering
    modal.style.cursor = 'pointer';
    modal.style.opacity = '0'; // Start transparent for fade-in
    modal.style.transition = 'opacity 0.3s ease-in-out';

    const modalImg = document.createElement('img');
    modalImg.id = 'modalImage';
    modalImg.src = src; // This should be the full Cloudinary URL
    modalImg.alt = altText;
    modalImg.style.display = 'block';
    modalImg.style.maxWidth = '90vw';    // Max width relative to viewport width
    modalImg.style.maxHeight = '85vh';   // Max height relative to viewport height (leaves space for close btn/caption)
    modalImg.style.width = 'auto';       // Let browser determine width based on height constraint
    modalImg.style.height = 'auto';      // Let browser determine height based on width constraint
    modalImg.style.objectFit = 'contain';// Ensures the whole image is visible, scaled down if necessary
    modalImg.style.borderRadius = '5px'; // Optional
    modalImg.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)'; // Optional
    modalImg.style.cursor = 'default'; // Prevent modal close if clicking image itself

    const caption = document.createElement('div');
    caption.id = 'modalImageCaption';
    caption.textContent = altText;
    caption.style.position = 'absolute'; // Position caption at the bottom
    caption.style.bottom = '10px';
    caption.style.left = '0';
    caption.style.width = '100%';
    caption.style.textAlign = 'center';
    caption.style.color = '#ccc';
    caption.style.padding = '10px';
    caption.style.fontSize = '0.9em';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.setAttribute('aria-label', 'Close image viewer');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '15px';
    closeButton.style.right = '25px';
    closeButton.style.fontSize = '35px'; // Larger for easier clicking
    closeButton.style.fontWeight = 'bold';
    closeButton.style.color = '#fff';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.lineHeight = '1'; // Ensure 'x' is centered
    closeButton.style.padding = '0 5px'; // Some padding around 'x'

    // Event listeners for closing
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                 document.body.removeChild(modal);
            }
        }, 300); // Match transition duration
    };

    closeButton.onclick = closeModal;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Close only if clicking on the modal background itself
            closeModal();
        }
    });
    // Also close on Escape key
    const escapeKeyListener = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeKeyListener); // Clean up listener
        }
    };
    document.addEventListener('keydown', escapeKeyListener);


    modal.appendChild(modalImg);
    modal.appendChild(caption);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);

    // Trigger fade-in after appending to DOM
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
    });
}