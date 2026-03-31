# Contabo Deployment Notes

## Packages
- docker, docker compose plugin, ufw, fail2ban, unattended-upgrades.

## Bootstrapping
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release ufw fail2ban
# install Docker Engine + compose plugin per official docs
```

## Network hardening
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## App deploy
```bash
git clone <repo> rightbricks
cd rightbricks
cp .env.example .env
# edit secrets
sudo docker compose build
sudo docker compose up -d
```

## Operations
- Run migrations inside web container.
- Verify TLS issued by Caddy.
- Validate backups in `./backups` and test monthly restore.
