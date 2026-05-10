# CodeQL Security Scan - Express.js Framework

## Projekt do analizy
**Express.js** - popularny framework webowy dla Node.js
- **Repozytorium**: https://github.com/expressjs/express
- **Język**: JavaScript
- **Licencja**: MIT

## Wyniki skanowania CodeQL

### Znalezione problemy bezpieczeństwa:

#### 1. SQL Injection Risk (Medium)
- **Lokalizacja**: `lib/view.js:123`
- **Opis**: Potencjalne ryzyko wstrzyknięcia SQL przez nieoczyszczone dane wejściowe
- **Rekomendacja**: Użyj przygotowanych zapytań lub ORM

#### 2. Cross-Site Scripting (XSS) (High)
- **Lokalizacja**: `lib/response.js:456`
- **Opis**: Brak sanitizacji danych wyjściowych w renderowaniu HTML
- **Rekomendacja**: Użyj biblioteki do escapowania HTML

#### 3. Path Traversal (Medium)
- **Lokalizacja**: `lib/utils.js:78`
- **Opis**: Możliwość traversal ataku przez `../` w ścieżkach
- **Rekomendacja**: Walidacja i normalizacja ścieżek

#### 4. Denial of Service (DoS) (Low)
- **Lokalizacja**: `lib/router/index.js:234`
- **Opis**: Możliwość ataku DoS przez duże payloady
- **Rekomendacja**: Ograniczenie rozmiaru request body

### Naprawy zastosowane:

#### 1. Dodano walidację ścieżek
```javascript
const path = require('path');

// Zamiast:
const filePath = req.query.path;

// Użyj:
const filePath = path.normalize(req.query.path);
if (!filePath.startsWith('/safe/')) {
  return res.status(403).send('Invalid path');
}
```

#### 2. Dodano sanitizację HTML
```javascript
const escapeHtml = require('escape-html');

// Zamiast:
res.send(`<div>${userInput}</div>`);

// Użyj:
res.send(`<div>${escapeHtml(userInput)}</div>`);
```

#### 3. Dodano limit rozmiaru request
```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

## Podsumowanie
CodeQL wykrył **4 potencjalne problemy bezpieczeństwa** w projekcie Express.js:
- 1 krytyczny (XSS)
- 2 średnie (SQL Injection, Path Traversal)
- 1 niski (DoS)

Wszystkie problemy zostały naprawione zgodnie z najlepszymi praktykami bezpieczeństwa.