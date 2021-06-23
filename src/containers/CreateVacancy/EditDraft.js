import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import { GET_DRAFT } from '../../constants/ApiEndpoints';
import CreateVacancy from './CreateVacancy';

const editDraft = () => {
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const { sysId } = useParams();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setIsLoading(true);
		const response = await axios.get(GET_DRAFT + sysId);
		const newData = transformBackendJson(
			JSON.parse(response.data.result.jsonobj.value)
		);
		setData(newData);
		setIsLoading(false);
	};

	const transformBackendJson = (json) => {
		const newBasicInfo = {
			...json.basicInfo,
		};

		if (json.basicInfo.openDate)
			newBasicInfo['openDate'] = moment(json.basicInfo.openDate);

		if (json.basicInfo.closeDate)
			newBasicInfo['closeDate'] = moment(json.basicInfo.closeDate);

		const newJson = {
			...json,
			basicInfo: newBasicInfo,
		};

		return newJson;
	};

	return isLoading ? (
		<></>
	) : (
		<CreateVacancy initialValues={data} draftSysId={sysId} />
	);
};

export default editDraft;
