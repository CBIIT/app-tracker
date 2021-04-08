import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'antd';

import ApplicantInfo from './ApplicantInfo/ApplicantInfo';
import Address from './Address/Address';
import Documents from './Documents/Documents';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend';
import { GET_APPLICATION } from '../../constants/ApiEndpoints';

import './Application.css';

const application = () => {
	const [application, setApplication] = useState();
	const [vacancyTitle, setVacancyTitle] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const { sysId } = useParams();

	useEffect(() => {
		(async () => {
			setIsLoading(true);

			try {
				const response = await axios.get(GET_APPLICATION + sysId);
				const application = transformJsonFromBackend(response.data.result);

				setApplication({
					basicInfo: application.basicInfo,
					address: application.address,
				});

				setVacancyTitle(response.data.result.basic_info.vacancy.label);

				setIsLoading(false);
			} catch (error) {
				console.log('[Application] error: ', error);
			}
		})();
	}, []);

	return !isLoading ? (
		<div className='ApplicationContainer'>
			<h1>{vacancyTitle}</h1>
			<div className='ApplicationHeaderBar'>
				<h2>
					Applicant:{' '}
					{application.basicInfo.firstName +
						' ' +
						application.basicInfo.lastName}
				</h2>
				<Button type='link'>view applicants list</Button>
			</div>
			<div className='ApplicationContent'>
				<div className='ApplicationContentColumn' style={{ maxWidth: '675px' }}>
					<ApplicantInfo
						basicInfo={application.basicInfo}
						style={{ backgroundColor: 'white' }}
					/>
					<Address
						address={application.address}
						style={{ backgroundColor: 'white' }}
					/>
					<Documents style={{ backgroundColor: 'white' }} />
				</div>
				<div
					className='ApplicationContentColumn'
					style={{ maxWidth: '480px' }}
				></div>
			</div>
		</div>
	) : null;
};

export default application;
