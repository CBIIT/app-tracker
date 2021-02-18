import React from 'react';
import { Button, Input } from 'antd';

import './InputWithButton.css';

const inputWithButton = (props) => {
    return (
        <div className='ButtonContainer ant-input'>
            <Input className='InputWithButton' />
            <Button className='BorderlessButton' type='Link' icon={props.buttonIcon} />
        </div>
    );
};

export default inputWithButton;