// ******************************* DARKMODE ******************************* //

const darkModeSwitch = document.getElementById("theme");

// Set the theme on page load from Local storage
const isDarkMode = localStorage.getItem("darkMode");
// console.log(JSON.parse(isDarkMode));
darkModeSwitch.checked = JSON.parse(isDarkMode);

// Keep track of every theme switch in the local storage
darkModeSwitch.addEventListener("change", handleThemeSwitch);

function handleThemeSwitch(event) {
	const newThemeValue = event.target.checked;
	localStorage.setItem("darkMode", newThemeValue);
	handleBackgroundColor(newThemeValue);
}

// ******************************

// Set the background color body on page load
handleBackgroundColor(JSON.parse(isDarkMode));

// Set the background color body on theme switch
function handleBackgroundColor(isDarkMode = true) {
	const backgroundBody = document.body.classList;
	isDarkMode
		? backgroundBody.add("dark-background")
		: backgroundBody.remove("dark-background");
}

// ******************************* API ******************************* //
// Api fetching here

// ******************************* MODAL ******************************* //

const modal = document.querySelector(".modal-container");
const countries = document.querySelectorAll(".country__container");
const main = document.querySelector("main");
const buttonBack = document.querySelector(".modal__btn");
const borderCountries = document.querySelectorAll(".border-countries__btn");

// On click on country card, open modal
countries.forEach((country) => {
	country.addEventListener("click", getCountryInfos);
});

function getCountryInfos() {
	// Add more logic here to transmit country info, then...
	openModal();
}

function openModal() {
	main.classList.add("disappear");
}

// On click on the back button, close modal
buttonBack.addEventListener("click", closeModal);
function closeModal() {
	main.classList.remove("disappear");
}

// On click on "border-countries__btn", open the appropriate detail card
borderCountries.forEach((borderCountry) => {
	borderCountry.addEventListener("click", openCountryInfos);
});
function openCountryInfos() {
	console.log("open this country detail card");
}
