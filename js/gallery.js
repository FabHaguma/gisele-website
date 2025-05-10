// js/gallery.js
document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('galleryGrid');
    const loadingMessage = document.getElementById('gallery-loading-message');

    if (!galleryGrid) {
        console.error('Gallery grid container not found.');
        if(loadingMessage) loadingMessage.textContent = 'Error: Gallery container missing.';
        return;
    }

    if (typeof galleryImages === 'undefined' || galleryImages.length === 0) {
        console.warn('No images found in gallery-config.js or galleryImages array is empty.');
        if (loadingMessage) loadingMessage.textContent = 'No images to display at the moment. Please check back later!';
        return;
    }

    if (loadingMessage) loadingMessage.style.display = 'none'; // Hide loading message

    galleryImages.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.alt || 'Gallery image';
        imgElement.onerror = function() { // Basic error handling for broken image links
            this.alt = 'Image not available';
            this.src = '../images/6kO9aIBM.png'; // Fallback image
            if (galleryItem.querySelector('.overlay')) {
                galleryItem.querySelector('.overlay').textContent = 'Error Loading Image';
            }
        };


        galleryItem.appendChild(imgElement);

        if (image.title) {
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            overlay.textContent = image.title;
            galleryItem.appendChild(overlay);
        }
        
        // Simple lightbox-like functionality (optional, can be expanded)
        imgElement.addEventListener('click', () => {
            openImageModal(image.src, image.alt);
        });


        galleryGrid.appendChild(galleryItem);
    });
});

function openImageModal(src, alt) {
    // Check if a modal already exists
    let modal = document.getElementById('imageModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageModal';
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

        const modalImg = document.createElement('img');
        modalImg.id = 'modalImage';
        modalImg.style.margin = 'auto';
        modalImg.style.display = 'block';
        modalImg.style.maxWidth = '90%';
        modalImg.style.maxHeight = '90%';
        modal.appendChild(modalImg);
        
        const caption = document.createElement('div');
        caption.id = 'caption';
        caption.style.textAlign = 'center';
        caption.style.color = '#ccc';
        caption.style.padding = '10px 0';
        caption.style.position = 'absolute';
        caption.style.bottom = '20px';
        caption.style.width = '100%';
        modal.appendChild(caption);

        document.body.appendChild(modal);
        modal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    modal.style.display = 'flex';
    document.getElementById('modalImage').src = src;
    document.getElementById('modalImage').alt = alt;
    document.getElementById('caption').textContent = alt;

}