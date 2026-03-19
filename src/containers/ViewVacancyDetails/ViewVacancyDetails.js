import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import ReactQuill from 'react-quill';
import { extractAndTransformMandatoryStatements } from '../../components/Util/Vacancy/Vacancy';

import Header from './Header/Header';
import Divider from './Divider/Divider';
import { validateVacancyData } from './validateVacancyData';
import { VACANCY_DETAILS_FOR_APPLICANTS } from '../../constants/ApiEndpoints';

import './ViewVacancyDetails.css';
import { notification } from 'antd';

const numberToWordMap = {
	0: 'Zero',
	1: 'One',
	2: 'Two',
	3: 'Three',
	4: 'Four',
	5: 'Five',
	6: 'Six',
	7: 'Seven',
	8: 'Eight',
	9: 'Nine',
	10: 'Ten',
	11: 'Eleven',
	12: 'Twelve',
	13: 'Thirteen',
	14: 'Fourteen',
	15: 'Fifteen'
};

const viewVacancyDetails = () => {
	const [vacancyDetails, setVacancyDetails] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const { sysId } = useParams();


	useEffect(() => {
		(async () => {
			try {
				const response = await axios.get(VACANCY_DETAILS_FOR_APPLICANTS + sysId);
				const jsonData = response.data.result.json;

				if (!jsonData?.basic_info || typeof jsonData.basic_info !== 'object') {
					throw new Error('Invalid vacancy data')
				}

				const validateData = validateVacancyData(jsonData);
				setVacancyDetails(validateData);
				setIsLoading(false);
			} catch (e) {
				setHasError(true);
				setIsLoading(false);
				notification.error({
					message: 'Sorry! There was an error retrieving the vacancy details.',
					description: (
						<>
							<p>
								Please verify if the vacancy has closed. If not, refresh the page and try again. 
								If the issue persists, contact the Help Desk by emailing{' '}
									<a href='mailto:NCIAppSupport@mail.nih.gov'>
										NCIAppSupport@mail.nih.gov
									</a>
							</p>
						</>
					),
					duration: 30,
					style: {
						height: '225px',
						display: 'flex',
						alignItems: 'center',
					},
				});
			}
		})();
	}, []);

	return isLoading ? (
		<> </>
	) : hasError ? (
		<div className='Content'>
			<h2>Unable to load vacancy details</h2>
			<p>
				Please refresh the page and try again. If the issue persists, contact the Help Desk by emailing{' '}
				<a href='mailto:NCIAppSupport@mail.nih.gov'>NCIAppSupport@mail.nih.gov</a>
			</p>
		</div>
	) : (
		<>
			<Header
				title={vacancyDetails.basic_info.vacancy_title?.value ?? 'N/A'}
				openDate={vacancyDetails.basic_info.open_date?.value ?? 'N/A'}
				closeDate={vacancyDetails.basic_info.close_date?.value ?? 'N/A'}
				useCloseDate={(vacancyDetails.basic_info.use_close_date?.value ?? '1') !== '0'}
				vacancyState={vacancyDetails.basic_info.state?.value ?? 'N/A'}
				vacancyStatus={vacancyDetails.basic_info.status?.value ?? 'N/A'}
				vacancyPOCType={vacancyDetails.basic_info.vacancy_poc_type ?? 'N/A'}
				vacancyPOC={vacancyDetails.basic_info.vacancy_poc ?? 'N/A'}
				vacancyPOCEmail={vacancyDetails.basic_info.vacancy_poc_email ?? 'N/A'}
				sysId={sysId}
			/>
			<div className='Content'>
				<ReactQuill
					className='RichText'
					readOnly={true}
					value={vacancyDetails.basic_info.vacancy_description?.value ?? 'N/A'}
					theme='bubble'
				/>

				<div>
					<h2 className='BoldHeading'>APPLICATION DOCUMENTS</h2>
					<ul className='DocumentsList'>
						{vacancyDetails.vacancy_documents.length > 0
							? vacancyDetails.vacancy_documents.map((document, index) => (
									<li key={index}>
										{document.title.value +
											(document.is_optional.value == 1 ? ' (optional)' : '')}
									</li>
								))
							: null}
						{(vacancyDetails.basic_info.number_of_recommendation?.value ?? 0) == 0
							? null
							: <li>Full Contact Details for&nbsp; 
								{numberToWordMap[
									vacancyDetails.basic_info.number_of_recommendation?.value
								] +
									' (' +
									vacancyDetails.basic_info.number_of_recommendation?.value +
									') Reference' +
									(vacancyDetails.basic_info.number_of_recommendation?.value >
										1
										? 's'
										: '') }
							</li>}
					</ul>
				</div>
			</div>
			<Divider text='HHS and NIH are Equal Opportunity Employers' />
			<div className='Content MandatoryStatements'>
				{extractAndTransformMandatoryStatements(vacancyDetails).map(
					(statement, index) =>
						statement.display == 1 ? (
							<div key={index}>
								<h2>{statement.label.toUpperCase()}</h2>
								<ReactQuill
									className='RichText'
									readOnly={true}
									value={statement.text}
									theme='bubble'
								/>
							</div>
						) : null
				)}
			</div>
		</>
	);
};

export default viewVacancyDetails;
