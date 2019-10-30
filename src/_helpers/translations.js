export function translate(data) {
        let dictionary = new Map();

        dictionary.set('Bad credentials.', 'Niepoprawne dane logowania');
        dictionary.set('Expired JWT Token', 'Sesja wygasła.');

        if (dictionary.has(data)) {
            return dictionary.get(data);
        }

        if (!dictionary.has(data)) {
            return 'Niezindetyfikowany błąd: ' + data;
        }
}
