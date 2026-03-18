#!/bin/bash
export MSYS_NO_PATHCONV=1

echo "kompilacja i uruchamianie aplikacji pascal za pomocą dockera"

docker run --rm -v "$PWD":/app -w /app frolvlad/alpine-fpc sh -c "fpc main.pas > /dev/null && ./main"

echo "zakończono"