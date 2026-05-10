# Husky + lint-staged dla istniejących projektów JS

Aby dodać hooks przed commitami bez modyfikowania istniejącej aplikacji bezpośrednio, możesz użyć tego pliku jako instrukcji.

## Konfiguracja do zastosowania w `Zadanie 5/frontend`

1. Zainstaluj w katalogu `Zadanie 5/frontend`:
   ```bash
   npm install --save-dev husky lint-staged
   npx husky install
   npx husky add .husky/pre-commit "npx lint-staged"
   ```

2. W `package.json` dodaj sekcję `lint-staged`:
   ```json
   "lint-staged": {
     "src/**/*.{js,jsx,ts,tsx}": [
       "npx eslint --fix"
     ]
   }
   ```

3. Dodaj skrypt do `package.json`:
   ```json
   "scripts": {
     "prepare": "husky install"
   }
   ```

## Konfiguracja do zastosowania w `Zadanie 5/backend`

1. Zainstaluj w katalogu `Zadanie 5/backend`:
   ```bash
   npm install --save-dev husky lint-staged eslint
   npx husky install
   npx husky add .husky/pre-commit "npx lint-staged"
   ```

2. Przykład `lint-staged`:
   ```json
   "lint-staged": {
     "**/*.{js,jsx}": [
       "npx eslint --fix"
     ]
   }
   ```

## Uwagi
- Ten plik nie zmienia zawartości projektu - jest tylko dokumentacją i wzorem.
- Rzeczywiste wdrożenie wymaga modyfikacji `package.json` i dodania `.husky/` w istniejącym katalogu JS.
