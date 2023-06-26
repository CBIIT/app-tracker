import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import ReactQuill from 'react-quill';
import { extractAndTransformMandatoryStatements } from '../../components/Util/Vacancy/Vacancy';

import Header from './Header/Header';
import Divider from './Divider/Divider';
import { VACANCY_DETAILS_FOR_APPLICANTS } from '../../constants/ApiEndpoints';

import './ViewVacancyDetails.css';

const numberToWordMap = { 0: 'Zero', 1: 'One', 2: 'Two', 3: 'Three' };

const viewVacancyDetails = () => {
	const [vacancyDetails, setVacancyDetails] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const { sysId } = useParams();

	const getCloseTime = (time) => {
		const timeArr = time.split(':');
		let hours = timeArr[0];
		let minutes = timeArr[1];
		if (hours >= 12) {
			hours -= 12;
			return `${hours}:${minutes}PM`
		} else {
			return `${hours}:${minutes}AM`
		}
	}

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
				vacancyState={vacancyDetails.basic_info.state.value}
				closeTime={getCloseTime(vacancyDetails.basic_info.closing_time.label)}
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
							<li>
								{numberToWordMap[
									vacancyDetails.basic_info.number_of_recommendation.value
								] +
									' (' +
									vacancyDetails.basic_info.number_of_recommendation.value +
									') Letter' +
									(vacancyDetails.basic_info.number_of_recommendation.value >
										1 ||
									vacancyDetails.basic_info.number_of_recommendation.value == 0
										? 's'
										: '') +
									' of Recommendation'}
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
