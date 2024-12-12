import React from 'react';
import { render } from '@testing-library/react';
import Error from './Error';
import { Result } from 'antd';
import { FrownTwoTone } from '@ant-design/icons';

jest.mock('antd', () => ({
    Result: jest.fn(() => null),
}));

jest.mock('@ant-design/icons', () => ({
    FrownTwoTone: jest.fn(() => null),
}));

describe('Error Component', () => {
    it('should render with default props', () => {
        const { container } = render(<Error error={{}} />);
        expect(container).toMatchSnapshot();
    });

    it('should render with error status', () => {
        const error = { status: '404' };
        const { getByText } = render(<Error error={error} />);
        expect(getByText('404')).toBeInTheDocument();
        expect(getByText('Sorry, something went wrong!' + error)).toBeInTheDocument();
    });

    it('should render the FrownTwoTone icon', () => {
        render(<Error error={{}} />);
        expect(FrownTwoTone).toHaveBeenCalled();
    });

    it('should render with a custom error message', () => {
        const error = { status: '500', message: 'Internal Server Error' };
        const { getByText } = render(<Error error={error} />);
        expect(getByText('500')).toBeInTheDocument();
        expect(getByText('Sorry, something went wrong!' + error)).toBeInTheDocument();
    });

    it('should render with a different error status', () => {
        const error = { status: '403' };
        const { getByText } = render(<Error error={error} />);
        expect(getByText('403')).toBeInTheDocument();
        expect(getByText('Sorry, something went wrong!' + error)).toBeInTheDocument();
    });


    it('should render with error status', () => {
        const error = { status: '404' };
        const { getByText } = render(<Error error={error} />);
        expect(getByText('404')).toBeInTheDocument();
        expect(getByText('Sorry, something went wrong!' + error)).toBeInTheDocument();
    });

    it('should render with empty error status', () => {
        const error = {};
        const { getByText } = render(<Error error={error} />);
        expect(getByText('Sorry, something went wrong!' + error)).toBeInTheDocument();
    });
});