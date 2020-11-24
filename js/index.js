// ******************************* DARKMODE ******************************* //

const darkModeSwitch = document.getElementById("theme");

// Set the theme on page load from Local storage
const isDarkMode = JSON.parse(localStorage.getItem("darkMode"));
darkModeSwitch.checked = isDarkMode;

// Keep track of every theme switch in the local storage
darkModeSwitch.addEventListener("change", handleThemeSwitch);

function handleThemeSwitch(event) {
	const newThemeValue = event.target.checked;
	localStorage.setItem("darkMode", newThemeValue);
	handleBackgroundColor(newThemeValue);
}

// ******************************

// Set the background color body on page load
handleBackgroundColor(isDarkMode);

// Set the background color body on theme switch
function handleBackgroundColor(isDarkMode = true) {
	const backgroundBody = document.body.classList;
	isDarkMode
		? backgroundBody.add("dark-background")
		: backgroundBody.remove("dark-background");
}

// ******************************* HOMEPAGE ******************************* //

const main = document.querySelector("main");
const countriesContainer = document.querySelector(".countries");
const filterSelect = document.querySelector('select[name="region"');
const modalContainer = document.querySelector(".modal-container");

// Fetching homepage data
const countriesData = fetch(
	"https://restcountries.eu/rest/v2/all?fields=alpha3Code;flag;name;capital;region;population"
)
	.then((response) => response.json())
	.then((data) => data);

(async function () {
	populateHomepageData(await countriesData);
	addEventListenersOnCountries();
})();

// Add commas to numbers to separate thousands
function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function populateHomepageData(data) {
	const htmlCountries = data
		.map((country) => {
			return `
            <div class="country__container" data-code="${country.alpha3Code}">
                <img src="${
									country.flag
								}" alt="country-name flag" class="country__flag" />
                <div class="country__details">
                    <h2 class="country__name">${country.name}</h2>
                    <ul class="country__info__list">
                        <li class="country__info population">
                            <span class="subtitle">Population: </span>
                            ${formatNumber(country.population)}
                        </li>
                        <li class="country__info region">
                            <span class="subtitle">Region: </span> ${
															country.region
														}
                        </li>
                        <li class="country__info capital">
                            <span class="subtitle">Capital: </span> ${
															country.capital
														}
                        </li>
                    </ul>
                </div>
            </div>
        `;
		})
		.join("");
	countriesContainer.innerHTML = htmlCountries;
	window.scrollTo({ top: 0 });
}

function addEventListenersOnCountries() {
	const countries = Array.from(
		document.querySelectorAll(".country__container")
	);
	countries.forEach((country) => {
		country.addEventListener("click", () =>
			handleCountryClick(country.dataset.code)
		);
	});
}

async function handleCountryClick(countryCode) {
	const countryData = await getCountryDetails(countryCode);
	const allCountriesData = await countriesData;
	openModal(countryData, allCountriesData);
}

async function getCountryDetails(countryCode) {
	const rawCountryData = await fetch(
		`https://restcountries.eu/rest/v2/alpha/${countryCode}?fields=name;nativeName;population;region;subregion;capital;topLevelDomain;currencies;languages;borders;flag`
	);
	const countryData = await rawCountryData.json();
	return countryData;
}

// ****************************** MODAL ******************************* //

function openModal(countryData, allCountriesData) {
	main.classList.add("disappear");
	displayDataInModal(countryData, allCountriesData);
	handleBorderCountries();
	addEventListenerOnModal();
}

