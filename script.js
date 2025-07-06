    // --- https://im-connected-omega.vercel.app/ ---
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
    function identifyAndGroupProtocols(configs) {
    const groups = {};
    const protocolMatchers = [
        // Link-based protocols
        { id: 'VLESS', name: 'VLESS', pattern: /vless:\/\//i },
        { id: 'VMess', name: 'VMess', pattern: /vmess:\/\//i },
        { id: 'Trojan', name: 'Trojan', pattern: /trojan:\/\//i },
        { id: 'SS', name: 'Shadowsocks', pattern: /ss:\/\//i },
        { id: 'SSR', name: 'ShadowsocksR', pattern: /ssr:\/\//i },
        { id: 'Hysteria2', name: 'Hysteria2', pattern: /hysteria2:\/\//i },
        { id: 'MTProto', name: 'MTProto', pattern: /tg:\/\/proxy/i },
        { id: 'SOCKS5', name: 'SOCKS5', pattern: /socks5:\/\//i },
        
        // Text-based config identifiers (basic recognition)
        { id: 'WireGuard', name: 'WireGuard', pattern: /\[Interface\]/i },
        { id: 'OpenVPN', name: 'OpenVPN', pattern: /^client/im },
    ];

    configs.forEach(config => {
        let found = false;
        for (const matcher of protocolMatchers) {
            // For text-based, we check the whole config block
            if (matcher.id === 'WireGuard' || matcher.id === 'OpenVPN') {
                 if (matcher.pattern.test(config)) {
                    if (!groups[matcher.id]) {
                        groups[matcher.id] = { name: matcher.name, links: [] };
                    }
                    groups[matcher.id].links.push("Text config detected. Click to see details.");
                    found = true;
                    break;
                }
            }
            // For link-based
            else if (matcher.pattern.test(config)) {
                if (!groups[matcher.id]) {
                    groups[matcher.id] = { name: matcher.name, links: [] };
                }
                groups[matcher.id].links.push(config);
                found = true;
                break;
            }
        }
    });
    return groups;
}

    /**
 * Creates a temporary DOM element to parse HTML string.
 * @param {string} htmlString - The raw HTML content from the backend.
 * @returns {Document} A parsable HTML document.
 */
function parseHtml(htmlString) {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, 'text/html');
}

/**
 * Extracts all valid proxy links from the parsed HTML document.
 * @param {Document} doc - The HTML document to parse.
 * @returns {string[]} An array of found configuration links.
 */
function extractLinksFromDoc(doc) {
    const links = [];
    const anchors = doc.querySelectorAll('a'); // Get all <a> tags
    const linkPatterns = [
        /tg:\/\/proxy/i,
        /vless:\/\//i,
        /vmess:\/\//i,
        /trojan:\/\//i,
        /ss:\/\//i,
        /ssr:\/\//i,
        /hysteria2:\/\//i,
    ];

    anchors.forEach(a => {
        const href = a.href;
        if (href) {
            for (const pattern of linkPatterns) {
                if (pattern.test(href)) {
                    links.push(href);
                    break; // Move to the next <a> tag once a match is found
                }
            }
        }
    });
    return links;
}
    
    /**
     * Gets a corresponding Google Icon for a protocol.
     * @param {string} protocol - The protocol identifier (e.g., 'VMess').
     * @returns {string} The name of the Material Icon.
     */
    function getProtocolIcon(protocolId) {
    const icons = {
        'VMess': 'hub',
        'VLESS': 'hub',
        'Trojan': 'vpn_key',
        'SS': 'dns',
        'SSR': 'dns',
        'WireGuard': 'security',
        'MTProto': 'send',
        'Hysteria2': 'bolt',
        'SOCKS5': 'settings_ethernet',
        'HTTP/HTTPS': 'http',
        'OpenVPN': 'lock_open',
        'L2TP/IPSec': 'vpn_lock',
        'SSTP': 'lock',
        'IKEv2': 'key',
        'PPTP': 'router'
    };
    return icons[protocolId] || 'shield';
}


    /**
     * Adds a configuration to the list in the UI.
     * @param {string} configString - The full configuration string.
     */
    function addConfigGroupToList(protocolId, groupData) {
    const listItem = document.createElement('li');
    listItem.className = 'config-item';
    listItem.dataset.protocol = protocolId;

    const linksHtml = groupData.links.map(link => `
        <li class="link-item">
            <span class="link-text">${link}</span>
            <button class="material-icons copy-btn" title="Copy Link">content_copy</button>
        </li>
    `).join('');

    listItem.innerHTML = `
        <div class="config-item-header">
            <span class="material-icons config-icon">${getProtocolIcon(protocolId)}</span>
            <div class="config-details">
                <div class="config-protocol">${groupData.name}</div>
                <div class="config-info">${groupData.links.length} configurations found</div>
            </div>
            <div class="config-ping ping-na">
                n/a
                <span class="material-icons expand-icon">expand_more</span>
            </div>
        </div>
        <div class="collapsible-content">
            <ul class="links-list">${linksHtml}</ul>
            <button class="copy-all-btn">
                <span class="material-icons">content_copy</span>
                Copy All ${groupData.name} Links
            </button>
        </div>
    `;
    configList.appendChild(listItem);
}
    
    /**
     * Simulates a ping test for a single configuration item.
     * @param {HTMLElement} listItem - The list item element to test.
     */
    function testConnection(listItem) {
    const pingElement = listItem.querySelector('.config-ping');
    pingElement.childNodes[0].nodeValue = '... '; // Testing in progress

    setTimeout(() => {
        const success = Math.random() > 0.3;
        if (success) {
            const pingTime = Math.floor(Math.random() * 400) + 50;
            pingElement.childNodes[0].nodeValue = `${pingTime}ms `;
            pingElement.classList.add('ping-success');
            pingElement.classList.remove('ping-na');
        } else {
            pingElement.childNodes[0].nodeValue = 'n/a ';
            pingElement.classList.remove('ping-success');
            pingElement.classList.add('ping-na');
        }
    }, Math.random() * 2000 + 500);
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
        const configs = text.split(/\r?\n/).filter(line => line.trim() !== '' && line.includes('://'));
        
        if (configs.length === 0) {
             showToast('No valid configurations found in clipboard.', 'error');
             return;
        }

        const groups = identifyAndGroupProtocols(configs);
        if (Object.keys(groups).length === 0) {
            showToast('Could not identify any known protocols.', 'error');
            return;
        }

        configList.innerHTML = ''; // Clear previous list
        for (const protocolId in groups) {
            addConfigGroupToList(protocolId, groups[protocolId]);
        }
        showToast(`Added ${configs.length} configs from clipboard.`, 'info');

    } catch (error) {
        console.error('Failed to read clipboard:', error);
        showToast('Could not access clipboard.', 'error');
    }
}

async function fetchFromUrl() {
    const url = urlInput.value.trim();
    if (!url) {
        showToast('Please enter a URL.', 'error');
        return;
    }
    
    showToast(`Fetching from ${url}...`, 'info');
    closeModal();
    
    configList.innerHTML = '';
    sourceUrlText.textContent = url;
    sourceBanner.style.display = 'flex';

    // Construct the URL to our own backend function on Vercel
    const apiUrl = `/api/fetch?url=${encodeURIComponent(url)}`;

    try {
        // Call our backend
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const htmlContent = await response.text();

        // Parse the received HTML and extract links
        const doc = parseHtml(htmlContent);
        const extractedLinks = extractLinksFromDoc(doc);

        if (extractedLinks.length === 0) {
            showToast('No valid configuration links found on that page.', 'info');
            return;
        }

        // Group and display the real links
        const groups = identifyAndGroupProtocols(extractedLinks);
        for (const protocolId in groups) {
            addConfigGroupToList(protocolId, groups[protocolId]);
        }
        showToast(`Found and grouped ${extractedLinks.length} links. Now testing...`, 'info');
        testAllConnections();

    } catch (error) {
        console.error('Error fetching via backend:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

    // --- Event Delegation for Dynamic Content ---
configList.addEventListener('click', (e) => {
    // --- Click on Header to Expand/Collapse ---
    const header = e.target.closest('.config-item-header');
    if (header) {
        header.parentElement.classList.toggle('expanded');
        return;
    }

    // --- Click on Individual Copy Button ---
    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) {
        const linkText = copyBtn.previousElementSibling.textContent;
        navigator.clipboard.writeText(linkText).then(() => {
            showToast('Link copied to clipboard!', 'info');
        }, (err) => {
            showToast('Failed to copy link.', 'error');
            console.error('Copy failed', err);
        });
        return;
    }

    // --- Click on Copy All Button ---
    const copyAllBtn = e.target.closest('.copy-all-btn');
    if (copyAllBtn) {
        const links = copyAllBtn.parentElement.querySelectorAll('.link-text');
        const allLinksText = Array.from(links).map(link => link.textContent).join('\n');
        navigator.clipboard.writeText(allLinksText).then(() => {
            showToast('All links copied!', 'info');
        }, (err) => {
            showToast('Failed to copy links.', 'error');
            console.error('Copy all failed', err);
        });
    }
});
    
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
