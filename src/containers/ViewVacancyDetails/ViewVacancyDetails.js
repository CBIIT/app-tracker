import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import ReactQuill from 'react-quill';
import { extractAndTransformMandatoryStatements } from '../../components/Util/Vacancy/Vacancy';

import Header from './Header/Header';
import Divider from './Divider/Divider';
import { VACANCY_DETAILS_FOR_APPLICANTS } from '../../constants/ApiEndpoints';

import './ViewVacancyDetails.css';

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
	const { sysId } = useParams();

	useEffect(() => {
		(async () => {
			const response = await axios.get(VACANCY_DETAILS_FOR_APPLICANTS + sysId);
			setVacancyDetails(response.data.result);
			setIsLoading(false);
		})();
	}, []);

	return isLoading ? (
		<> </>
	) : (
		<>
			<Header
				title={vacancyDetails.basic_info.vacancy_title.value}
				openDate={vacancyDetails.basic_info.open_date.value}
				closeDate={vacancyDetails.basic_info.close_date.value}
				useCloseDate={vacancyDetails.basic_info.use_close_date.value == '0' ? false : true}
				vacancyState={vacancyDetails.basic_info.state.value}
				vacancyPOC={vacancyDetails.basic_info.vacancy_poc}
				sysId={sysId}
			/>
			<div className='Content'>
				<ReactQuill
					className='RichText'
					readOnly={true}
					value={vacancyDetails.basic_info.vacancy_description.value}
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
						{vacancyDetails.basic_info.number_of_recommendation.value ==
						0 ? null : (
							<li>Full Contact Details for&nbsp; 
								{numberToWordMap[
									vacancyDetails.basic_info.number_of_recommendation.value
								] +
									' (' +
									vacancyDetails.basic_info.number_of_recommendation.value +
									') Reference' +
									(vacancyDetails.basic_info.number_of_recommendation.value >
										1 ||
									vacancyDetails.basic_info.number_of_recommendation.value == 0
										? 's'
										: '') }
							</li>
						)}
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
