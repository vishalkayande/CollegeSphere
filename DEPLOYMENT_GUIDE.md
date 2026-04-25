# CollegeSphere Deployment Guide (AWS EC2 + Cloudflare)

This guide provides step-by-step instructions to deploy the CollegeSphere project on an AWS EC2 instance using Nginx and Cloudflare Tunnels.

---

## 🏗️ Phase 1: AWS EC2 Setup

1.  **Launch Instance**:
    *   Select **Ubuntu 22.04 LTS** (64-bit).
    *   Instance type: `t2.micro` (Free Tier eligible).
    *   **Security Group**: Allow **SSH (22)**, **HTTP (80)**, and **Custom TCP (5002)** for the backend.

2.  **Connect to EC2**:
    ```bash
    ssh -i "your-key.pem" ubuntu@your-ec2-ip
    ```

3.  **Install Dependencies**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs nginx git
    sudo npm install -g pm2
    ```

---

## 🚀 Phase 2: Code Deployment

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/vishalkayande/CollegeSphere.git
    cd CollegeSphere
    ```

2.  **Setup Backend**:
    ```bash
    cd backend
    npm install
    nano .env
    ```
    *Paste your `.env` content (MongoDB URL, Brevo Credentials, etc.).*
    *Start the backend:*
    ```bash
    pm2 start server.js --name "college-api"
    ```

3.  **Setup Frontend**:
    ```bash
    cd ../frontend
    npm install
    nano .env
    ```
    *Add the following line (replace with your IP):*
    ```env
    VITE_API_URL=http://YOUR_EC2_PUBLIC_IP:5002
    ```
    *Build the production files:*
    ```bash
    npm run build
    ```

---

## 🌐 Phase 3: Nginx Configuration (Direct IP Access)

1.  **Edit Nginx Config**:
    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```

2.  **Replace content with**:
    ```nginx
    server {
        listen 80;
        server_name _; # Responds to any IP

        root /home/ubuntu/CollegeSphere/frontend/dist;
        index index.html;

        location / {
            try_files $uri /index.html;
        }

        location /api {
            proxy_pass http://localhost:5002;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **Test and Restart**:
    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```

---

## ☁️ Phase 4: Cloudflare Tunnel Setup

1.  Go to **Cloudflare Dashboard** -> **Zero Trust** -> **Networks** -> **Tunnels**.
2.  Click **Create a Tunnel** (name it "CollegeSphere").
3.  Choose **Connector** (Debian 64-bit) and copy the command provided. Run it on your EC2.
4.  In **Public Hostname**:
    *   Subdomain: `www` (or leave blank)
    *   Domain: `yourdomain.com`
    *   Service: `HTTP://localhost:80`
5.  Click **Save**. Your site is now live on your domain!

---

## ✅ Verification
*   **Direct IP**: Open `http://YOUR_EC2_PUBLIC_IP` in your browser.
*   **Domain**: Open `http://yourdomain.com` in your browser.
*   **Backend**: Check `http://YOUR_EC2_PUBLIC_IP:5002/api/health` (if route exists).

---
*Generated on 2026-04-25 for CollegeSphere Project.*
