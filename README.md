# LOLify 🤣

LOLify is a modern, vibrant, and dynamic entertainment web application inspired by the YouTube layout, but fully focused on delivering jokes powered by [JokeAPI](https://v2.jokeapi.dev).

![LOLify Logo](https://via.placeholder.com/150x50?text=LOLify)

## 🚀 Features

- **Vibrant UI**: Modern dark mode design with neon accents and smooth animations.
- **Joke Feed**: Infinite scroll of jokes from various categories (Programming, Pun, Spooky, etc.).
- **Interactions**: Like, Dislike, and Save jokes (requires backend).
- **Authentication**: Sign up and Login system (requires backend).
- **Sharing**: Share jokes via native share sheet or copy link.
- **Responsive**: Fully optimized for mobile and desktop.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Variables, Flexbox, Grid), JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Templating**: EJS
- **Data**: JSON-based persistence (for demo purposes)
- **API**: JokeAPI v2

## 📂 Project Structure

```
/public        # Static assets (CSS, JS, Images)
/src           # Backend logic
  /routes      # Express routes
  /controllers # Route controllers
  /services    # Business logic
/views         # EJS templates
server.js      # Entry point
```

## 🏁 Getting Started

### Prerequisites
- Node.js installed

### 1. Clone & Install
```bash
git clone https://github.com/Mainalam7084/LOLify.git
cd LOLify
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
PORT=3000
JWT_SECRET=your_secret_key
```

### 3. Run Locally
```bash
# Development mode (requires nodemon)
npm run dev

# Production mode
npm start
```
Visit `http://localhost:3000` in your browser.

## 🌐 Deploying to GitHub Pages (Frontend Only)

The `public` folder contains a static version of the app that can be hosted on GitHub Pages.

1. Go to your repository Settings > Pages.
2. Select the source as `main` branch and `/public` folder (if supported) or push the contents of `public` to a `gh-pages` branch.
3. **Note**: Authentication and Saving features will not work on the static version as they require the Node.js backend.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the ISC License.
