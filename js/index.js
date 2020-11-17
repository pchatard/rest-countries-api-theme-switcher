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

// ***************************************************************

// Set the background color body on page load
handleBackgroundColor(isDarkMode);

// Set the background color body on theme switch
function handleBackgroundColor(isDarkMode = true) {
	const backgroundBody = document.body.classList;
	isDarkMode
		? backgroundBody.add("dark-background")
		: backgroundBody.remove("dark-background");
}

// ***************************************************************

// filterCountriesByRegion to be called on "change" events from the dropdown

const countriesData = fetch(
	"https://restcountries.eu/rest/v2/all?fields=alpha3Code;flag;name;capital;region;population"
)
	.then((response) => response.json())
	.then((data) => data);
const countriesContainer = document.querySelector(".countries");

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
	const countryList = Array.from(
		document.querySelectorAll(".country__container")
	);
	countryList.forEach((country) =>
		country.addEventListener("click", () =>
			getCountryDetails(country.dataset.code)
		)
	);
}

// Filter by region function
function filterCountriesByRegion(region) {
	return countriesData.filter((country) => country.region === region);
}

// Retrieve data for one country
async function getCountryDetails(countryCode) {
	const rawCountryData = await fetch(
		`https://restcountries.eu/rest/v2/alpha/${countryCode}?fields=name;nativeName;population;region;subregion;capital;topLevelDomain;currencies;languages;borders`
	);
	const countryData = await rawCountryData.json();
	console.log(countryData);
	return countryData;
}

// Retrieve a border country's data when clicked from a detail page
async function getBorderCountryDetails(borderCountryCode) {
	return await getCountryDetails(borderCountryCode);
}
