document.addEventListener('DOMContentLoaded', () => {
    const jokeGrid = document.getElementById('joke-grid');
    const loader = document.getElementById('loader');
    const categoryLinks = document.querySelectorAll('.category-link');
    let currentCategory = 'Any';
    let isLoading = false;

    // Initialize
    if (jokeGrid) {
        fetchJokes();
        window.addEventListener('scroll', handleScroll);
    }

    // Sidebar Toggle (Mobile)
    // Add logic if hamburger menu exists

    // Category Filtering
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            currentCategory = link.dataset.category;
            jokeGrid.innerHTML = ''; // Clear grid
            fetchJokes();
        });
    });

    async function fetchJokes() {
        if (isLoading) return;
        isLoading = true;
        loader.style.display = 'block';

        try {
            const url = `https://v2.jokeapi.dev/joke/${currentCategory}?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&amount=9`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.error) {
                console.error('Error fetching jokes:', data);
            } else {
                const jokes = data.jokes || [data]; // Handle single joke response if amount=1 (though we ask for 9)
                jokes.forEach(joke => {
                    const card = createJokeCard(joke);
                    jokeGrid.appendChild(card);
                });
            }
        } catch (err) {
            console.error('Network error:', err);
        } finally {
            isLoading = false;
            loader.style.display = 'none';
        }
    }

    function createJokeCard(joke) {
        const card = document.createElement('div');
        card.className = 'joke-card';
        card.dataset.id = joke.id;

        const content = joke.type === 'single'
            ? `<div class="joke-text">${joke.joke}</div>`
            : `<div class="joke-text">
                 <div class="joke-setup">${joke.setup}</div>
                 <div class="joke-delivery">${joke.delivery}</div>
               </div>`;

        card.innerHTML = `
            <div class="joke-category">${joke.category}</div>
            ${content}
            <div class="card-actions">
                <button class="action-btn like-btn" onclick="toggleLike(${joke.id}, 'like', this)">
                    <i class="fas fa-thumbs-up"></i> <span class="count">0</span>
                </button>
                <button class="action-btn dislike-btn" onclick="toggleLike(${joke.id}, 'dislike', this)">
                    <i class="fas fa-thumbs-down"></i>
                </button>
                <button class="action-btn save-btn" onclick="toggleSave(${joke.id}, this)">
                    <i class="fas fa-bookmark"></i>
                </button>
                <button class="action-btn share-btn" onclick="shareJoke(${joke.id}, '${joke.type === 'single' ? escape(joke.joke) : escape(joke.setup + ' ' + joke.delivery)}')">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        `;

        // Store joke data in element for saving
        card.jokeData = joke;

        return card;
    }

    function handleScroll() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            fetchJokes();
        }
    }
});

// Global functions for inline onclick handlers (or delegate event listeners better)
// For simplicity in this demo, attaching to window. 
// Ideally, use event delegation on the grid container.

window.toggleLike = async (id, type, btn) => {
    // Optimistic UI update
    btn.classList.toggle(type === 'like' ? 'active-like' : 'active-dislike');

    // Call Backend
    try {
        const res = await fetch('/api/jokes/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jokeId: id, type })
        });
        if (res.status === 401) window.location.href = '/login';
        if (res.status === 404) alert('Feature requires Node.js backend.');
    } catch (err) {
        console.error(err);
        alert('Feature requires Node.js backend.');
    }
};

window.toggleSave = async (id, btn) => {
    const card = btn.closest('.joke-card');
    const joke = card.jokeData;

    btn.classList.toggle('active-save');

    try {
        const res = await fetch('/api/jokes/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ joke })
        });
        if (res.status === 401) window.location.href = '/login';
        if (res.status === 404) alert('Feature requires Node.js backend.');
    } catch (err) {
        console.error(err);
        alert('Feature requires Node.js backend.');
    }
};

window.shareJoke = async (id, text) => {
    const url = `${window.location.origin}/joke/${id}`;
    const decodedText = unescape(text);

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'LOLify Joke',
                text: decodedText,
                url: url
            });
        } catch (err) {
            console.log('Share canceled');
        }
    } else {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        });
    }
};

function escape(str) {
    return str.replace(/'/g, "\\'");
}
