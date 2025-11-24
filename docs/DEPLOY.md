# 部署指南

本文档介绍如何将文本对比工具部署到各种平台。

## 📋 目录

- [GitHub Pages](#github-pages)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Cloudflare Pages](#cloudflare-pages)
- [自托管](#自托管)

---

## GitHub Pages

### 部署步骤

1. **推送代码到GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/text-diff-tool.git
git push -u origin main
```

2. **启用GitHub Pages**
   - 进入仓库的 Settings
   - 找到 Pages 部分
   - Source 选择 `main` 分支
   - 目录选择 `/ (root)`
   - 点击 Save

3. **访问站点**
   - 地址：`https://yourusername.github.io/text-diff-tool/`
   - 等待几分钟部署完成

### 自定义域名（可选）

1. 在仓库根目录创建 `CNAME` 文件
```bash
echo "diff.yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

2. 在域名DNS设置中添加记录
```
Type: CNAME
Name: diff
Value: yourusername.github.io
```

---

## Netlify

### 方式一：通过Git部署（推荐）

1. **登录Netlify**
   - 访问 https://netlify.com
   - 使用GitHub账号登录

2. **导入项目**
   - 点击 "New site from Git"
   - 选择 GitHub
   - 选择你的仓库

3. **配置构建**
   - Build command: 留空
   - Publish directory: `.`
   - 点击 "Deploy site"

4. **完成**
   - 获得域名：`random-name.netlify.app`
   - 可以自定义域名

### 方式二：拖拽部署

1. 登录 Netlify
2. 拖拽项目文件夹到页面
3. 自动部署完成

### 配置文件（可选）

创建 `netlify.toml`：
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Vercel

### 部署步骤

1. **登录Vercel**
   - 访问 https://vercel.com
   - 使用GitHub账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的GitHub仓库
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: Other
   - Build Command: 留空
   - Output Directory: `.`
   - Install Command: 留空

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成
   - 获得域名：`your-project.vercel.app`

### 配置文件（可选）

创建 `vercel.json`：
```json
{
  "buildCommand": null,
  "outputDirectory": ".",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## Cloudflare Pages

### 部署步骤

1. **登录Cloudflare**
   - 访问 https://pages.cloudflare.com
   - 登录账号

2. **创建项目**
   - 点击 "Create a project"
   - 连接 GitHub
   - 选择仓库

3. **配置构建**
   - Framework preset: None
   - Build command: 留空
   - Build output directory: `/`

4. **部署**
   - 点击 "Save and Deploy"
   - 获得域名：`your-project.pages.dev`

### 优势
- 免费
- 全球CDN加速
- 自动HTTPS
- 无限流量

---

## 自托管

### 使用Nginx

1. **安装Nginx**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

2. **配置站点**

创建配置文件 `/etc/nginx/sites-available/text-diff-tool`：
```nginx
server {
    listen 80;
    server_name diff.yourdomain.com;
    root /var/www/text-diff-tool;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **部署文件**
```bash
sudo mkdir -p /var/www/text-diff-tool
sudo cp -r /path/to/text-diff-tool/* /var/www/text-diff-tool/
sudo chown -R www-data:www-data /var/www/text-diff-tool
```

4. **启用站点**
```bash
sudo ln -s /etc/nginx/sites-available/text-diff-tool /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. **配置SSL（可选，使用Let's Encrypt）**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d diff.yourdomain.com
```

### 使用Apache

1. **安装Apache**
```bash
sudo apt update
sudo apt install apache2
```

2. **配置站点**

创建 `/etc/apache2/sites-available/text-diff-tool.conf`：
```apache
<VirtualHost *:80>
    ServerName diff.yourdomain.com
    DocumentRoot /var/www/text-diff-tool
    
    <Directory /var/www/text-diff-tool>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/text-diff-tool-error.log
    CustomLog ${APACHE_LOG_DIR}/text-diff-tool-access.log combined
</VirtualHost>
```

3. **启用站点**
```bash
sudo a2ensite text-diff-tool
sudo systemctl reload apache2
```

### 使用Docker

1. **创建Dockerfile**
```dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

2. **构建镜像**
```bash
docker build -t text-diff-tool .
```

3. **运行容器**
```bash
docker run -d -p 80:80 text-diff-tool
```

4. **使用docker-compose（推荐）**

创建 `docker-compose.yml`：
```yaml
version: '3'
services:
  web:
    image: nginx:alpine
    volumes:
      - ./:/usr/share/nginx/html
    ports:
      - "8080:80"
    restart: unless-stopped
```

运行：
```bash
docker-compose up -d
```

---

## 性能优化

### 启用CDN

推荐使用以下CDN服务：
- Cloudflare（免费）
- AWS CloudFront
- 阿里云CDN
- 腾讯云CDN

### 缓存策略

```nginx
# Nginx缓存配置
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

### 压缩传输

```nginx
# 启用gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;
```

---

## 安全建议

### 1. HTTPS强制

```nginx
# Nginx配置
server {
    listen 80;
    server_name diff.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name diff.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # 其他配置...
}
```

### 2. 安全头部

```nginx
# 添加安全头部
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https: 'unsafe-inline' 'unsafe-eval'" always;
```

### 3. 限流

```nginx
# 限制请求频率
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    location / {
        limit_req zone=mylimit burst=20;
        # 其他配置...
    }
}
```

---

## 监控和分析

### Google Analytics（可选）

在 `index.html` 的 `<head>` 中添加：
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 简单访问统计

使用Netlify Analytics、Vercel Analytics或Cloudflare Web Analytics。

---

## 故障排查

### 常见问题

1. **404错误**
   - 检查文件路径
   - 检查Web服务器配置
   - 确保index.html存在

2. **CSS/JS加载失败**
   - 检查CDN链接是否可访问
   - 检查CORS设置
   - 查看浏览器控制台错误

3. **性能慢**
   - 启用CDN
   - 开启gzip压缩
   - 检查网络连接

---

## 更新部署

### GitHub Pages / Netlify / Vercel / Cloudflare

```bash
# 直接推送更新
git add .
git commit -m "Update"
git push

# 自动部署
```

### 自托管服务器

```bash
# 拉取最新代码
cd /var/www/text-diff-tool
git pull

# 或者重新上传文件
scp -r ./* user@server:/var/www/text-diff-tool/
```

---

需要帮助？查看[主文档](../README.md)或[提交Issue](https://github.com/yourusername/text-diff-tool/issues)。

