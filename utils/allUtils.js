const mMonthSlice = string => string.slice(5, 7);
const dateChecker = () => /^\d{4}([-])\d{2}\1\d{2}$/
const timeChecker = () => /^\d{2}([:])\d{2}$/
module.exports = {mMonthSlice, dateChecker, timeChecker};
