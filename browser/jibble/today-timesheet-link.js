addCustomUI();

function addCustomUI() {
	const body = document.querySelector('body');
	const currentDateUrl = getCurrentDateUrl();

	const customSection = document.createElement('div');
	customSection.classList.add('custom-section');

	const a = document.createElement('a');
	a.classList.add('custom-a');
	a.setAttribute('href', currentDateUrl);

	const button = document.createElement('button');
	button.classList.add('custom-button');
	button.innerText = "Today's timesheets";
	
	a.appendChild(button);

	customSection.appendChild(a);

	body.prepend(customSection);
}

function getCurrentDateUrl() {
	let currentDateObject = new Date();

	let currentFullYear = currentDateObject.getFullYear();
	let currentFullYearString = currentFullYear.toString();

	let currentMonth = currentDateObject.getMonth() + 1;
	let currentMonthString = currentMonth.toString().padStart(2, '0');

	let currentDate = currentDateObject.getDate();
	let currentDateString = currentDate.toString().padStart(2, '0');

	let currentDateFormattedString = [
		currentFullYearString,
		currentMonthString,
		currentDateString,
	].join('-');

	const currentDateUrl = `https://web.jibble.io/timesheets/${currentDateFormattedString}/b53f3840-7867-4af5-91f4-cbb778d3d08c/details`;

	console.log('currentDateUrl', currentDateUrl);

	return currentDateUrl;
}