function displayDataInModal(countryData, allCountriesData) {
	const {
		name,
		nativeName,
		population,
		region,
		subregion,
		capital,
		topLevelDomain,
		currencies,
		languages,
		borders,
		flag,
	} = countryData;

	const borderCountries = generateBorderCountriesHTML(
		borders,
		allCountriesData
	);

	// Display all elements in the array languages
	const allLanguages = languages.map((language) => {
		return " " + language.name;
	});

	// Display all elements in the array currencies
	const allCurrencies = currencies.map((currency) => {
		return " " + currency.name;
	});

	const htmlModal = `<div class="modal">
                    <button class="modal__btn btn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="#000"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        Back
                    </button>
                    <div class="modal__details">
                        <div class="container-image">
                            <img
                                src=${flag}
                                alt="country flag"
                                class="modal__flag"
                            />
                        </div>

                        <div class="details__infos">
                            <h2 class="infos__name">${name}</h2>
                            <ul class="infos__content">
                                <div>
                                    <li>
                                        <span class="subtitle">Native Name: </span>
                                        ${nativeName}
                                    </li>
                                    <li>
                                        <span class="subtitle">Population: </span>
                                       ${formatNumber(population)}
                                    </li>
                                    <li>
                                        <span class="subtitle">Region: </span>
                                        ${region}
                                    </li>
                                    <li>
                                        <span class="subtitle">Sub Region: </span>
                                        ${subregion}
                                    </li>
                                    <li>
                                        <span class="subtitle">Capital: </span>
                                        ${capital}
                                    </li>
                                </div>
                                <div>
                                    <li>
                                        <span class="subtitle">Top Level Domain:</span>
                                        ${topLevelDomain}
                                    </li>
                                    <li>
                                        <span class="subtitle">Currencies: </span>
                                        ${allCurrencies}
                                    </li>
                                    <li>
                                        <span class="subtitle">Languages: </span>
                                        ${allLanguages}
                                    </li>
                                </div>
                            </ul>
                            <div class="infos__border-countries">
                                <span class="subtitle">Border Countries:</span>
                                ${borderCountries}
                            </div>
                        </div>
                    </div>
                </div>`;
	modalContainer.innerHTML = htmlModal;
}

function generateBorderCountriesHTML(borders, allCountriesData) {
	// Get border countries with data-code
	const bordersWithName = borders.map((border) => {
		const matchingCountry = allCountriesData.find(
			(country) => country.alpha3Code === border
		);
		return { name: matchingCountry.name, code: matchingCountry.alpha3Code };
	});

	// Display border countries if exist
	return bordersWithName.length > 0
		? bordersWithName
				.map((border) => {
					return `<button class="border-countries__btn btn" data-code=${border.code}> ${border.name}</button>`;
				})
				.join("")
		: `<em>None</em>`;
}

function handleBorderCountries() {
	const borderCountries = Array.from(
		document.querySelectorAll(".border-countries__btn")
	);

	borderCountries.forEach((borderCountry) => {
		borderCountry.addEventListener("click", () =>
			handleCountryClick(borderCountry.dataset.code)
		);
	});
}

function addEventListenerOnModal() {
	const buttonBack = document.querySelector(".modal__btn");
	buttonBack.addEventListener("click", () =>
		main.classList.remove("disappear")
	);
}

// ****************************** FILTER (REGION AND SEARCH) ******************************* //
const filters = {
	search: "",
	region: "all",
};

const searchInput = document.querySelector("input[type='search']");
filterSelect.addEventListener("change", (e) => filterCountries(e, "region"));
searchInput.addEventListener("keyup", (e) => filterCountries(e, "search"));

async function filterCountries(event, type) {
	let result;
	if (type === "search") {
		const regionCountries = await filterCountriesByRegion();
		result = await filterSearchInput(event, regionCountries);
	} else {
		const searchCountries = await filterSearchInput();
		result = await filterCountriesByRegion(event, searchCountries);
	}
	populateHomepageData(result);
	addEventListenersOnCountries();
}

async function filterCountriesByRegion(event = {}, inputCountries = []) {
	let results = [];

	const [filter, arrayToFilter] = [
		...(await initializeFiltering(event, inputCountries, "region")),
	];

	if (filter === "all") {
		results = arrayToFilter;
	} else {
		results = arrayToFilter.filter(
			(country) => country.region.toLowerCase() === filter
		);
	}
	return results;
}

async function filterSearchInput(event = {}, inputCountries = []) {
	let results = [];
	const [filter, arrayToFilter] = [
		...(await initializeFiltering(event, inputCountries, "search")),
	];

	results = arrayToFilter.filter(
		(country) =>
			country.name.toLowerCase().includes(filter) ||
			country.capital.toLowerCase().includes(filter)
	);
	return results;
}

async function initializeFiltering(event, inputCountries, type) {
	let filter, arrayToFilter;
	if (Object.keys(event).length) {
		filter = event.target.value;
		arrayToFilter = inputCountries;
		filters[type] = filter;
	} else {
		filter = filters[type];
		arrayToFilter = await countriesData;
	}
	return [filter, arrayToFilter];
}

// ******************************* SCROLL EFFECT ******************************* //

let prevScrollPosition = window.pageYOffset;
const formActions = document.querySelector(".actions");

// On scrolls down, hide the search bar. On scrolls up, show the search bar
window.onscroll = function () {
	const currentScrollPosition = window.pageYOffset;

	if (prevScrollPosition > currentScrollPosition) {
		formActions.classList.remove("hide-actions");
	} else {
		formActions.classList.add("hide-actions");
	}
	prevScrollPosition = currentScrollPosition;
};
