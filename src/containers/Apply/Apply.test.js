import React from 'react';
import { render } from '@testing-library/react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { message } from 'antd';
import Apply from './Apply';
import useAuth from '../../hooks/useAuth';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
    useHistory: jest.fn(),
}));
jest.mock('../../hooks/useAuth', () => ({
    _esModule: true,
    default: jest.fn(),
}));
jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
    },
}));

