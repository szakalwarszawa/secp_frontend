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

  if (dictionary.has(message)) {
    return dictionary.get(message);
  }

  return `Niezindetyfikowany błąd: ${message}`
}
