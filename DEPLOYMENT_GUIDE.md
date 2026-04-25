# CollegeSphere Deployment Guide (AWS EC2 + Docker)

This guide provides a streamlined process for deploying CollegeSphere on an AWS EC2 instance using Docker containerization. This method is secure, scalable, and easy to maintain.

---

## 🐋 Step 1: EC2 Server Preparation

1.  **Launch Instance**:
    *   **OS**: Ubuntu 22.04 LTS (Recommended).
    *   **Instance Type**: `t2.micro` (Free Tier) or higher.
    *   **Security Group**: 
        *   Allow **SSH (22)** for access.
        *   Allow **HTTP (80)** for the web interface.
        *   Allow **Custom TCP (5002)** for backend API (if needed for direct testing, though Docker handles internal routing).

2.  **Install Docker & Docker Compose**:
    Connect to your EC2 via SSH and run:
    ```bash
    sudo apt update
    sudo apt install docker.io docker-compose -y
    sudo systemctl start docker
    sudo systemctl enable docker
    # Add your user to the docker group to run without sudo (optional)
    sudo usermod -aG docker $USER
    ```
    *Note: If you add your user to the docker group, log out and back in for changes to take effect.*

---

## 🚀 Step 2: Deploying the Application

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/vishalkayande/CollegeSphere.git
    cd CollegeSphere
    ```

2.  **Setup Secrets (.env)**:
    Create a `.env` file in the root directory. This file is ignored by git to keep your secrets safe.
    ```bash
    nano .env
    ```
    Paste the following template and update with your actual production values:
    ```env
    PORT=5002
    MONGODB_URI=mongodb://mongodb:27017/collegesphere
    JWT_SECRET=your_production_secret_key
    NODE_ENV=production
    SMTP_HOST=smtp-relay.brevo.com
    SMTP_PORT=587
    SMTP_USER=your_brevo_user
    SMTP_PASS=your_brevo_password
    FROM_NAME=CollegeSphere
    FROM_EMAIL=your_verified_email@example.com
    ```

3.  **Launch the Containers**:
    ```bash
    docker login
    sudo docker-compose up -d --build
    ```
    The `-d` flag runs the containers in the background (detached mode).

---

## 🌐 Step 3: Accessing the App

1.  **Direct IP Access**:
    Open your browser and navigate to `http://YOUR_EC2_PUBLIC_IP`.
    The frontend is configured to automatically detect the host and communicate with the backend on port 5002.

2.  **Cloudflare Tunnel (Optional for Domain & SSL)**:
    If you want to use a custom domain with HTTPS:
    *   Go to **Cloudflare Zero Trust Dashboard** -> **Networks** -> **Tunnels**.
    *   Create a new tunnel and follow the instructions to install the `cloudflared` connector on your EC2.
    *   Map your domain (e.g., `college.yourdomain.com`) to `http://localhost:80`.

---

## ✅ Step 4: Verification & Logs

*   **Check running containers**: `sudo docker ps`
*   **View logs**: `sudo docker-compose logs -f`
*   **Stop application**: `sudo docker-compose down`

---

