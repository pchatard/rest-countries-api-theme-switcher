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

// Retrieve all countries from API - Homepage (code, flag, name, capital, region and population fields)
const countries = fetch(
	"https://restcountries.eu/rest/v2/all?fields=alpha3Code;flag;name;capital;region;population"
)
	.then((response) => response.json())
	.then((data) => data);

// Filter by region function
function filterCountriesByRegion(region) {
	return countries.filter((country) => country.region === region);
}

// Retrieve data for one country
async function getCountryDetails(countryCode) {
	const rawData = await fetch(
		`https://restcountries.eu/rest/v2/alpha/${countryCode}?fields=name;nativeName;population;region;subregion;capital;topLevelDomain;currencies;languages;borders`
	);
	const jsonData = await rawData.json();
	return jsonData;
}

// filterCountriesByRegion to be called on "change" events from the dropdown
// getCountryDetails to be called on "click" events from the homepage or detail page border countries

// Testing
(async function () {
	console.log(await countries);
	console.log(await getCountryDetails("AFG"));
})();
