// js/gallery-config.js

// Instructions for Gisèle:
// 1. Upload your images to a Google Drive folder.
// 2. Make sure the folder or individual images are shared with "Anyone with the link can view".
// 3. For each image, get the shareable link.
//    Example: https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing
// 4. Convert it to a direct link: https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
// 5. Add an object for each image to the `galleryImages` array below.

const galleryImages = [
    {
        src: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746878491/IMG_6429_cxztkq.jpg',
        alt: 'Description of image 1',
        title: 'Artwork Title 1'
    },
    {
        src: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746878489/20250323_165550_ymjl9b.jpg',
        alt: 'Beautiful travel destination',
        title: 'Travel: Mountain View'
    },
    {
        src: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746878492/IMG_20170402_114716_p8uolu.jpg',
        alt: 'Delicious looking pasta dish',
        title: 'Foodie: Pasta Delight'
    },
    {
        src: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746878491/WP_20161231_034_sjfp1x.jpg',
        alt: 'Description of image 2',
        title: 'Creative Project B'
    },
    {
        src: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746878491/IMG_6426_sqi5bk.jpg',
        alt: 'A happy moment captured',
        title: 'A Special Day'
    },
    {
        src: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746878490/IMG_0724.JPG_g5gbk8.jpg',
        alt: 'Description of your image',
        title: 'Image Title'
    },
    {
        src: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746878490/IMG_0725.JPG_h6u0qd.jpg',
        alt: 'Description of your image',
        title: 'Image Title'
    },
    {
        src: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746878489/DSC_0010_jqe18i.jpg',
        alt: 'Description of your image',
        title: 'Image Title'
    },
    {
        src: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746878489/DSC_0007_epdtta.jpg',
        alt: 'Description of your image',
        title: 'Image Title'
    },
    {
        src: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746878488/20240721_170557_bthqjh.jpg',
        alt: 'Description of your image',
        title: 'Image Title'
    },
    // Add more image objects here following the same format
    // {
    //     src: 'https://drive.google.com/uc?export=view&id=YOUR_NEXT_IMAGE_ID',
    //     alt: 'Description of your image',
    //     title: 'Image Title'
    // },
];

// Note on dynamic folder listing:
// To dynamically list ALL images from a Google Drive folder, you would typically need to use the
// Google Drive API (v3) with an API Key. This involves:
// 1. Setting up a project in Google Cloud Console.
// 2. Enabling the Google Drive API.
// 3. Creating an API Key.
// 4. Making an authenticated request to list files in a specific folder:
//    `https://www.googleapis.com/drive/v3/files?q='YOUR_FOLDER_ID_HERE'+in+parents+and+mimeType+contains+'image/'&key=YOUR_API_KEY`
// IMPORTANT: Exposing an API Key directly in client-side JavaScript is a security risk.
// A more secure approach for dynamic listing involves a backend proxy server or serverless function
// to handle the API request and protect the key.
// For a purely client-side static site like this, manually listing the direct image links above
// is the simpler and more secure method.