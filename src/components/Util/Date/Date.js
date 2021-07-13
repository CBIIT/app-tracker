import moment from 'moment';

const transformDateToDisplay = (date) => {
	const newDate = new Date(date);
	return isValidDate(newDate)
		? moment(date.toString()).format('MM/DD/YYYY')
		: '';
};

const isValidDate = (date) => {
	return (
		Object.prototype.toString.call(date) === '[object Date]' &&
		!isNaN(date.valueOf())
	);
};

export { transformDateToDisplay };
