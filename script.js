document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const mainHeader = document.getElementById('main-header');
    const themeSwitcherIcon = document.querySelector('.theme-switcher-icon');
    const addFromClipboardBtn = document.getElementById('add-from-clipboard-btn');
    const liveCheckBtn = document.getElementById('live-check-btn');
    const testAllBtn = document.getElementById('test-all-btn');
    const configList = document.getElementById('config-list');
    const toastNotification = document.getElementById('toast-notification');
    
    // Modal Elements
    const liveCheckModal = document.getElementById('live-check-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const fetchConfigsBtn = document.getElementById('fetch-configs-btn');
    const urlInput = document.getElementById('url-input');

    // Source Banner Elements
    const sourceBanner = document.getElementById('source-url-banner');
    const sourceUrlText = document.getElementById('source-url-text');
    const clearSourceBtn = document.getElementById('clear-source-btn');

    // --- State ---
    let currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.className = `${currentTheme}-theme`;
    updateThemeIcon(currentTheme);

    // --- Functions ---

    /**
     * Toggles between 'light' and 'dark' themes.
     */
    function toggleTheme() {
        currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
        document.documentElement.className = `${currentTheme}-theme`;
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon(currentTheme);
    }
    
    /**
     * Updates the theme switcher icon.
     * @param {string} theme - The current theme ('light' or 'dark').
     */
    function updateThemeIcon(theme) {
        themeSwitcherIcon.textContent = (theme === 'light') ? 'dark_mode' : 'light_mode';
    }

    /**
     * Shows a toast notification.
     * @param {string} message - The message to display.
     * @param {string} type - 'info' or 'error'.
     */
    function showToast(message, type = 'info') {
        toastNotification.textContent = message;
        toastNotification.className = `toast show ${type}`;
        setTimeout(() => {
            toastNotification.className = 'toast';
        }, 3000);
    }

    /**
     * Identifies the protocol from a given configuration string.
     * @param {string} config - The configuration string.
     * @returns {{protocol: string, name: string} | null} The identified protocol and name or null.
     */
    function identifyProtocol(config) {
        config = config.trim();
        if (config.startsWith('ss://')) return { protocol: 'SS', name: 'Shadowsocks' };
        if (config.startsWith('ssr://')) return { protocol: 'SSR', name: 'ShadowsocksR' };
        if (config.startsWith('vmess://')) return { protocol: 'VMess', name: 'VMess' };
        if (config.startsWith('vless://')) return { protocol: 'VLESS', name: 'VLESS' };
        if (config.startsWith('trojan://')) return { protocol: 'Trojan', name: 'Trojan' };
        if (config.includes('[Interface]') && config.includes('PrivateKey')) return { protocol: 'WireGuard', name: 'WireGuard' };
        if (config.startsWith('hysteria2://')) return { protocol: 'Hysteria2', name: 'Hysteria2' };
        if (config.includes('reality-opts')) return { protocol: 'REALITY', name: 'REALITY' };
        // Add more basic recognizers
        if (config.startsWith('http://') || config.startsWith('https://')) return { protocol: 'HTTP/HTTPS', name: 'HTTP/HTTPS Proxy' };
        if (config.startsWith('socks5://')) return { protocol: 'SOCKS5', name: 'SOCKS5' };
        // Add placeholders for complex types
        if (config.toLowerCase().includes('openvpn')) return { protocol: 'OpenVPN', name: 'OpenVPN' };
        if (config.toLowerCase().includes('l2tp') || config.toLowerCase().includes('ipsec')) return { protocol: 'L2TP/IPSec', name: 'L2TP/IPSec' };
        if (config.toLowerCase().includes('sstp')) return { protocol: 'SSTP', name: 'SSTP' };
        if (config.toLowerCase().includes('ikev2')) return { protocol: 'IKEv2', name: 'IKEv2' };
        if (config.toLowerCase().includes('pptp')) return { protocol: 'PPTP', name: 'PPTP' };
        if (config.toLowerCase().includes('tg://proxy?server=')) return { protocol: 'MTProto', name: 'MTProto' };
        
        return null;
    }
    
    /**
     * Gets a corresponding Google Icon for a protocol.
     * @param {string} protocol - The protocol identifier (e.g., 'VMess').
     * @returns {string} The name of the Material Icon.
     */
    function getProtocolIcon(protocol) {
        const icons = {
            'VMess': 'hub',
            'VLESS': 'hub',
            'Trojan': 'vpn_key',
            'SS': 'dns',
            'SSR': 'dns',
            'WireGuard': 'security',
            'MTProto': 'send',
            'Hysteria2': 'bolt',
            'REALITY': 'visibility',
            'SOCKS5': 'settings_ethernet',
            'HTTP/HTTPS': 'http',
            'OpenVPN': 'lock_open',
            'L2TP/IPSec': 'vpn_lock',
            'SSTP': 'lock',
            'IKEv2': 'key',
            'PPTP': 'router'
        };
        return icons[protocol] || 'shield';
    }


    /**
     * Adds a configuration to the list in the UI.
     * @param {string} configString - The full configuration string.
     */
    function addConfigToList(configString) {
        const protocolInfo = identifyProtocol(configString);
        if (!protocolInfo) {
            return; // Don't add if not identifiable
        }

        const listItem = document.createElement('li');
        listItem.className = 'config-item';
        listItem.dataset.config = configString;

        listItem.innerHTML = `
            <span class="material-icons config-icon">${getProtocolIcon(protocolInfo.protocol)}</span>
            <div class="config-details">
                <div class="config-protocol">${protocolInfo.name}</div>
                <div class="config-info">${protocolInfo.protocol} Config</div>
            </div>
            <div class="config-ping ping-na">n/a</div>
        `;
        configList.appendChild(listItem);
    }
    
    /**
     * Simulates a ping test for a single configuration item.
     * @param {HTMLElement} listItem - The list item element to test.
     */
    function testConnection(listItem) {
        const pingElement = listItem.querySelector('.config-ping');
        pingElement.textContent = '...'; // Testing in progress
        pingElement.className = 'config-ping ping-na';
        
        // --- SIMULATION ---
        // Real-world pinging of these protocols from a browser is not directly possible
        // due to security restrictions. This is a simulation.
        // We generate a random "ping" to demonstrate functionality.
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% chance of success
            if (success) {
                const pingTime = Math.floor(Math.random() * 400) + 50; // 50-450ms
                pingElement.textContent = `${pingTime}ms`;
                pingElement.className = 'config-ping ping-success';
            } else {
                pingElement.textContent = 'n/a';
                pingElement.className = 'config-ping ping-na';
            }
        }, Math.random() * 2000 + 500); // Simulate network delay
    }

    /**
     * Tests all configurations in the list.
     */
    function testAllConnections() {
        const items = configList.querySelectorAll('.config-item');
        if (items.length === 0) {
            showToast('No configurations to test.', 'info');
            return;
        }
        items.forEach(testConnection);
    }

    /**
     * Reads from clipboard and adds configurations.
     */
    async function addFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            const configs = text.split(/\r?\n/).filter(line => line.trim() !== '');
            let addedCount = 0;
            
            configs.forEach(config => {
                if (identifyProtocol(config)) {
                    addConfigToList(config);
                    addedCount++;
                }
            });

            if (addedCount > 0) {
                showToast(`Added ${addedCount} configuration(s) from clipboard.`, 'info');
            } else {
                showToast('No valid configurations found in clipboard.', 'error');
            }
        } catch (error) {
            console.error('Failed to read clipboard:', error);
            showToast('Could not access clipboard.', 'error');
        }
    }

    /**
     * Fetches configs from a URL (simulated).
     */
    function fetchFromUrl() {
        const url = urlInput.value.trim();
        if (!url) {
            showToast('Please enter a URL.', 'error');
            return;
        }
        
        // --- SIMULATION ---
        // Actual fetching would require CORS-enabled endpoints or a backend proxy.
        // This is a placeholder demonstrating the UI flow.
        showToast(`Fetching from ${url}...`, 'info');
        closeModal();
        
        // Clear existing list and show banner
        configList.innerHTML = '';
        sourceUrlText.textContent = url;
        sourceBanner.style.display = 'flex';
        
        // Dummy configs for demonstration
        const dummyConfigs = [
            'vless://user@host:443?encryption=none&security=tls&sni=example.com#VLESS-TLS',
            'ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ@1.1.1.1:8888#Shadowsocks-Sample',
            'trojan://password@host.com:443#Trojan-Example',
            'tg://proxy?server=1.2.3.4&port=443&secret=dd00112233445566778899aabbccddeeff'
        ];
        
        setTimeout(() => {
            dummyConfigs.forEach(addConfigToList);
            showToast(`Found ${dummyConfigs.length} configs. Now testing...`, 'info');
            testAllConnections();
        }, 1500);
    }

    function closeModal() {
        liveCheckModal.style.display = 'none';
        urlInput.value = '';
    }

    // --- Event Listeners ---
    mainHeader.addEventListener('click', toggleTheme);
    testAllBtn.addEventListener('click', testAllConnections);
    addFromClipboardBtn.addEventListener('click', addFromClipboard);
    
    liveCheckBtn.addEventListener('click', () => {
        liveCheckModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', closeModal);
    fetchConfigsBtn.addEventListener('click', fetchFromUrl);
    
    clearSourceBtn.addEventListener('click', () => {
        sourceBanner.style.display = 'none';
        sourceUrlText.textContent = '';
        configList.innerHTML = ''; // Clear the list as the source is removed
        showToast('Source cleared.', 'info');
    });

    // Close modal if clicked outside the content
    window.addEventListener('click', (event) => {
        if (event.target === liveCheckModal) {
            closeModal();
        }
    });
});
