import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import './Loading.css';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const loading = () => {
	return (
		<div className='LoadingWidget'>
			<Spin indicator={antIcon} />
		</div>
	);
};

export default loading;
