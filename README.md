# Projektowanie-obiektowe
Zadania na zajęcia z projektowania obiektowego 2026
Oliwia Majewska

# Zadanie 1 Paradygmaty
✅ 1. -  Procedura do generowania 50 losowych liczb od 0 do 100

✅ 2. - Procedura do sortowania liczb

✅ 3. - Dodanie parametrów do procedury losującej określającymi zakres losowania: od, do, ile

✅ 4. - 5 testów jednostkowych testujące procedury

✅ 5. - Skrypt w bashu do uruchamiania aplikacji w Pascalu via docker

[commit 1](https://github.com/misiuleczek02/Projektowanie-obiektowe/commit/1b5417142145c80718284b93561839aa994ada3f)

# Zadanie 2 Wzorce architektury
✅ 1. -  Należy stworzyć jeden model z kontrolerem z produktami, zgodnie z CRUD (JSON)

✅ 2. - Należy stworzyć skrypty do testów endpointów via curl (JSON)

✅ 3. - Należy stworzyć dwa dodatkowe kontrolery wraz z modelami  (JSON)

✅ 4. - Należy stworzyć widoki do wszystkich kontrolerów

✅ 5. - Stworzenie panelu administracyjnego

[commit 2](https://github.com/misiuleczek02/Projektowanie-obiektowe/commit/68d4886d501588a34bb52eee7a9542bfb93e7bce)

# Zadanie 3 Wzorce kreacyjne
✅ 1. - Należy stworzyć jeden kontroler wraz z danymi wyświetlanymi z listy na endpoint’cie w formacie JSON - Kotlin + Spring Boot

✅ 2. - Należy stworzyć klasę do autoryzacji (mock) jako Singleton w formie eager

✅ 3. - Należy obsłużyć dane autoryzacji przekazywane przez użytkownika

✅ 4. -  Należy wstrzyknąć singleton do głównej klasy via @Autowired lub kontruktor (constructor injection)

✅ 5. -  Obok wersji Eager do wyboru powinna być wersja Singletona w wersji lazy

[commit 3](https://github.com/misiuleczek02/Projektowanie-obiektowe/commit/e6ee5bcddc2b3e09d9e22e0b9f798734f2e78370)

# Zadanie 4 Wzorce strukturalne
✅ 1. - Należy stworzyć aplikację we frameworki echo w j. Go, która będzie miała kontroler Pogody, która pozwala na pobieranie danych o pogodzie (lub akcjach giełdowych)

✅ 2. - Należy stworzyć model Pogoda (lub Giełda) wykorzystując gorm, a dane załadować z listy przy uruchomieniu

✅ 3. - Należy stworzyć klasę proxy, która pobierze dane z serwisu zewnętrznego podczas zapytania do naszego kontrolera

✅ 4. - Należy zapisać pobrane dane z zewnątrz do bazy danych

✅ 5. - Należy rozszerzyć endpoint na więcej niż jedną lokalizację (Pogoda), lub akcje (Giełda) zwracając JSONa

[commit 4](https://github.com/misiuleczek02/Projektowanie-obiektowe/commit/f977015fded2538f6aca5ae6ee50117115fbd063)

# Zadanie 5 Wzorce behawioralne
✅ 1. - W ramach projektu należy stworzyć komponenty Produkty oraz Płatności; komponent Produkty powinien pobierać listę produktów z aplikacji serwerowej, natomiast komponent Płatności powinien wysyłać dane płatności do aplikacji serwerowej.

✅ 2. - Należy dodać komponent Koszyk wraz z osobnym widokiem; aplikacja powinna umożliwiać przechodzenie pomiędzy widokami przy użyciu routingu.

✅ 3. - Dane pomiędzy komponentami, takimi jak Produkty, Koszyk i Płatności, powinny być przekazywane z wykorzystaniem React hooks, np. useState, useEffect lub useContext.

✅ 4. - Należy przygotować konfigurację umożliwiającą uruchomienie aplikacji klienckiej oraz serwerowej w kontenerach Docker za pomocą docker-compose.

✅ 5. - Należy wykorzystać bibliotekę axios do komunikacji z serwerem oraz skonfigurować obsługę CORS, aby frontend mógł poprawnie komunikować się z backendem.

[commit 5](https://github.com/misiuleczek02/Projektowanie-obiektowe/commit/960e37c2692f7e9d8911d1f226a80fba2baa317d)

# Zadanie 6 Zapaszki

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=zadanie6_zadanie6&metric=alert_status)](https://sonarcloud.io/dashboard?id=zadanie6_zadanie6)
[![CodeQL](https://github.com/misiuleczek02/Projektowanie-obiektowe/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/misiuleczek02/Projektowanie-obiektowe/actions/workflows/codeql-analysis.yml)

✅ 1. - Należy skonfigurować husky + lint-staged uruchamianie lintowania przed commitem

✅ 2. - Należy wyeliminować wszystkie bugi w kodzie w Sonarze (kod aplikacji klienckiej)

✅ 3. - Przeskanować oraz naprawić dowolny projekt open source narzędziem CodeQL https://codeql.github.com/

✅ 4. - Należy usunąć problemy typu Code Smell w kodzie w Sonarze (kotlin, go, js). Należy dodać badge z Sonara

✅ 5. - Skonfigurować Github Actions z linterem oraz CodeQL


Szczegóły w [`Zadanie 6/README.md`](Zadanie%206/README.md) i [`Zadanie 6/ZADANIE_6_PODSUMOWANIE.md`](Zadanie%206/ZADANIE_6_PODSUMOWANIE.md).

# Zadanie 7 

✅ 1. - Przetestuj formularz rejestracji użytkownika pod kątem walidacji pól obowiązkowych oraz zachowania aplikacji po wprowadzeniu niepoprawnego formatu adresu e-mail.

✅ 2. - Przeprowadź testy bezpieczeństwa typu Cross-Site Scripting (XSS), próbując wstrzyknąć złośliwy kod JavaScript w aplikacji z Reactem

✅ 3. - Przetestuj działanie koszyka zakupowego przy jednoczesnym otwarciu aplikacji w kilku osobnych kartach tej samej przeglądarki sprawdzając spójność stanów zamówienia (aplikacja z zadania z React'em)

✅ 4. - Do zadania z React'a należy dodać formularz logowania. Następnie przeprowadź testy podatności na ataki typu Cross-Site Request Forgery (CSRF), próbując wymusić nieautoryzowaną zmianę ustawień konta spreparowanym linkiem, podczas gdy użytkownik posiada aktywną sesję w innej karcie.

✅ 5. - Stwórz scenariusz End-to-End w Playwright (minimum 50 asercji)

# Zadanie 8

✅ 1. - Należy stworzyć odpowiednie instancje po stronie chmury na dockerze

✅ 2. - Stworzyć odpowiedni pipeline w Github Actions do budowania aplikacji

✅ 3. - Dodać notyfikację mailową o zbudowaniu aplikacji

✅ 4. - Dodać krok z deploymentem aplikacji serwerowej oraz klienckiej na chmurę

✅ 5. - Dodać uruchomienie regresyjnych testów automatycznych (funkcjonalnych) jako krok w Actions
