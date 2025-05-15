// js/single-post.js
document.addEventListener('DOMContentLoaded', async () => {
    const postContainer = document.getElementById('singlePostContainer');
    const loadingMessage = document.getElementById('post-loading-message');

    if (!postContainer || !loadingMessage) {
        console.error('Required HTML elements for single post display are missing.');
        return;
    }

    if (typeof supabaseClient === 'undefined') {
        loadingMessage.textContent = 'Error: Supabase client is not initialized.';
        console.error('Supabase client is not initialized.');
        return;
    }

    // Get the slug from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('slug');

    if (!postSlug) {
        loadingMessage.textContent = 'No post specified. Please go back to the blog list.';
        postContainer.innerHTML = '<p style="text-align:center; color:red;">Error: Post slug not found in URL.</p>';
        return;
    }

    async function fetchAndDisplaySinglePost() {
        try {
            const { data: post, error } = await supabaseClient
                .from('blog_posts')
                .select('title, content, category, published_at, thumbnail_url') // Fetch all needed fields
                .eq('slug', postSlug)
                .eq('is_published', true) // Ensure it's published
                .lte('published_at', new Date().toISOString())
                .single(); // Expect only one post

            if (error) {
                console.error('Error fetching post:', error);
                if (error.code === 'PGRST116') { // PostgREST error for " dokładnie jeden wiersz" (exactly one row not found)
                     loadingMessage.textContent = 'Blog post not found or not published yet.';
                     postContainer.innerHTML = '<p style="text-align:center;">Sorry, this blog post could not be found or is not yet available.</p>';
                } else {
                    loadingMessage.textContent = 'Error loading the post.';
                }
                return;
            }

            if (!post) {
                loadingMessage.textContent = 'Blog post not found or not published yet.';
                postContainer.innerHTML = '<p style="text-align:center;">Sorry, this blog post could not be found or is not yet available.</p>';
                return;
            }

            // Update page title
            document.title = `${post.title} - Gisèle Haguma`;

            // Clear loading message and render post
            postContainer.innerHTML = ''; // Clear previous content

            const article = document.createElement('article');
            article.classList.add('blog-post-full');

            const header = document.createElement('header');
            header.classList.add('blog-post-header');
            const titleH1 = document.createElement('h1');
            titleH1.textContent = post.title;
            header.appendChild(titleH1);

            const meta = document.createElement('p');
            meta.classList.add('meta');
            const postDate = new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            meta.innerHTML = `Posted on <time datetime="${post.published_at}">${postDate}</time> | Category: ${post.category || 'General'}`;
            header.appendChild(meta);
            article.appendChild(header);

            // Optional: Display thumbnail if it makes sense for the single post layout
            if (post.thumbnail_url) {
                const featuredImage = document.createElement('img');
                featuredImage.src = post.thumbnail_url;
                featuredImage.alt = `Featured image for ${post.title}`;
                featuredImage.classList.add('featured-image-full'); // You might need to style this class
                article.appendChild(featuredImage);
            }

            const postBody = document.createElement('div');
            postBody.classList.add('post-body'); // Your CSS styles this class

            // --- Render Markdown content using Marked.js ---
            if (post.content) {
                if (typeof marked === 'undefined') {
                    console.error('Marked.js library is not loaded!');
                    postBody.textContent = 'Error: Could not render post content (Markdown parser missing).';
                } else {
                    // Configure Marked.js (optional but good practice)
                    marked.setOptions({
                        renderer: new marked.Renderer(),
                        pedantic: false,
                        gfm: true,        // Enable GitHub Flavored Markdown (tables, strikethrough, etc.)
                        breaks: true,     // Convert single line breaks in text into <br> tags
                        sanitize: false,  // DEPRECATED. Do not rely on this for security.
                        // If you need to allow HTML within Markdown and ensure security,
                        // you'd typically sanitize the HTML output of marked.parse()
                        // using a library like DOMPurify AFTER parsing.
                        // For pure Markdown written by Gisèle, this is usually less of a concern.
                        smartLists: true,
                        smartypants: false, // Converts quotes, dashes, etc. to smart typographic equivalents
                        xhtml: false
                    });
                    // Parse the Markdown content to HTML
                    postBody.innerHTML = marked.parse(post.content);
                }
            } else {
                postBody.textContent = 'This post has no content yet.';
            }
            article.appendChild(postBody);

            postContainer.appendChild(article);

        } catch (err) {
            console.error('An unexpected error occurred:', err);
            postContainer.innerHTML = '<p style="text-align:center;">An unexpected error occurred while loading the post.</p>';
        }
    }

    // Helper function to roughly check if a string contains HTML tags
    function isHTML(str) {
        if (!str) return false;
        const doc = new DOMParser().parseFromString(str, "text/html");
        return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    }

    fetchAndDisplaySinglePost();
});