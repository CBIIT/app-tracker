import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ViewVacancyDetails from './ViewVacancyDetails';
import Header from './Header/Header';
import Divider from './Divider/Divider';
import useAuth from '../../hooks/useAuth';
import { describe } from 'optimist';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
}));
jest.mock('../../hooks/useAuth', () => ({
    __esModule: true,
    default: jest.fn(), 
}));
jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
    }
}));

describe('ViewVacancyDetails', () => {});