const fetch = require('node-fetch');

const reqHolidays = async () => {
	const URL =
		'https://getfestivo.com/v2/holidays?api_key=0a1fc56f92f689ab0f3a3a0e9d2c5022&country=UA&year=';
	const year = new Date().getFullYear();
	let holidays = [];
	let arr = [];

	await fetch(`${URL}${year}`)
		.then((r) => r.json())
		.then((r) => (holidays = r.holidays));

	holidays.forEach((item) => {
		if (item.public) {
			arr.push({
				name: item.name,
				date: item.date,
				important: true,
				description: 'Ukrainian national holidays',
				time: '00:00',
			});
		}
	});

	return arr;
};

module.exports = reqHolidays;
