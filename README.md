# Ease

An e-commerce web app

```bash
git clone git@github.com:ken-980/ease-ecom.git
```

## Get it running ☻

```bash
# set database password.
mkdir docker && touch docker/password.txt
```

```bash
# set env variables as in .env-example
touch backend/.env && touch frontend/.env.local
cp backend/.env-template backend/.env
cp frontend/.env-local-template frontend/.env.local
```

```bash
# docker run
docker compose up -d
```
