# Zadanie 6 - Wsparcie dla istniejących projektów

Katalog zawiera wsparcie dla analiz i konfiguracji jakości kodu bez modyfikowania istniejących projektów w `Zadanie 1`..`Zadanie 5`.

## SonarCloud Badges

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=zadanie6_zadanie6&metric=alert_status)](https://sonarcloud.io/dashboard?id=zadanie6_zadanie6)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=zadanie6_zadanie6&metric=code_smells)](https://sonarcloud.io/dashboard?id=zadanie6_zadanie6)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=zadanie6_zadanie6&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=zadanie6_zadanie6)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=zadanie6_zadanie6&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=zadanie6_zadanie6)

## Projekty referencyjne
- `Zadanie 3` - Kotlin / Spring Boot
- `Zadanie 4` - Go / Echo
- `Zadanie 5/frontend` - React TypeScript (aplikacja kliencka)
- `Zadanie 5/backend` - Express Node.js

## Co jest w `Zadanie 6`
- `.github/workflows/codeql-analysis.yml` - przykładowy GitHub Actions dla CodeQL skanujący JS, Java/Kotlin i Go
- `.github/workflows/sonar-scan.yml` - przykładowy GitHub Actions uruchamiający Sonar Scanner na istniejących modułach
- `sonar-project.properties` - konfiguracja Sonar do analizy źródeł w zadaniach
- `husky-lint-staged-instructions.md` - instrukcja konfiguracji Husky + lint-staged dla istniejących projektów JS
- `projects/` - poprawione kopie projektów z usuniętymi bugami i code smells

## Badge Sonar i CodeQL
Użyj poniższych szablonów, gdy utworzysz projekt SonarCloud i GitHub Actions:

- Sonar Cloud:
  ```md
  [![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/dashboard?id=<PROJECT_KEY>)
  ```
- CodeQL:
  ```md
  [![CodeQL](https://github.com/<OWNER>/<REPO>/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/codeql-analysis.yml)
  ```
