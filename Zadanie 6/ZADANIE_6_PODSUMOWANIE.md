# Zadanie 6 - Podsumowanie wykonania

## Wykonane zadania

### 3.0 Konfiguracja Husky + lint-staged
**Projekty:** `projects/js-projects/frontend` i `projects/js-projects/backend`

- Zainstalowano `husky` i `lint-staged`
- Skonfigurowano hook `pre-commit` uruchamiający lint-staged
- Dodano sekcję `lint-staged` w `package.json` dla obu projektów
- Hook uruchamia ESLint z auto-fix dla plików JS/TS/JSX

### 3.5 Eliminacja bugów w aplikacji klienckiej
**Projekt:** `projects/js-projects/frontend` (React TypeScript)

- Walidacja ilości produktów w koszyku (1-99)
- Walidacja formatu numeru karty kredytowej, daty ważności i CVV
- Automatyczne formatowanie numeru karty (spacje co 4 cyfry)
- Poprawiona obsługa błędów w kontekście koszyka

Pliki: `src/components/Cart.tsx`, `src/components/Payments.tsx`, `src/context/CartContext.tsx`

### 4.0 Skanowanie projektu open source narzędziem CodeQL
**Projekt:** Express.js (https://github.com/expressjs/express)

Zidentyfikowano 4 potencjalne problemy bezpieczeństwa: XSS (High), SQL Injection (Medium), Path Traversal (Medium), DoS (Low). Wszystkie z przykładowymi naprawami.

Dokumentacja: [`codeql-scan/CODEQL_ANALYSIS.md`](codeql-scan/CODEQL_ANALYSIS.md)

### 4.5 Usunięcie Code Smells + badge SonarCloud
**Projekty:** Kotlin, Go, JavaScript

- **Kotlin:** walidacja w konstruktorze `AuthRequest`, logowanie w kontrolerze, hashowanie haseł (SHA-256)
- **Go:** lepsze logowanie błędów, walidacja długości lokalizacji, limit max 10 lokalizacji
- **JavaScript:** walidacja danych wejściowych, lepsze komunikaty błędów, bezpieczeństwo płatności

Badge'e SonarCloud dodane do [`README.md`](README.md).

### 5.0 GitHub Actions z CodeQL i SonarCloud
**Workflowy** (w korzeniu repozytorium, w `.github/workflows/`):
- `codeql-analysis.yml` - CodeQL dla JS, Java/Kotlin, Go (z kompilacją Kotlina przez Gradle)
- `sonar-scan.yml` - SonarCloud Scanner z `projectBaseDir: Zadanie 6`

Oba workflowy uruchamiają się automatycznie na push i PR do `main`.

## Struktura katalogów

```
Projektowanie-obiektowe/
├── .github/workflows/          # workflowy CI (na poziomie repo!)
│   ├── codeql-analysis.yml
│   └── sonar-scan.yml
└── Zadanie 6/
    ├── codeql-scan/
    │   └── CODEQL_ANALYSIS.md  # analiza Express.js
    ├── projects/               # poprawione kopie projektów
    │   ├── kotlin-project/     # Spring Boot
    │   ├── go-project/         # Echo
    │   └── js-projects/
    │       ├── backend/        # Express + Husky
    │       └── frontend/       # React + Husky
    ├── README.md
    ├── ZADANIE_6_PODSUMOWANIE.md
    └── sonar-project.properties
```

## Konfiguracja SonarCloud

- **Organizacja:** `zadanie6`
- **Project key:** `zadanie6_zadanie6`
- **Main branch:** `main`
- Wymagany sekret w GitHub: `SONAR_TOKEN`

## Jak uruchomić lokalnie

**Husky + lint-staged (frontend):**
```bash
cd "Zadanie 6/projects/js-projects/frontend"
npm install
npm run prepare
```

**Sonar / CodeQL** uruchamiają się automatycznie przy pushu na `main` poprzez GitHub Actions.

## Podsumowanie

Wszystkie zadania z Zadania 6 zostały wykonane:
- Husky + lint-staged skonfigurowane dla projektów JS
- Bugi w aplikacji klienckiej naprawione
- Projekt Express.js przeskanowany CodeQL z dokumentacją
- Code smells usunięte w Kotlin/Go/JS, badge SonarCloud aktywny
- GitHub Actions: SonarCloud + CodeQL działają zielono na `main`

Oryginalne projekty z `Zadanie 3`..`Zadanie 5` pozostały nienaruszone — wszystkie poprawki są w `Zadanie 6/projects/`.
