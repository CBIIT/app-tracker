export const normalizeStatus = (status) => {
	if (typeof status !== 'string') {
		return '';
	}

	return status;
};

export const compareStatus = (statusA, statusB) => {
	const normalizedA = normalizeStatus(statusA);
	const normalizedB = normalizeStatus(statusB);
	return normalizedA.localeCompare(normalizedB);
};

export const formatStatusDisplay = (normalizedStatus) => {
	if (normalizedStatus === '') {
		return <span style={{ color: 'rgb(86,86,86)' }}>N/A</span>;
	}

	let displayStatus = normalizedStatus;

	if (displayStatus.includes('_')) {
		displayStatus = displayStatus
			.split('_')
			.map((word) => word[0].toUpperCase() + word.substring(1))
			.join(' ');
	} else {
		displayStatus =
			displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1);
	}

	return <span style={{ color: 'rgb(86,86,86)' }}>{displayStatus}</span>;
};

export const isInvalidVacancyStatus = (status) => {
	return status === '' || status === null || status === undefined;
};

export const getInvalidStatusMessage = () => {
	return 'Something went wrong with this vacancy status. Please contact the Help Desk at NCIAppSupport@mail.nih.gov.';
};

export const isVacancyRowInteractive = (status) => {
	return !isInvalidVacancyStatus(status);
};
