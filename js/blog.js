// js/blog.js
document.addEventListener('DOMContentLoaded', () => {
    const blogPostsGrid = document.getElementById('blogPostsGrid');
    const loadingMessage = document.getElementById('blog-loading-message');

    if (!blogPostsGrid) {
        console.error('Blog posts grid container not found.');
        if(loadingMessage) loadingMessage.textContent = 'Error: Blog container missing.';
        return;
    }

    if (typeof blogPostsData === 'undefined' || blogPostsData.length === 0) {
        console.warn('No blog posts found in blog-config.js or blogPostsData array is empty.');
        if (loadingMessage) loadingMessage.textContent = 'No blog posts to display at the moment. Check back soon!';
        return;
    }

    if (loadingMessage) loadingMessage.style.display = 'none'; // Hide loading message

    // Sort posts by date, newest first (optional)
    blogPostsData.sort((a, b) => new Date(b.date) - new Date(a.date));

    blogPostsData.forEach(post => {
        const postCard = document.createElement('article');
        postCard.classList.add('blog-post-card');

        const thumbnailLink = document.createElement('a');
        thumbnailLink.href = post.postUrl;
        const thumbnail = document.createElement('img');
        thumbnail.classList.add('thumbnail');
        thumbnail.src = post.thumbnailUrl || 'https://via.placeholder.com/400x250.png?text=Blog+Post'; // Fallback
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
        titleLink.href = post.postUrl;
        titleLink.textContent = post.title;
        title.appendChild(titleLink);
        contentDiv.appendChild(title);

        const meta = document.createElement('p');
        meta.classList.add('meta');
        const postDate = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        meta.innerHTML = `Posted on <time datetime="${post.date}">${postDate}</time> | Category: ${post.category}`;
        contentDiv.appendChild(meta);

        const snippet = document.createElement('p');
        snippet.classList.add('snippet');
        snippet.textContent = post.snippet;
        contentDiv.appendChild(snippet);

        const readMoreLink = document.createElement('a');
        readMoreLink.href = post.postUrl;
        readMoreLink.classList.add('read-more');
        readMoreLink.textContent = 'Read More →';
        contentDiv.appendChild(readMoreLink);

        postCard.appendChild(contentDiv);
        blogPostsGrid.appendChild(postCard);
    });
});