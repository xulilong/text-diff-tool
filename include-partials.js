(function () {
    const fallbackPartials = {
        'partials/header.html': `
            <header class="app-header">
                <div class="header-container">
                    <div class="header-left">
                        <div class="brand">
                            <div class="brand-icon">⚡</div>
                            <div class="brand-text">
                                <h1>专业文本对比工具</h1>
                                <p>Professional Text Diff Tool</p>
                            </div>
                        </div>
                        <nav class="header-nav">
                            <a href="index.html" class="nav-link" data-page="diff">文本对比</a>
                            <a href="json-tools.html" class="nav-link" data-page="json">JSON格式化</a>
                        </nav>
                    </div>
                    <div class="header-actions" data-header-slot></div>
                </div>
            </header>
        `,
        'partials/footer.html': `
            <style>
                .app-footer {
                    margin-top: 48px;
                    border-top: 1px solid var(--border-default);
                    background: var(--bg-primary);
                    padding: 20px 24px 32px;
                }
                .footer-cta {
                    max-width: 1920px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 32px;
                    flex-wrap: wrap;
                    text-align: center;
                }
                .footer-brand {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    color: var(--text-secondary);
                    font-size: 13px;
                }
                .footer-brand small {
                    font-size: 12px;
                    color: var(--text-tertiary);
                }
                .footer-center {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-secondary);
                    font-size: 13px;
                }
                .support-text {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .support-text .emoji {
                    font-size: 16px;
                }
                .footer-divider {
                    color: var(--border-default);
                }
                .footer-contact a {
                    color: var(--accent-blue);
                    text-decoration: none;
                    font-weight: 500;
                }
                .footer-contact a:hover {
                    text-decoration: underline;
                }
                .donate-button {
                    padding: 6px 18px;
                    background: linear-gradient(135deg, #ffd700, #ffed4e);
                    color: #7c5d00;
                    border: none;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
                }
                .donate-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
                }
                .footer-links a {
                    color: var(--text-secondary);
                    text-decoration: none;
                    font-size: 13px;
                }
                .footer-links a:hover {
                    color: var(--accent-blue);
                }
                @media (max-width: 768px) {
                    .footer-cta {
                        flex-direction: column;
                        gap: 16px;
                    }
                    .footer-center {
                        flex-direction: column;
                        gap: 4px;
                    }
                }
            </style>
            <footer class="app-footer">
                <div class="footer-cta">
                    <div class="footer-brand">
                        <span>© <span id="footerYear"></span> Text Diff Tool · json.asia</span>
                        <small>精准文本对比与 JSON 工具箱</small>
                    </div>
                    <div class="footer-center">
                        <div class="support-text">
                            <span class="emoji">☕</span>
                            <span>觉得好用？请作者喝杯咖啡</span>
                        </div>
                        <span class="footer-divider">·</span>
                         <button class="donate-button" onclick="if (window.toggleDonate) { toggleDonate(); }">
                        <span>❤️</span>
                        <span>请作者喝杯咖啡</span>
                         </button>
                      
                    </div>
                    <div class="footer-links">
                      <a href="mailto:xulilong@qq.com">问题反馈</a>
                        <a href="https://json.asia/sitemap.xml" target="_blank" rel="noopener">站点地图</a>
                    </div>
                </div>
            </footer>
        `
    };

    async function includePartials() {
        const includeNodes = Array.from(document.querySelectorAll('[data-include]'));
        if (!includeNodes.length) {
            hydrateSharedSections();
            return;
        }

        await Promise.all(includeNodes.map(async (node) => {
            const file = node.getAttribute('data-include');
            if (!file) return;
            try {
                const html = await fetchPartial(file);
                injectHTML(node, html);
            } catch (error) {
                console.error('加载公共片段失败:', file, error);
                if (fallbackPartials[file]) {
                    injectHTML(node, fallbackPartials[file]);
                }
            }
        }));

        hydrateSharedSections();
    }

    async function fetchPartial(file) {
        const response = await fetch(file);
        if (!response.ok) throw new Error(response.statusText);
        return response.text();
    }

    function injectHTML(targetNode, html) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        const fragment = document.createDocumentFragment();
        while (wrapper.firstChild) {
            fragment.appendChild(wrapper.firstChild);
        }
        targetNode.replaceWith(fragment);
    }

    function hydrateSharedSections() {
        activateNavLink();
        injectHeaderActions();
        setupFooterYear();
    }

    function activateNavLink() {
        const currentPage = document.body.dataset.page;
        if (!currentPage) return;
        document.querySelectorAll('.header-nav .nav-link').forEach((link) => {
            if (link.dataset.page === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function injectHeaderActions() {
        const slot = document.querySelector('[data-header-slot]');
        const actions = document.body.dataset.headerActions;
        if (!slot) return;

        if (actions === 'diff' || actions === 'json') {
            slot.innerHTML = `
                <button class="history-button" onclick="toggleHistory()">
                    <span>📜</span>
                    <span>历史</span>
                </button>
                <button class="share-button" onclick="toggleShare()">
                    <span>🔗</span>
                    <span>分享</span>
                </button>
                <button class="help-button" onclick="toggleHelp()">
                    <span>❓</span>
                    <span>帮助</span>
                </button>
            `;
        } else {
            slot.innerHTML = '';
        }
    }

    function setupFooterYear() {
        const yearNode = document.getElementById('footerYear');
        if (yearNode) {
            yearNode.textContent = new Date().getFullYear();
        }
    }

    document.addEventListener('DOMContentLoaded', includePartials);
})();

