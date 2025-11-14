export default function Page() {
    const posts = [
        { id: 1, title: 'Dummy Post One', excerpt: 'This is a placeholder for the first dummy post.', date: '2025-01-01' },
        { id: 2, title: 'Dummy Post Two', excerpt: 'This is a placeholder for the second dummy post.', date: '2025-02-01' },
    ];

    return (
        <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
            <h1>Blog (Dummy)</h1>
            <p style={{ color: '#666' }}>This is a placeholder page for the blog index.</p>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {posts.map(post => (
                    <li
                        key={post.id}
                        style={{
                            border: '1px solid #eee',
                            padding: 12,
                            borderRadius: 6,
                            marginTop: 12,
                        }}
                    >
                        <h2 style={{ margin: '0 0 6px' }}>{post.title}</h2>
                        <small style={{ color: '#999' }}>{post.date}</small>
                        <p style={{ marginTop: 8 }}>{post.excerpt}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}