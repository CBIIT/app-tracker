const transformDateToDisplay = (date) => {
	const newDate = new Date(date);
	return isValidDate(newDate) ? newDate.toLocaleDateString('en-US') : '';
};

const isValidDate = (date) => {
	return (
		Object.prototype.toString.call(date) === '[object Date]' &&
		!isNaN(date.valueOf())
	);
};

export { transformDateToDisplay };
