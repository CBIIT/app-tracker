import React from 'react';

import './HelpDesk.css';

const helpDesk = () => (
	<div className='HelpDeskContent'>
		<h2 style={{ marginBottom: '3px' }}>Contact System Support</h2>
		<p>
			<b>Email: </b>
			<a href='mailto:NCIAppSupport@mail.nih.gov'>NCIAppSupport@nih.gov</a>
			<br></br>
			<b>System Support Telephone:</b> 240-276-5541 or toll free: 888-478-4423
			<br></br>
			Hours: Monday to Friday, 9:00 a.m. to 5:00 p.m. Eastern Time (ET), closed
			weekends and holidays.
		</p>
		<br></br>
	</div>
);

export default helpDesk;
