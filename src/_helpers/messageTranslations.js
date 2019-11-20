/**
 * Translate given message
 *
 * @param {string} message
 * @returns {string}
 */
export function messageTranslate(message) {
  const dictionary = new Map();

  dictionary.set('Bad credentials.', 'Niepoprawne dane logowania.');
  dictionary.set('Expired JWT Token', 'Sesja wygasła.');
  dictionary.set(
    'ERROR: You do not have permission to edit the timesheet at this stage.',
    'Nie masz prawa edycji listy obecności na tym etapie akceptacji.'
  );

  if (dictionary.has(message)) {
    return dictionary.get(message);
  }

  return `Niezindetyfikowany błąd: ${message}`;
}
