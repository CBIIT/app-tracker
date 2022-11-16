import { useEffect, useState } from 'react';
import axios from 'axios';
export const useFetch = (url, transformFunction) => {
	const [data, setData] = useState();
	const [error, setError] = useState();
	const [isLoading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await axios.get(url);
			const rawData = response.data.result;

			if (transformFunction && typeof transformFunction === 'function')
				setData(transformFunction(rawData));
			else setData(rawData);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [url]);

	return { data, setData, error, isLoading };
};
