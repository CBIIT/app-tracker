import { Result } from 'antd';
import { FrownTwoTone } from '@ant-design/icons';

const error = ({ error }) => {
	const errorStatus = error?.status ? error?.status : '';

	return (
		<Result
			icon={<FrownTwoTone />}
			status={errorStatus}
			title={errorStatus}
			subTitle={'Sorry, something went wrong!' + error}
		/>
	);
};

export default error;
