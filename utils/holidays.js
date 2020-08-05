const fetch = require('node-fetch');

const reqHolidays = async () => {
  const year = new Date().getFullYear();
  let holidays = [];
  let arr = [];

  await fetch(`${process.env.FESTIO_URL}${year}`)
      .then(r => r.json())
      .then(r => (holidays = r.holidays));

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
