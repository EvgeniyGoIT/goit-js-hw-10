import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
let timeoutId;

function searchCountries(searchTerm) {
  const sanitizedSearchTerm = searchTerm.trim();
  if (sanitizedSearchTerm === '') {
    clearCountryList();
    clearCountryInfo();
    return;
  }
  fetchCountries(sanitizedSearchTerm)
    .then((data) => {
      if (data.length >= 2 && data.length <= 10) {
        clearCountryInfo();
        countriesListMarkup(data);
      } else if (data.length === 1) {
        clearCountryList();
        countryCardMarkup(data[0]);
      }
      else {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        clearCountryInfo();
        clearCountryList();
      }
      })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearCountryInfo();
      clearCountryList();
    });
  }

function clearCountryList() {
  countryList.innerHTML = '';
}
function clearCountryInfo() {
  countryInfo.innerHTML = '';
}

function countriesListMarkup(countryData) {
  const markup = countryData
    .map(
      ({ flags, name }) =>
        `<li class="country-list__flag">
              <img src="${flags.svg}" alt="Flag of ${name.official}" width = 50px height = 30px>
              <h2>${name.official}</h2>
          </li>`,
    )
    .join('');
  countryList.innerHTML = markup;
}

function countryCardMarkup({ name, capital, population, flags, languages }) {
   const markup = `
        <div>
            <h1>${name.official}</h1>
            <p><b>Capital:&emsp;</b>${capital}</p>
            <p><b>Population:&emsp;</b>${population}</p>
            <p><b>Languages:&emsp;</b>${Object.values(languages).join(', ')}</p>
            <img src='${flags.svg}' alt='${name.official}' class='country__flag' width='400' />
        </div>`;
  return countryInfo.innerHTML = markup;
}

searchBox.addEventListener(
  'input',
  debounce((event) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const searchTerm = event.target.value;
      searchCountries(searchTerm);
    }, DEBOUNCE_DELAY);
  })
);




