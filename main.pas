program BubbleSortApp;

{$mode objfpc}{$H+}

type
  TIntArray = array[1..1000] of Integer;

procedure GenerateRandom(var arr: TIntArray; minVal, maxVal, count: Integer);
var
  i: Integer;
begin
  Randomize;
  for i := 1 to count do
  begin
    arr[i] := Random(maxVal - minVal + 1) + minVal;
  end;
end;

procedure BubbleSort(var arr: TIntArray; count: Integer);
var
  i, j, temp: Integer;
  swapped: Boolean;
begin
  for i := 1 to count - 1 do
  begin
    swapped := False;
    for j := 1 to count - i do
    begin
      if arr[j] > arr[j + 1] then
      begin
        temp := arr[j];
        arr[j] := arr[j + 1];
        arr[j + 1] := temp;
        swapped := True;
      end;
    end;
    if not swapped then Break;
  end;
end;

procedure PrintArray(const arr: TIntArray; count: Integer);
var
  i: Integer;
begin
  for i := 1 to count do
    Write(arr[i], ' ');
  Writeln;
end;

procedure RunTests;
var
  arr: TIntArray;
  i: Integer;
  testPassed: Boolean;
begin
  Writeln('URUCHAMIANIE TESTOW JEDNOSTKOWYCH');

  GenerateRandom(arr, 10, 20, 50);
  testPassed := True;
  for i := 1 to 50 do
    if (arr[i] < 10) or (arr[i] > 20) then testPassed := False;
  if testPassed then Writeln('Test 1 (Zakres losowania): PASSED')
  else Writeln('Test 1 (Zakres losowania): FAILED');

  arr[1] := 5; arr[2] := 4; arr[3] := 3; arr[4] := 2; arr[5] := 1;
  BubbleSort(arr, 5);
  if (arr[1]=1) and (arr[2]=2) and (arr[3]=3) and (arr[4]=4) and (arr[5]=5) then
    Writeln('Test 2 (Sortowanie odwrotne): PASSED')
  else Writeln('Test 2 (Sortowanie odwrotne): FAILED');

  arr[1] := 1; arr[2] := 2; arr[3] := 3; arr[4] := 4; arr[5] := 5;
  BubbleSort(arr, 5);
  if (arr[1]=1) and (arr[2]=2) and (arr[3]=3) and (arr[4]=4) and (arr[5]=5) then
    Writeln('Test 3 (Juz posortowane): PASSED')
  else Writeln('Test 3 (Juz posortowane): FAILED');

  arr[1] := 7; arr[2] := 7; arr[3] := 7; arr[4] := 7;
  BubbleSort(arr, 4);
  if (arr[1]=7) and (arr[2]=7) and (arr[3]=7) and (arr[4]=7) then
    Writeln('Test 4 (Identyczne elementy): PASSED')
  else Writeln('Test 4 (Identyczne elementy): FAILED');

  arr[1] := -5; arr[2] := 10; arr[3] := -20; arr[4] := 0;
  BubbleSort(arr, 4);
  if (arr[1]=-20) and (arr[2]=-5) and (arr[3]=0) and (arr[4]=10) then
    Writeln('Test 5 (Liczby ujemne): PASSED')
  else Writeln('Test 5 (Liczby ujemne): FAILED');

  Writeln;
end;

var
  myArray: TIntArray;
begin
  RunTests;

  Writeln('GLOWNY PROGRAM:');
  Writeln('Generuje 50 liczb z zakresu od 0 do 100');
  GenerateRandom(myArray, 0, 100, 50);

  Writeln('Tablica przed sortowaniem:');
  PrintArray(myArray, 50);
  Writeln;

  BubbleSort(myArray, 50);

  Writeln('Tablica po sortowaniu (Bubble Sort):');
  PrintArray(myArray, 50);
end.