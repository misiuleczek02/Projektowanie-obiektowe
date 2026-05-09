# Projektowanie-obiektowe
Zadania na zajęcia z projektowania obiektowego 2026
Oliwia Majewska

# Zadanie 1 Paradygmaty
✅ 1. -  Procedura do generowania 50 losowych liczb od 0 do 100

✅ 2. - Procedura do sortowania liczb

✅ 3. - Dodanie parametrów do procedury losującej określającymi zakres losowania: od, do, ile

✅ 4. - 5 testów jednostkowych testujące procedury

✅ 5. - Skrypt w bashu do uruchamiania aplikacji w Pascalu via docker

# Zadanie 2 Wzorce architektury
✅ 1. -  Należy stworzyć jeden model z kontrolerem z produktami, zgodnie z CRUD (JSON)

✅ 2. - Należy stworzyć skrypty do testów endpointów via curl (JSON)

✅ 3. - Należy stworzyć dwa dodatkowe kontrolery wraz z modelami  (JSON)

✅ 4. - Należy stworzyć widoki do wszystkich kontrolerów

✅ 5. - Stworzenie panelu administracyjnego

# Zadanie 3 Wzorce kreacyjne
✅ 1. - Należy stworzyć jeden kontroler wraz z danymi wyświetlanymi z listy na endpoint’cie w formacie JSON - Kotlin + Spring Boot

✅ 2. - Należy stworzyć klasę do autoryzacji (mock) jako Singleton w formie eager

✅ 3. - Należy obsłużyć dane autoryzacji przekazywane przez użytkownika

✅ 4. -  Należy wstrzyknąć singleton do głównej klasy via @Autowired lub kontruktor (constructor injection)

✅ 5. -  Obok wersji Eager do wyboru powinna być wersja Singletona w wersji lazy

# Zadanie 4 Wzorce strukturalne
✅ 1. - Należy stworzyć aplikację we frameworki echo w j. Go, która będzie miała kontroler Pogody, która pozwala na pobieranie danych o pogodzie (lub akcjach giełdowych)

✅ 2. - Należy stworzyć model Pogoda (lub Giełda) wykorzystując gorm, a dane załadować z listy przy uruchomieniu

✅ 3. - Należy stworzyć klasę proxy, która pobierze dane z serwisu zewnętrznego podczas zapytania do naszego kontrolera

✅ 4. - Należy zapisać pobrane dane z zewnątrz do bazy danych

✅ 5. - Należy rozszerzyć endpoint na więcej niż jedną lokalizację (Pogoda), lub akcje (Giełda) zwracając JSONa

# Zadanie 5 Wzorce behawioralne
✅ 1. - W ramach projektu należy stworzyć komponenty Produkty oraz Płatności; komponent Produkty powinien pobierać listę produktów z aplikacji serwerowej, natomiast komponent Płatności powinien wysyłać dane płatności do aplikacji serwerowej.

✅ 2. - Należy dodać komponent Koszyk wraz z osobnym widokiem; aplikacja powinna umożliwiać przechodzenie pomiędzy widokami przy użyciu routingu.

✅ 3. - Dane pomiędzy komponentami, takimi jak Produkty, Koszyk i Płatności, powinny być przekazywane z wykorzystaniem React hooks, np. useState, useEffect lub useContext.

✅ 4. - Należy przygotować konfigurację umożliwiającą uruchomienie aplikacji klienckiej oraz serwerowej w kontenerach Docker za pomocą docker-compose.

✅ 5. - Należy wykorzystać bibliotekę axios do komunikacji z serwerem oraz skonfigurować obsługę CORS, aby frontend mógł poprawnie komunikować się z backendem.