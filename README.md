#System Ewidencji Czasu Pracy - SECP FRONTEND

## **INSTRUKCJA INSTALACJI**

## Wymagania
- [node](https://nodejs.org/en/)
- jeden z managerów pakietów:
    - [npm](https://www.npmjs.com/)
    - [yarn](https://yarnpkg.com/lang/en/)

## Instalacja

Do tymczasowego folderu należy wgrać kod (np: git clone).
 
- zainstalować wszystkie niezbędne komponenty:
    ```shell script
    yarn install
    ```
  lub
    ```shell script
    npm install
    ```
- skopiować plik .env do .env.local i ustawić w nim wartości dla tworzonej instancji
- zbudować aplikację poprzez:
    ```shell script
    yarn build
    ```
  lub
    ```shell script
    npm run build
    ```
- zbudowana aplikacje z folderu `build` należy przegrać w docelowe miejsce
- w konfiguracji ngnix dla hosta należy dodać zapis:
```
location / {
       # First attempt to serve request as file, then
       # as parameter to index.html, then fall back to displaying a 404.
       try_files $uri /index.html =404;
}
```
- dla lokalnego developmentu można postawić serwer poprzez komendę:
    ```shell script
    yarn start
    ```
  lub
    ```shell script
    npm run start
    ```
    aplikacja będzie widoczna pod adresem `http://localhost:3000/`
    
## Development
Aplikacja jest napisana z użyciem bibliotek:
- [ReactJs](https://reactjs.org/)
- [Redux](https://redux.js.org/basics/usage-with-react)
- [Material UI](https://material-ui.com/)

Składnia Javascript zgodna z [ECMA ES6](http://es6-features.org/),
transpilowana do starszych przeglądarek przez babel w momencie budowania.

Jako zasady formatowania przyjęto [Airbnb Coding Style](https://github.com/airbnb/javascript).
