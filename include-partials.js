(function () {
    const ADSENSE_CLIENT = 'ca-pub-1211476692473879';
    const ADSENSE_SLOTS = {
        default: '7415878599',
        toolBottom: '7415878599',
        articleBottom: '7415878599'
    };

    const fallbackPartials = {
        'partials/header.html': `
            <header class="app-header">
                <div class="header-container">
                    <div class="header-left">
                        <div class="brand">
                            <div class="brand-icon">
                                <img src="images/logo-ai-256.png" alt="json.asia 工具箱">
                            </div>
                            <div class="brand-text">
                                <div class="brand-title">json.asia 工具箱</div>
                                <p>开发、文档与图片处理工具</p>
                            </div>
                        </div>
                        <nav class="header-nav">
                            <div class="nav-group">
                                <span class="nav-group-label">开发</span>
                                <a href="index.html" class="nav-link" data-page="diff">文本对比</a>
                                <a href="json-tools.html" class="nav-link" data-page="json">JSON格式化</a>
                            </div>
                            <div class="nav-group">
                                <span class="nav-group-label">图片</span>
                                <a href="photo-id.html" class="nav-link" data-page="photo">证件照制作</a>
                            </div>
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
                .footer-links {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    flex-wrap: wrap;
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
                        <span>© <span id="footerYear"></span> json.asia 工具箱</span>
                        <small>开发、文档与图片处理工具集合</small>
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
                        <a href="help.html">使用指南</a>
                        <a href="about.html">关于本站</a>
                        <a href="privacy.html">隐私政策</a>
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
        setupDonateModal();
        setupAdsense();
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

    function setupDonateModal() {
        ensureDonateStyles();
        ensureDonateMarkup();

        if (typeof window.toggleDonate !== 'function') {
            window.toggleDonate = function toggleDonate() {
                const modal = document.getElementById('donateModal');
                if (!modal) return;
                const isOpening = !modal.classList.contains('show');
                modal.classList.toggle('show');

                if (typeof window.trackEvent === 'function') {
                    window.trackEvent('donate', isOpening ? 'open' : 'close', 'donate_modal');
                }
            };
        }
    }

    function ensureDonateStyles() {
        if (document.getElementById('sharedDonateStyles')) return;
        const style = document.createElement('style');
        style.id = 'sharedDonateStyles';
        style.textContent = `
            .donate-modal {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 2001;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
            }

            .donate-modal.show {
                display: flex;
            }

            .donate-content {
                width: min(500px, 100%);
                max-height: calc(100vh - 40px);
                overflow: auto;
                padding: 32px;
                border: 1px solid var(--border-default);
                border-radius: var(--radius-md);
                background: var(--bg-elevated, var(--bg-primary));
                box-shadow: 0 18px 48px rgba(15, 23, 42, 0.22);
                text-align: center;
            }

            .donate-header {
                margin-bottom: 24px;
            }

            .donate-header h2 {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin: 0 0 8px;
                font-size: 20px;
                font-weight: 600;
            }

            .donate-header p {
                margin: 0;
                color: var(--text-secondary);
                font-size: 13px;
                line-height: 1.6;
            }

            .qr-codes {
                display: flex;
                justify-content: center;
                gap: 24px;
                margin: 24px 0;
            }

            .qr-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }

            .qr-item img {
                width: 200px;
                height: 200px;
                border-radius: var(--radius-md);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .qr-label {
                color: var(--text-primary);
                font-size: 13px;
                font-weight: 600;
            }

            .donate-footer {
                margin-top: 24px;
                padding-top: 20px;
                border-top: 1px solid var(--border-default);
            }

            .donate-footer p {
                margin: 0;
                color: var(--text-tertiary);
                font-size: 12px;
                line-height: 1.6;
            }

            .close-donate {
                margin-top: 20px;
                padding: 8px 24px;
                border: 1px solid var(--border-default);
                border-radius: var(--radius-sm);
                background: var(--bg-tertiary);
                color: var(--text-primary);
                font-size: 13px;
                cursor: pointer;
            }

            .close-donate:hover {
                background: var(--bg-elevated, var(--bg-primary));
                border-color: var(--text-secondary);
            }

            @media (max-width: 560px) {
                .donate-content {
                    padding: 24px 18px;
                }

                .qr-codes {
                    flex-direction: column;
                    align-items: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function ensureDonateMarkup() {
        if (document.getElementById('donateModal')) return;
        const modal = document.createElement('div');
        modal.className = 'donate-modal';
        modal.id = 'donateModal';
        modal.addEventListener('click', (event) => {
            if (event.target === modal && window.toggleDonate) {
                window.toggleDonate();
            }
        });
        modal.innerHTML = `
            <div class="donate-content">
                <div class="donate-header">
                    <h2>
                        <span>☕</span>
                        <span>感谢您的支持</span>
                    </h2>
                    <p>您的每一份支持都是我们持续改进的动力<br>如果这个工具帮到了您，欢迎请作者喝杯咖啡</p>
                </div>
                <div class="qr-codes">
                    <div class="qr-item">
                        <img src="images/wechat-pay.png" alt="微信赞赏码">
                        <div class="qr-label">💚 微信扫一扫</div>
                    </div>
                    <div class="qr-item">
                        <img src="images/alipay.png" alt="支付宝收款码">
                        <div class="qr-label">💙 支付宝扫一扫</div>
                    </div>
                </div>
                <div class="donate-footer">
                    <p>💡 所有功能永久免费使用，您的支持将帮助我们：<br>
                    · 持续优化产品体验<br>
                    · 增加更多实用功能<br>
                    · 保持服务稳定运行</p>
                </div>
                <button class="close-donate" type="button" onclick="toggleDonate()">关闭</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function setupAdsense() {
        const adNodes = Array.from(document.querySelectorAll('[data-ad-slot]'));
        if (!adNodes.length) return;

        ensureAdsenseStyles();
        ensureAdsenseScript();

        adNodes.forEach((node) => {
            if (node.dataset.adRendered === 'true') return;
            const slotKey = node.dataset.adSlot || 'default';
            const slotId = ADSENSE_SLOTS[slotKey] || ADSENSE_SLOTS.default;
            const isToolSlot = slotKey === 'toolBottom';
            node.dataset.adRendered = 'true';
            node.classList.add('ad-section');
            node.classList.add(`ad-section-${slotKey}`);
            node.setAttribute('aria-label', '广告');
            node.innerHTML = `
                <span class="ad-label">广告</span>
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="${ADSENSE_CLIENT}"
                     data-ad-slot="${slotId}"
                     data-ad-format="${isToolSlot ? 'horizontal' : 'auto'}"
                     data-full-width-responsive="${isToolSlot ? 'false' : 'true'}"></ins>
            `;

            requestAnimationFrame(() => {
                try {
                    window.adsbygoogle = window.adsbygoogle || [];
                    window.adsbygoogle.push({});
                } catch (error) {
                    console.warn('AdSense 初始化失败:', error);
                }
            });
        });
    }

    function ensureAdsenseScript() {
        if (document.getElementById('adsenseScript')) return;
        const script = document.createElement('script');
        script.id = 'adsenseScript';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
        document.head.appendChild(script);
    }

    function ensureAdsenseStyles() {
        if (document.getElementById('sharedAdsenseStyles')) return;
        const style = document.createElement('style');
        style.id = 'sharedAdsenseStyles';
        style.textContent = `
            .ad-section {
                width: min(1180px, calc(100% - 32px));
                min-height: 76px;
                margin: 20px auto 0;
                padding: 10px 12px;
                border: 1px solid var(--border-default);
                border-radius: var(--radius-md);
                background: var(--bg-primary);
                box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
            }

            .ad-section-toolBottom {
                max-height: 118px;
                overflow: hidden;
            }

            .ad-label {
                display: block;
                margin-bottom: 4px;
                color: var(--text-tertiary);
                font-size: 12px;
                line-height: 1.4;
            }

            .ad-section ins.adsbygoogle {
                min-height: 48px;
            }

            .ad-section-toolBottom ins.adsbygoogle {
                max-height: 90px;
            }

            @media (max-width: 820px) {
                .ad-section {
                    width: calc(100% - 32px);
                    margin-top: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.addEventListener('DOMContentLoaded', includePartials);
})();
