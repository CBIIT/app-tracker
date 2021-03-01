import React from 'react';
import { Button } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Redirect, Route } from 'react-router-dom';
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

const authenticate = async () => {
	let res = await fetch('/api/x_g_nci_app_tracke/login/check_auth').then(
		(res) => {
			return res.json();
		}
	);

	<>
		<Route>
			{res.result.logged_in == true ? (
				<Redirect to='/vacancy-dashboard' />
			) : (
				(location.href =
					'nav_to.do?uri=' +
					'nci-vms.do#/' +
					'?TARGET=https://service-dev2.nci.nih.gov/nci-vms.do#/vacancy-dashboard')
			)}
		</Route>

		{/* if (res.result.logged_in == true){

  }
  else{
    location.href = 
      'nav_to.do?uri=' +
        encodeURIComponent(location.href + '&glide_sso_id=' + res.result.default_idp)

  } */}
	</>;
};

export default login;
