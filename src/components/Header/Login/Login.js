import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
// import { Authenticate } from '../containers/Login/Login.js';

import './Login.css';

const login = () => (
	<div className='Login'>
		{/* <Dropdown overlay={menu}> */}

		<Button type='primary' ghost onClick={authenticate}>
			<UserOutlined /> Login <DownOutlined />
		</Button>
		{/* </Dropdown> */}
	</div>
);

const authenticate = () => {
	location.href(
		'nav_to.do?uri=' +
			encodeURIComponent(location.href + '&glide_sso_id=' + c.data.defaultIDP)
	);
};

export default login;
