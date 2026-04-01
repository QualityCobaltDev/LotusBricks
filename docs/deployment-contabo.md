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

## DNS and TLS prerequisites (critical)
- Create `A` records for both `rightbricks.online` and `www.rightbricks.online` pointing to the VPS IPv4.
- Only create `AAAA` records if the VPS has fully working public IPv6 routing and inbound firewall rules for `80/tcp` and `443/tcp`.
- If IPv6 is not fully configured, remove `AAAA` records to prevent clients and ACME validation from using a broken path.
- Verify with:
  ```bash
  dig +short A rightbricks.online
  dig +short A www.rightbricks.online
  dig +short AAAA rightbricks.online
  dig +short AAAA www.rightbricks.online
  ```

## Operations
- Run migrations inside web container.
- Verify TLS issued by Caddy.
- Validate backups in `./backups` and test monthly restore.
