// js/gallery.js
document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('galleryGrid');
    const loadingMessage = document.getElementById('gallery-loading-message');

    // 1. Check if the gallery container exists on the page
    if (!galleryGrid) {
        console.error('Gallery grid container (#galleryGrid) not found on this page.');
        if(loadingMessage) loadingMessage.textContent = 'Error: Gallery container element is missing from the HTML.';
        return; // Stop execution if the main container isn't there
    }

    // 2. Check if galleryImages is defined (it should be from gallery-config.js)
    //    and if it has any images.
    if (typeof galleryImages === 'undefined') {
        console.error('The galleryImages variable is not defined. Make sure gallery-config.js is loaded before gallery.js and defines it.');
        if (loadingMessage) loadingMessage.textContent = 'Gallery configuration is missing.';
        return;
    }
    
    if (galleryImages.length === 0) {
        console.warn('No images found in gallery-config.js (galleryImages array is empty).');
        if (loadingMessage) loadingMessage.textContent = 'No images to display at the moment. Please check back later!';
        return;
    }

    // If we have images, hide the loading message
    if (loadingMessage) loadingMessage.style.display = 'none';

    // 3. Loop through the galleryImages array and create HTML elements
    galleryImages.forEach(imageConfig => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const imgElement = document.createElement('img');
        imgElement.src = imageConfig.src;
        imgElement.alt = imageConfig.alt || 'Gallery image'; // Provide a default alt text

        // 4. Basic error handling for broken image links
        imgElement.onerror = function() {
            console.warn(`Failed to load image: ${imageConfig.src}`);
            this.alt = 'Image not available';
            // You could replace the src with a placeholder error image if you have one
            this.src = 'https://via.placeholder.com/400x300.png?text=Image+Load+Error';
            // Update overlay if it exists
            const overlay = galleryItem.querySelector('.overlay');
            if (overlay) {
                overlay.textContent = 'Error Loading Image';
            }
        };

        galleryItem.appendChild(imgElement);

        // 5. Add overlay with title if provided in config
        if (imageConfig.title) {
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            overlay.textContent = imageConfig.title;
            galleryItem.appendChild(overlay);
        }
        
        // 6. Add click listener for the simple lightbox
        imgElement.addEventListener('click', () => {
            openImageModal(imageConfig.src, imageConfig.alt || imageConfig.title || 'Gallery Image');
        });

        galleryGrid.appendChild(galleryItem);
    });
});

// 7. Simple Lightbox Modal Function (can be enhanced)
function openImageModal(src, altText) {
    // Remove existing modal if any to prevent duplicates
    const existingModal = document.getElementById('imageModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.setAttribute('role', 'dialog'); // Accessibility
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modalImageCaption'); // Link to caption for screen readers
    modal.style.position = 'fixed';
    modal.style.zIndex = '2000';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.overflow = 'auto';
    modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.cursor = 'pointer';
    modal.style.opacity = '0'; // For fade-in effect
    modal.style.transition = 'opacity 0.3s ease-in-out';

    const modalContent = document.createElement('div'); // Wrapper for image and caption
    modalContent.style.position = 'relative';
    modalContent.style.textAlign = 'center';


    const modalImg = document.createElement('img');
    modalImg.id = 'modalImage';
    modalImg.src = src;
    modalImg.alt = altText;
    modalImg.style.margin = 'auto';
    modalImg.style.display = 'block';
    modalImg.style.maxWidth = '90vw'; // Use viewport width
    modalImg.style.maxHeight = '85vh'; // Use viewport height, leave space for caption/close
    modalImg.style.borderRadius = '5px'; // Optional styling

    const caption = document.createElement('div');
    caption.id = 'modalImageCaption'; // For ARIA
    caption.textContent = altText;
    caption.style.color = '#ccc';
    caption.style.padding = '10px 0';
    caption.style.marginTop = '10px';
    caption.style.fontSize = '0.9em';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×'; // 'X' character
    closeButton.setAttribute('aria-label', 'Close image viewer');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeB<ctrl63>