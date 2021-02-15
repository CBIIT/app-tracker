import React from 'react';

import { Button } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import './Login.css';

const login = () => (
    <div className='Login'>
        {/* <Dropdown overlay={menu}> */}
            <Button type='primary' ghost>
                <UserOutlined /> Login <DownOutlined />
            </Button>
        {/* </Dropdown> */}
    </div>
);

export default login;