import { useParams } from 'react-router-dom';
import Error from '../../components/UI/Error/Error';

import Apply from './Apply';
import {
	GET_APPLICATION_DRAFT,
	APPLICANT_GET_APPLICATION,
} from '../../constants/ApiEndpoints';
import { useFetch } from '../../hooks/useFetch';
import { transformJsonFromBackend } from '../ApplicantApplicationView/Util/transformJsonFromBackend';

const editApplication = () => {
	const { draft, appSysId } = useParams();

	const {
		isLoading,
		error,
		data: application,
	} = useFetch(
		(draft ? GET_APPLICATION_DRAFT : APPLICANT_GET_APPLICATION) + appSysId,
		draft
			? (response) => JSON.parse(response.jsonobj.value)
			: (response) => transformJsonFromBackend(response)
	);

	return !isLoading ? (
		!error ? (
			<Apply initialValues={application} />
		) : (
			<Error error={error} />
		)
	) : (
		<></>
	);
};

export default editApplication;
