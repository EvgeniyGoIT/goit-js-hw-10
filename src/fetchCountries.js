export function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}`).then(responce => {
    if (!responce.ok) {
      throw new Error(responce.status);
    }
    return responce.json();
  });
}