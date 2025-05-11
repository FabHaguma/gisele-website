// admin/js/admin-posts.js
document.addEventListener('DOMContentLoaded', async () => {
    // --- Elements for manage-posts.html ---
    const postsTableBody = document.getElementById('postsTableBody');
    const loadingPostsMsg = document.getElementById('loadingPostsMsg');

    // --- Elements for edit-post.html ---
    const postForm = document.getElementById('postForm');
    const postIdInput = document.getElementById('postId');
    const postTitleInput = document.getElementById('postTitle');
    const postSlugInput = document.getElementById('postSlug');
    const postCategoryInput = document.getElementById('postCategory');
    const postSnippetInput = document.getElementById('postSnippet');
    const postContentInput = document.getElementById('postContent');
    const postThumbnailUrlInput = document.getElementById('postThumbnailUrl');
    const postPublishedAtInput = document.getElementById('postPublishedAt');
    const isPublishedCheckbox = document.getElementById('isPublished');
    const formStatusEl = document.getElementById('formStatus');
    const thumbnailPreviewEl = document.getElementById('thumbnailPreview'); // From edit-post.html


    // --- General Functions ---
    function displayStatus(element, message, isError = false) {
        if (element) {
            element.textContent = message;
            element.className = isError ? 'error-message status-message' : 'success-message status-message';
            setTimeout(() => { element.textContent = ''; }, 5000);
        }
    }

    // Auto-generate slug from title (basic version)
    if (postTitleInput && postSlugInput) {
        postTitleInput.addEventListener('keyup', () => {
            postSlugInput.value = postTitleInput.value
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-') // Replace spaces with -
                .replace(/[^\w-]+/g, '') // Remove all non-word chars
                .replace(/--+/g, '-'); // Replace multiple - with single -
        });
    }


    // --- Logic for manage-posts.html ---
    if (postsTableBody) {
        await loadPostsForTable();
    }

    async function loadPostsForTable() {
        if (loadingPostsMsg) loadingPostsMsg.style.display = 'block';
        postsTableBody.innerHTML = ''; // Clear existing

        try {
            const { data: posts, error } = await supabaseClient
                .from('blog_posts')
                .select('id, title, category, is_published, published_at, slug')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching posts for admin:', error);
                if (loadingPostsMsg) loadingPostsMsg.textContent = 'Error loading posts.';
                return;
            }

            if (loadingPostsMsg) loadingPostsMsg.style.display = 'none';

            if (posts && posts.length > 0) {
                posts.forEach(post => {
                    const row = postsTableBody.insertRow();
                    row.innerHTML = `
                        <td>${post.title}</td>
                        <td>${post.category || 'N/A'}</td>
                        <td>${post.is_published ? 'Yes' : 'No'}</td>
                        <td>${post.published_at ? new Date(post.published_at).toLocaleDateString() : 'N/A'}</td>
                        <td>
                            <a href="edit-post.html?slug=${post.slug}" class="action-btn edit-btn">Edit</a>
                            <button data-id="${post.id}" data-slug="${post.slug}" class="action-btn delete-btn">Delete</button>
                        </td>
                    `;
                });
                addDeleteEventListeners();
            } else {
                postsTableBody.innerHTML = '<tr><td colspan="5">No posts found.</td></tr>';
            }
        } catch (err) {
            console.error('Unexpected error loading posts:', err);
            if (loadingPostsMsg) loadingPostsMsg.textContent = 'Unexpected error.';
        }
    }

    function addDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const postId = e.target.dataset.id;
                const postSlug = e.target.dataset.slug; // Or title for confirmation
                if (confirm(`Are you sure you want to delete the post "${postSlug}"? This cannot be undone.`)) {
                    try {
                        const { error } = await supabaseClient
                            .from('blog_posts')
                            .delete()
                            .eq('id', postId);

                        if (error) {
                            console.error('Error deleting post:', error);
                            alert('Error deleting post: ' + error.message);
                        } else {
                            alert('Post deleted successfully.');
                            await loadPostsForTable(); // Refresh list
                        }
                    } catch (err) {
                         console.error('Unexpected error deleting post:', err);
                         alert('An unexpected error occurred during deletion.');
                    }
                }
            });
        });
    }


    // --- Logic for edit-post.html ---
    if (postForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const postSlugToEdit = urlParams.get('slug');

        if (postSlugToEdit) {
            // Editing existing post
            document.querySelector('header h1').textContent = 'Edit Post';
            await loadPostDataForEdit(postSlugToEdit);
        } else {
            // Creating new post
            document.querySelector('header h1').textContent = 'Create New Post';
            // Set default published_at to now for new posts
            if(postPublishedAtInput) {
                 postPublishedAtInput.value = new Date().toISOString().slice(0, 16);
            }
        }

        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const postData = {
                title: postTitleInput.value,
                slug: postSlugInput.value,
                category: postCategoryInput.value || null,
                snippet: postSnippetInput.value || null,
                content: postContentInput.value,
                thumbnail_url: postThumbnailUrlInput.value || null,
                published_at: postPublishedAtInput.value ? new Date(postPublishedAtInput.value).toISOString() : null,
                is_published: isPublishedCheckbox.checked
            };

            if (!postData.title || !postData.slug || !postData.content) {
                displayStatus(formStatusEl, 'Title, Slug, and Content are required.', true);
                return;
            }
            
            try {
                let responseError;
                if (postIdInput.value) { // Editing existing post
                    const { error } = await supabaseClient
                        .from('blog_posts')
                        .update(postData)
                        .eq('id', postIdInput.value);
                    responseError = error;
                } else { // Creating new post
                    const { error } = await supabaseClient
                        .from('blog_posts')
                        .insert([postData]);
                    responseError = error;
                }

                if (responseError) {
                    console.error('Error saving post:', responseError);
                    // Check for unique constraint violation on slug
                    if (responseError.message.includes('duplicate key value violates unique constraint "blog_posts_slug_key"')) {
                         displayStatus(formStatusEl, 'Error: This slug is already in use. Please choose a unique slug.', true);
                    } else {
                        displayStatus(formStatusEl, `Error saving post: ${responseError.message}`, true);
                    }
                } else {
                    displayStatus(formStatusEl, 'Post saved successfully!', false);
                    // Optionally redirect or clear form
                    if (!postIdInput.value) { // If it was a new post
                        postForm.reset();
                        if(thumbnailPreviewEl) thumbnailPreviewEl.style.display = 'none';
                        if(postPublishedAtInput) postPublishedAtInput.value = new Date().toISOString().slice(0, 16);
                    }
                    setTimeout(() => { window.location.href = 'manage-posts.html'; }, 1500);
                }
            } catch (err) {
                console.error('Unexpected error saving post:', err);
                displayStatus(formStatusEl, 'An unexpected error occurred.', true);
            }
        });
    }

    async function loadPostDataForEdit(slug) {
        try {
            const { data: post, error } = await supabaseClient
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !post) {
                console.error('Error fetching post for editing:', error);
                displayStatus(formStatusEl, 'Could not load post data for editing.', true);
                return;
            }

            postIdInput.value = post.id;
            postTitleInput.value = post.title;
            postSlugInput.value = post.slug;
            postCategoryInput.value = post.category || '';
            postSnippetInput.value = post.snippet || '';
            postContentInput.value = post.content;
            postThumbnailUrlInput.value = post.thumbnail_url || '';
            if (post.thumbnail_url && thumbnailPreviewEl) {
                thumbnailPreviewEl.src = post.thumbnail_url;
                thumbnailPreviewEl.style.display = 'block';
            }
            if (post.published_at) {
                // Format for datetime-local input: YYYY-MM-DDThh:mm
                const dt = new Date(post.published_at);
                // Adjust for timezone offset to display correctly in user's local time
                const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                const localISOTime = (new Date(dt.getTime() - tzoffset)).toISOString().slice(0,16);
                postPublishedAtInput.value = localISOTime;
            }
            isPublishedCheckbox.checked = post.is_published;

        } catch (err) {
            console.error('Unexpected error loading post for edit:', err);
            displayStatus(formStatusEl, 'Unexpected error loading post data.', true);
        }
    }
});