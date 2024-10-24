import { useParams } from 'react-router-dom';
import Error from '../../components/UI/Error/Error';

import Apply from './Apply';
import {
	GET_APPLICATION_DRAFT,
	APPLICANT_GET_APPLICATION,
} from '../../constants/ApiEndpoints';
import { useFetch } from '../../hooks/useFetch';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend';

const editApplication = () => {
	const { draft, appSysId } = useParams();

	const transformDraftJson = (response) => {
		const basicInfo = JSON.parse(response.jsonobj.value);
		//console.log(response.app_documents)
		basicInfo.applicantDocuments = response.app_documents.map((document) => {
			const applicantDocument = {
				documentName: document.doc_name,
				table_name: document.table_name,
				table_sys_id: document.table_sys_id,
			};

			if (document.attach_sys_id)
				applicantDocument['uploadedDocument'] = {
					fileName: document.file_name,
					downloadLink: document.attachment_dl,
					attachSysId: document.attach_sys_id,
					markedToDelete: false,
				};

			return applicantDocument;
		})
		return basicInfo;
	}

	const {
		isLoading,
		error,
		data: application,
	} = useFetch(
		(draft ? GET_APPLICATION_DRAFT : APPLICANT_GET_APPLICATION) + appSysId,
		draft
			? (response) => transformDraftJson(response)
			: (response) => transformJsonFromBackend(response)
	);
	//console.log(application)
	return !isLoading ? (
		!error ? (
			<Apply
				initialValues={application}
				editSubmitted={!draft ? true : false}
			/>
		) : (
			<Error error={error} />
		)
	) : (
		<></>
	);
};

export default editApplication;
