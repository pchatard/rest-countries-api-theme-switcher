const darkModeSwitch = document.getElementById("theme");

// Set the theme on page load from Local storage
const isDarkMode = localStorage.getItem("darkMode");
console.log(JSON.parse(isDarkMode));
darkModeSwitch.checked = JSON.parse(isDarkMode);

// Keep track of every theme switch in the local storage
darkModeSwitch.addEventListener("change", handleThemeSwitch);

function handleThemeSwitch(event) {
	const newThemeValue = event.target.checked;
	localStorage.setItem("darkMode", newThemeValue);
	handleBackgroundColor(newThemeValue);
}

// ***************************************************************

// Set the background color body on page load
handleBackgroundColor(JSON.parse(isDarkMode));

// Set the background color body on theme switch
function handleBackgroundColor(isDarkMode = true) {
	const backgroundBody = document.body.classList;
	isDarkMode
		? backgroundBody.add("dark-background")
		: backgroundBody.remove("dark-background");
}

// ***************************************************************