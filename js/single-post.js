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
            postBody.classList.add('post-body');
            // **IMPORTANT: Rendering HTML content**
            // If 'post.content' contains HTML, you need to be careful about XSS.
            // If it's Markdown, you'll need a Markdown parser library (e.g., Marked.js or Showdown.js)
            // For now, assuming it's plain text or safe HTML you trust:
            if (isHTML(post.content)) { // Basic check if content might be HTML
                postBody.innerHTML = post.content; // Renders HTML. ONLY DO THIS IF YOU TRUST THE SOURCE OR SANITIZE IT.
            } else {
                 // If it's plain text or Markdown you want to display as preformatted text
                const pre = document.createElement('pre');
                pre.style.whiteSpace = 'pre-wrap'; // Ensure text wraps
                pre.textContent = post.content;
                postBody.appendChild(pre);
                // Or, if it's Markdown, you'd parse it here:
                // postBody.innerHTML = marked.parse(post.content); // Example with Marked.js
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