const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/index', { title: 'LOLify - Home', user: req.cookies.user ? JSON.parse(req.cookies.user) : null });
});

router.get('/saved', (req, res) => {
    if (!req.cookies.user) return res.redirect('/login');
    res.render('pages/saved', { title: 'LOLify - Saved Jokes', user: JSON.parse(req.cookies.user) });
});

router.get('/login', (req, res) => {
    res.render('pages/login', { title: 'Login - LOLify', user: null });
});

router.get('/signup', (req, res) => {
    res.render('pages/signup', { title: 'Signup - LOLify', user: null });
});

// Joke details page (optional, for sharing)
router.get('/joke/:id', (req, res) => {
    res.render('pages/joke', { title: 'Joke - LOLify', jokeId: req.params.id, user: req.cookies.user ? JSON.parse(req.cookies.user) : null });
});

module.exports = router;
