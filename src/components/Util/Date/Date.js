import moment from 'moment';

const transformDateToDisplay = (date) => {
	if (date) {
		const newDate = new Date(date);
		return isValidDate(newDate)
			? moment(date.toString()).format('MM/DD/YYYY')
			: '';
	} else {
		return '';
	}
};

const transformDateTimeToDisplay = (dateTime) => {
	if (dateTime) {
		const newDateTime = new Date(dateTime);
		return isValidDate(newDateTime)
			? moment(dateTime.toString()).format('MM/DD/YYYY h:mm a')
			: '';
	} else {
		return '';
	}
};

const isValidDate = (date) => {
	return (
		Object.prototype.toString.call(date) === '[object Date]' &&
		!isNaN(date.valueOf())
	);
};

export { transformDateToDisplay, transformDateTimeToDisplay };
