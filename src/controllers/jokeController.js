const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../../data/users.json');

const getUsers = () => {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

exports.toggleLike = (req, res) => {
    if (!req.cookies.user) return res.status(401).json({ message: 'Unauthorized' });
    const currentUser = JSON.parse(req.cookies.user);
    const { jokeId, type } = req.body; // type: 'like' or 'dislike'

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    const user = users[userIndex];

    // Remove from opposite list if present
    if (type === 'like') {
        user.dislikes = user.dislikes.filter(id => id !== jokeId);
        if (user.likes.includes(jokeId)) {
            user.likes = user.likes.filter(id => id !== jokeId); // Toggle off
        } else {
            user.likes.push(jokeId);
        }
    } else {
        user.likes = user.likes.filter(id => id !== jokeId);
        if (user.dislikes.includes(jokeId)) {
            user.dislikes = user.dislikes.filter(id => id !== jokeId); // Toggle off
        } else {
            user.dislikes.push(jokeId);
        }
    }

    saveUsers(users);
    res.json({ message: 'Success', likes: user.likes, dislikes: user.dislikes });
};

exports.toggleSave = (req, res) => {
    if (!req.cookies.user) return res.status(401).json({ message: 'Unauthorized' });
    const currentUser = JSON.parse(req.cookies.user);
    const { joke } = req.body; // Expecting full joke object

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    const user = users[userIndex];
    const savedIndex = user.saved.findIndex(j => j.id === joke.id);

    if (savedIndex > -1) {
        user.saved.splice(savedIndex, 1); // Unsave
    } else {
        user.saved.push(joke); // Save
    }

    saveUsers(users);
    res.json({ message: 'Success', saved: user.saved });
};

exports.getSaved = (req, res) => {
    if (!req.cookies.user) return res.status(401).json({ message: 'Unauthorized' });
    const currentUser = JSON.parse(req.cookies.user);
    const users = getUsers();
    const user = users.find(u => u.id === currentUser.id);
    res.json(user ? user.saved : []);
};
