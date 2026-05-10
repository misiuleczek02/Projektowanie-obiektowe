# Zadanie 6 - Wsparcie dla istniejących projektów

Katalog zawiera wsparcie dla analiz i konfiguracji jakości kodu bez modyfikowania istniejących projektów w `Zadanie 1`..`Zadanie 5`.

## Status CI

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=zadanie6_zadanie6&metric=alert_status)](https://sonarcloud.io/dashboard?id=zadanie6_zadanie6)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=zadanie6_zadanie6&metric=code_smells)](https://sonarcloud.io/dashboard?id=zadanie6_zadanie6)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=zadanie6_zadanie6&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=zadanie6_zadanie6)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=zadanie6_zadanie6&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=zadanie6_zadanie6)
[![CodeQL](https://github.com/misiuleczek02/Projektowanie-obiektowe/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/misiuleczek02/Projektowanie-obiektowe/actions/workflows/codeql-analysis.yml)

## Projekty referencyjne
- `Zadanie 3` - Kotlin / Spring Boot
- `Zadanie 4` - Go / Echo
- `Zadanie 5/frontend` - React TypeScript (aplikacja kliencka)
- `Zadanie 5/backend` - Express Node.js

## Zawartość katalogu
- `sonar-project.properties` - konfiguracja SonarCloud (klucz `zadanie6_zadanie6`, organizacja `zadanie6`)
- `projects/` - poprawione kopie projektów z `Zadanie 3`..`Zadanie 5` z usuniętymi bugami i code smells
  - `kotlin-project/` - Spring Boot z poprawkami code smells
  - `go-project/` - Echo z poprawkami code smells
  - `js-projects/frontend/` - React + Husky + lint-staged + naprawione bugi z koszyka i płatności
  - `js-projects/backend/` - Express + Husky + lint-staged
- `codeql-scan/CODEQL_ANALYSIS.md` - analiza zewnętrznego projektu (Express.js) narzędziem CodeQL

## Workflowy CI

Workflowy GitHub Actions znajdują się w korzeniu repozytorium (`.github/workflows/`), bo tylko stamtąd GitHub Actions je wykonuje:
- `sonar-scan.yml` - SonarCloud Scanner przy każdym pushu/PR na `main`
- `codeql-analysis.yml` - CodeQL dla JavaScript, Java/Kotlin i Go

Skan SonarCloud wymaga sekretu `SONAR_TOKEN` w GitHub → Settings → Secrets.
