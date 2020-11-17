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

// ******************************* API and MODAL ******************************* //

const main = document.querySelector("main");
const countriesContainer = document.querySelector(".countries");
const modalContainer = document.querySelector(".modal-container");

// Fetching homepage data
const countriesData = fetch(
	"https://restcountries.eu/rest/v2/all?fields=alpha3Code;flag;name;capital;region;population"
)
	.then((response) => response.json())
	.then((data) => data);

// Populating homepage + adding event listeners
(async function () {
	await populateHomepageData();
	addEventListenersOnCountries();
})();

async function populateHomepageData() {
	const htmlCountries = (await countriesData)
		.map((country) => {
			return `
            <div class="country__container" data-code="${country.alpha3Code}">
                <img src="${country.flag}" alt="country-name flag" class="country__flag" />
                <div class="country__details">
                    <h2 class="country__name">${country.name}</h2>
                    <ul class="country__info__list">
                        <li class="country__info population">
                            <span class="subtitle">Population: </span>
                            ${country.population}
                        </li>
                        <li class="country__info region">
                            <span class="subtitle">Region: </span> ${country.region}
                        </li>
                        <li class="country__info capital">
                            <span class="subtitle">Capital: </span> ${country.capital}
                        </li>
                    </ul>
                </div>
            </div>
        `;
		})
		.join("");
	countriesContainer.innerHTML = htmlCountries;
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

function handleCountryClick(countryCode) {
	const countryData = getCountryDetails(countryCode);
	openModal(countryData);
}

async function getCountryDetails(countryCode) {
	const rawCountryData = await fetch(
		`https://restcountries.eu/rest/v2/alpha/${countryCode}?fields=name;nativeName;population;region;subregion;capital;topLevelDomain;currencies;languages;borders;flag`
	);
	const countryData = await rawCountryData.json();
	return countryData;
}

// ******************************

function openModal(countryData) {
	main.classList.add("disappear");
	displayDataInModal(countryData);
}

async function displayDataInModal(countryData) {
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
	} = await countryData;

	// Display border countries if exist
	const borderCountries =
		borders.length > 0
			? borders
					.map((border) => {
						return `<button class="border-countries__btn btn">${border}</button>`;
					})
					.join("")
			: `<button class="border-countries__btn btn" style="color: #bababa;">None</button>`;

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
										${population}
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
	handleCloseModal();
}

function handleCloseModal() {
	const buttonBack = document.querySelector(".modal__btn");
	buttonBack.addEventListener("click", closeModal);
	function closeModal() {
		main.classList.remove("disappear");
	}

	handleBorderCountries();
}

// On click on "border-countries__btn", open the appropriate detail card
function handleBorderCountries() {
	const borderCountries = Array.from(
		document.querySelectorAll(".border-countries__btn")
	);

	borderCountries.forEach((borderCountry) => {
		borderCountry.addEventListener("click", () =>
			handleCountryClick(borderCountry.textContent)
		);
	});
}

// ******************************* TODO ******************************* //

// Filter by region function
function filterCountriesByRegion(region) {
	return countriesData.filter((country) => country.region === region);
}

// Retrieve a border country's data when clicked from a detail page
// async function getBorderCountryDetails(borderCountryCode) {
// 	return await getCountryDetails(borderCountryCode);
// }

// OTHERS TODOs :
// Search filter function
// Population -> Thousand comma separator ? (regex ?)
// Make all flags fills its card (in homepage)
