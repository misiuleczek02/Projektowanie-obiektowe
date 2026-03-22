#!/bin/bash

URL="http://localhost:8000/api/products"

echo "1. Tworzenie produktu "
curl -X POST $URL -H "Content-Type: application/json" -d '{"name": "Laptop", "price": 2500.50}'
echo -e "\n"

echo "2. Pobieranie listy produktów "
curl -X GET $URL
echo -e "\n"

echo "3. Edycja produktu "
curl -X PUT "$URL/1" -H "Content-Type: application/json" -d '{"name": "Laptop Pro", "price": 3000.00}'
echo -e "\n"

echo "4. Usuwanie produktu "
curl -X DELETE "$URL/1"
echo -e "\n"