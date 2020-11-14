const darkModeSwitch = document.getElementById("theme");

// Set the theme on page load from Local storage
const isDarkMode = localStorage.getItem("darkMode");
console.log(JSON.parse(isDarkMode));
darkModeSwitch.checked = JSON.parse(isDarkMode);

// Keep track of every theme switch in the local storage
darkModeSwitch.addEventListener("change", handleThemeSwitch);

function handleThemeSwitch(event) {
	const newValue = event.target.checked;
	localStorage.setItem("darkMode", newValue);
	handleBackgroundColor();
}

// ***************************************************************

// Set the background color body on page load
isDarkMode && handleBackgroundColor();

// Set the background color body on theme switch
function handleBackgroundColor() {
	const backgroundgBody = document.body.classList;
	darkModeSwitch.checked
		? backgroundgBody.add("dark-background")
		: backgroundgBody.remove("dark-background");
}

// ***************************************************************
