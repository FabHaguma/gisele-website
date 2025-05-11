// js/blog-dynamic.js
document.addEventListener('DOMContentLoaded', async () => {
    const blogPostsGrid = document.getElementById('blogPostsGrid');
    const loadingMessage = document.getElementById('blog-loading-message');

    if (!blogPostsGrid || !loadingMessage) {
        console.error('Required HTML elements for blog display are missing.');
        return;
    }

    if (typeof supabaseClient === 'undefined') {
        loadingMessage.textContent = 'Error: Supabase client is not initialized.';
        console.error('Supabase client is not initialized. Make sure supabase-client.js is loaded correctly.');
        return;
    }

    async function fetchAndDisplayPosts() {
        try {
            // Fetch posts:
            // - Select specific columns
            // - Filter by is_published = true and published_at <= now() (though RLS also handles this)
            // - Order by published_at descending
            const { data: posts, error } = await supabaseClient
                .from('blog_posts')
                .select('title, slug, snippet, category, thumbnail_url, published_at')
                .eq('is_published', true)
                .lte('published_at', new Date().toISOString()) // Ensure published_at is past or current
                .order('published_at', { ascending: false });

            if (error) {
                console.error('Error fetching posts:', error);
                loadingMessage.textContent = 'Error loading posts. Please try again later.';
                return;
            }

            if (!posts || posts.length === 0) {
                loadingMessage.textContent = 'No blog posts found yet. Check back soon!';
                return;
            }

            loadingMessage.style.display = 'none'; // Hide loading message
            blogPostsGrid.innerHTML = ''; // Clear any existing content (like the loading message paragraph)

            posts.forEach(post => {
                const postCard = document.createElement('article');
                postCard.classList.add('blog-post-card');

                const thumbnailLink = document.createElement('a');
                // Link to a future single post page, using the slug
                thumbnailLink.href = `single-post.html?slug=${post.slug}`;
                const thumbnail = document.createElement('img');
                thumbnail.classList.add('thumbnail');
                thumbnail.src = post.thumbnail_url || 'https://via.placeholder.com/400x250.png?text=Blog+Post';
                thumbnail.alt = `Thumbnail for ${post.title}`;
                thumbnail.onerror = function() {
                    this.src = 'https://via.placeholder.com/400x250.png?text=Image+Error';
                    this.alt = `Error loading thumbnail for ${post.title}`;
                };
                thumbnailLink.appendChild(thumbnail);
                postCard.appendChild(thumbnailLink);

                const contentDiv = document.createElement('div');
                contentDiv.classList.add('blog-post-content');

                const title = document.createElement('h3');
                const titleLink = document.createElement('a');
                titleLink.href = `single-post.html?slug=${post.slug}`; // Link to single post page
                titleLink.textContent = post.title;
                title.appendChild(titleLink);
                contentDiv.appendChild(title);

                const meta = document.createElement('p');
                meta.classList.add('meta');
                const postDate = new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });
                meta.innerHTML = `Posted on <time datetime="${post.published_at}">${postDate}</time> | Category: ${post.category || 'General'}`;
                contentDiv.appendChild(meta);

                const snippet = document.createElement('p');
                snippet.classList.add('snippet');
                snippet.textContent = post.snippet || 'Read more to see the content...';
                contentDiv.appendChild(snippet);

                const readMoreLink = document.createElement('a');
                readMoreLink.href = `single-post.html?slug=${post.slug}`; // Link to single post page
                readMoreLink.classList.add('read-more');
                readMoreLink.textContent = 'Read More →';
                contentDiv.appendChild(readMoreLink);

                postCard.appendChild(contentDiv);
                blogPostsGrid.appendChild(postCard);
            });

        } catch (err) {
            console.error('An unexpected error occurred:', err);
            loadingMessage.textContent = 'An unexpected error occurred while loading posts.';
        }
    }

    fetchAndDisplayPosts();
});