// js/blog-config.js

// Instructions for Gisèle:
// For each blog post you create (as an HTML file in the 'posts/' folder):
// 1. Add a new object to the `blogPostsData` array below.
// 2. `id`: A unique identifier (e.g., 'my-first-movie-review').
// 3. `title`: The title of your blog post.
// 4. `date`: The publication date (e.g., '2024-07-29').
// 5. `category`: The category (e.g., 'Movie', 'Foodie', 'Travel', 'Personal').
// 6. `snippet`: A short summary or the first few sentences of your post.
// 7. `thumbnailUrl`: A direct Google Drive link (or other URL) for the post's thumbnail image.
//    (Follow same Google Drive link instructions as in gallery-config.js)
// 8. `postUrl`: The path to your blog post's HTML file (e.g., 'posts/my-first-movie-review.html').

const blogPostsData = [
    {
    id: 'brooklyn-99-rewatch-magic',
    title: 'Brooklyn 99: The Perfect Rewatch for Any Mood',
    date: '2024-02-14',
    category: 'Movies, Comedy',
    snippet: 'Rediscover the fast-paced humor and heartwarming camaraderie of the 99th precinct—because some shows never lose their sparkle.',
    thumbnailUrl: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746879732/brooklyn99-thumbnail001_tucyms.jpg',
    postUrl: 'posts/blog-post-template-movie.html'
  },
  {
    id: 'double-beef-burger-bliss',
    title: 'Double Beef Burger Bliss: A Feb 23 Indulgence',
    date: '2025-02-23',
    category: 'Food',
    snippet: 'Two perfectly seasoned patties, melted cheese, and a toasted bun—this burger transcended a simple meal and became a flavor event.',
    thumbnailUrl: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746879909/p747-listing_ncgv25.jpg',
    postUrl: 'posts/blog-post-template-foodie.html'
  },
  {
    id: 'dar-es-salaam-sands',
    title: 'Sun, Sea, and Serenity: Dar es Salaam Beach Day',
    date: '2025-04-20',
    category: 'Travel, Beach',
    snippet: 'A tranquil escape along Tanzania’s coast—salt-kissed air, gentle waves, and the simple joy of watching the horizon.',
    thumbnailUrl: 'https://res.cloudinary.com/duxkzhbro/image/upload/v1746879908/daressalaam_beachlife_cy8rur.jpg',
    postUrl: 'posts/blog-post-template-adventure.html'
  },
    // Add more blog post objects here:
    // {
    //     id: 'unique-post-id',
    //     title: 'Your New Blog Post Title',
    //     date: 'YYYY-MM-DD',
    //     category: 'Your Category',
    //     snippet: 'A brief intro to your post...',
    //     thumbnailUrl: 'https://drive.google.com/uc?export=view&id=YOUR_THUMBNAIL_ID',
    //     postUrl: 'posts/your-new-post-file.html'
    // },
];