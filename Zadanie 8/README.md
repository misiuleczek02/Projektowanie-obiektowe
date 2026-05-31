# Zadanie 8

Wzięłam aplikację z Zadania 7 (sklep: React + Node/Express + testy Playwright), zapakowałam ją w Dockera i dorobiłam pipeline w GitHub Actions, który sam buduje, testuje, wrzuca obrazy do chmury i wysyła maila o wyniku.

## Co gdzie jest

| Punkt | Co | Gdzie |
| ----- | -- | ----- |
| 3.0 | Aplikacja na Dockerze (serwer + klient) | [app/backend/Dockerfile](app/backend/Dockerfile), [app/frontend/Dockerfile](app/frontend/Dockerfile), [app/frontend/nginx.conf](app/frontend/nginx.conf), [docker-compose.yml](docker-compose.yml) |
| 3.5 | Pipeline budujący aplikację | job `build` w [zad8-cicd.yml](../.github/workflows/zad8-cicd.yml) |
| 4.0 | Mail o zbudowaniu aplikacji | job `notify` |
| 4.5 | Deploy serwera i klienta do chmury | job `deploy` (obrazy lecą do GHCR) |
| 5.0 | Regresyjne testy funkcjonalne w Actions | job `regression-tests` (Playwright) |

## Jak działa

Frontend (React) jest budowany na sztywno do statycznych plików i serwowany przez nginx. Nginx dodatkowo przepuszcza wszystko spod `/api/` do kontenera backendu, więc z punktu widzenia przeglądarki wszystko leci z jednego adresu (`:8080`) i ciasteczka sesji działają bez kombinowania z CORS.

```
przeglądarka  ──:8080──►  frontend (nginx + React)  ──/api/*──►  backend (Node :5000)
```

## Odpalenie lokalnie (Docker)

```powershell
cd "Zadanie 8"
docker compose up --build
```

- sklep: http://localhost:8080
- health backendu: http://localhost:8080/api/health

Wyłączenie: `docker compose down`.

## Pipeline

Plik: [.github/workflows/zad8-cicd.yml](../.github/workflows/zad8-cicd.yml). Odpala się przy pushu/PR na `main` (gdy ruszę coś w `Zadanie 8/`) albo ręcznie z zakładki Actions.

Joby idą po kolei:

```
build (3.5) → regression-tests (5.0) → deploy (4.5) → notify (4.0)
```

- **build** – `npm ci` + `npm run build` dla backendu i frontendu, potem `docker build` obu obrazów.
- **regression-tests** – podnosi cały stack przez compose, czeka aż wstanie, instaluje Playwright i puszcza testy ([e2e-full-journey.spec.ts](playwright-tests/tests/e2e-full-journey.spec.ts)) na żywych kontenerach.
- **deploy** – tylko na pushu do `main`. Loguje się do GHCR i wypycha `zad8-backend` i `zad8-frontend` (tagi `latest` i `:<sha>`).
- **notify** – leci zawsze, ustala wynik (SUKCES / NIEPOWODZENIE) i wysyła maila.

## Sekrety (Settings → Secrets and variables → Actions)

Dla maila potrzebne są trzy:

| Sekret | Co wpisać |
| ------ | --------- |
| `MAIL_USERNAME` | adres Gmail nadawcy |
| `MAIL_PASSWORD` | hasło aplikacji Gmail (16 znaków, nie zwykłe hasło) |
| `MAIL_TO` | gdzie ma przyjść powiadomienie |

`MAIL_SERVER` i `MAIL_PORT` są opcjonalne (domyślnie `smtp.gmail.com` + `465`). Do GHCR nic nie trzeba – działa na wbudowanym `GITHUB_TOKEN`. Krok z mailem ma `continue-on-error`, więc brak sekretów nie wywala całego pipeline.

## Testy lokalnie

```powershell
cd "Zadanie 8"
docker compose up -d --build
cd playwright-tests
npm ci
npx playwright install chromium
$env:FRONTEND_URL = "http://localhost:8080"; $env:BACKEND_URL = "http://localhost:8080"
npm test
```
