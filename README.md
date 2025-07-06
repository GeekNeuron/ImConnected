# ImConnected 🌐

A modern, web-based tool to manage and test your proxy and VPN configurations live. Built with pure HTML, CSS, and JavaScript, designed to be deployed seamlessly on GitHub Pages.

![ImConnected Screenshot](https://user-images.githubusercontent.com/your-image-url.png) **Live Demo:** `https://GeekNeuron.github.io/ImConnected/`

---

## ✨ Features

- **Modern & Responsive UI**: Clean, intuitive interface with rounded corners and dark/light themes.
- **Multi-Protocol Support**: Recognizes a wide range of protocols including VLESS, VMess, Trojan, Shadowsocks, WireGuard, and more.
- **Clipboard Import**: Instantly add single or multiple configurations by copying them to your clipboard.
- **Live Check from URL**: Import and test configurations directly from a website or a public Telegram channel.
- **Simulated Latency Test**: "Ping" all configurations with a single click to check their simulated connection status.
- **Zero Dependencies**: Runs entirely in the browser with no need for external libraries or frameworks.
- **Theme Switching**: Easily toggle between a light and dark mode by clicking the header.

---

## 🛠️ How to Use

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/GeekNeuron/ImConnected.git](https://github.com/GeekNeuron/ImConnected.git)
    ```

2.  **Open `index.html`**:
    Simply open the `index.html` file in your web browser to run the application locally.

3.  **Deploy on GitHub Pages**:
    - Push the repository to your GitHub account (`GeekNeuron/ImConnected`).
    - Go to `Settings` > `Pages`.
    - Under `Build and deployment`, select `Deploy from a branch`.
    - Choose the `main` (or `master`) branch and the `/root` folder, then click `Save`.
    - Your project will be live at `https://GeekNeuron.github.io/ImConnected/`.

---

## 🚀 Key Functionalities

### ➕ Add from Clipboard
1.  Copy one or more configuration links to your clipboard.
2.  Click the **`+`** button in the footer.
3.  The app will automatically parse and add all valid configurations to the list.

### 📡 Live Check
1.  Click the **"Live Check"** button in the footer.
2.  A modal window will appear. Enter a URL that contains configuration links.
    - **For websites**: `https://example.com/configs.html`
    - **For public Telegram channels**: Use the `/s/` format, for example: `https://t.me/s/geekneuron`
3.  Click "Fetch and Test". The app will load the configurations and test them. The source URL will be displayed at the top.

### ⚡ Test All
- Click the **"Test All Connections"** button to run a simulated latency test on all loaded configurations. Results will be displayed as ping in milliseconds (`ms`) or `n/a` for failed connections.

> **Disclaimer**: The connection test is a **simulation** and does not establish a real VPN or proxy connection due to browser security limitations. It serves to demonstrate the UI/UX and data handling capabilities of the application.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/GeekNeuron/ImConnected/issues).

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
