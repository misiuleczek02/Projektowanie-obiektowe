# Zadanie 7

Testy do aplikacji React z koszykiem (z Zadania 6). W folderze `app/` siedzi rozszerzona kopia tamtej aplikacji - dorzuciłam rejestrację, logowanie, ustawienia konta i koszyk w localStorage, żeby dało się przetestować wszystkie podpunkty.

## Co gdzie jest

| Punkt | Co |
| ----- | -- |
| 3.0 | rejestracja + walidacja: `app/frontend/src/components/Register.tsx`, testy: `selenium-tests/test_3_0_registration_validation.py` |
| 3.5 | XSS: `selenium-tests/test_3_5_xss.py` |
| 4.0 | koszyk w wielu kartach: `app/frontend/src/context/CartContext.tsx` + `selenium-tests/test_4_0_cart_multi_tab.py` |
| 4.5 | login + CSRF: `app/frontend/src/components/Login.tsx`, `app/backend/server.js`, testy: `selenium-tests/test_4_5_csrf.py` |
| 5.0 | E2E Playwright: `playwright-tests/tests/e2e-full-journey.spec.ts` |

## Wymagania

- Node 18+
- Python 3.10+
- Chrome

## Uruchomienie aplikacji

Dwa terminale.

Backend:

```powershell
cd "Zadanie 7\app\backend"
npm install
npm start
```

Frontend:

```powershell
cd "Zadanie 7\app\frontend"
npm install
npm start
```

Po chwili powinno otworzyć się `http://localhost:3000`.

## Selenium (3.0 - 4.5)

```powershell
cd "Zadanie 7\selenium-tests"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pytest
```

Można odpalać też pojedyncze pliki, np. `pytest test_3_5_xss.py -v`.

## Playwright (5.0)

```powershell
cd "Zadanie 7\playwright-tests"
npm install
npx playwright install chromium
npm test
```

Raport HTML: `npm run report`.

## Uwagi

Endpoint `POST /api/account/update` w backendzie jest celowo podatny na CSRF (brak tokena, brak sprawdzania Origin, akceptuje urlencoded). Tak ma być - inaczej test 4.5 nie miałby czego pokazywać.

Dane lecą do pamięci, nie ma żadnej bazy. Endpoint `POST /api/_test/reset` czyści stan między testami.
