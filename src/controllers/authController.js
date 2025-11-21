const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

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

exports.signup = async (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), username, password: hashedPassword, saved: [], likes: [], dislikes: [] };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: 'User created successfully' });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Simple cookie-based session (insecure for prod, okay for this demo)
    const userSafe = { id: user.id, username: user.username };
    res.cookie('user', JSON.stringify(userSafe), { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ message: 'Login successful', user: userSafe });
};

exports.logout = (req, res) => {
    res.clearCookie('user');
    res.json({ message: 'Logged out' });
};
