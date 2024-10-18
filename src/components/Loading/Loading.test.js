import React from 'react';
import { render } from '@testing-library/react';
import Loading from './Loading';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

jest.mock('antd', () => ({
	Spin: jest.fn(() => <div>Spin</div>),
}));

jest.mock('@ant-design/icons', () => ({
	LoadingOutlined: jest.fn(() => <div>LoadingOutlined</div>),
}));

describe('Loading Component', () => {
	it('renders LoadingOutlined icon with correct style and spin property', () => {
		const { getByText } = render(<Loading />);
		expect(getByText('LoadingOutlined')).toBeInTheDocument();
		expect(LoadingOutlined).toHaveBeenCalledWith(
			expect.objectContaining({
				style: { fontSize: 40 },
				spin: true,
			}),
			{}
		);
	});

	it('applies LoadingWidget class correctly', () => {
		const { container } = render(<Loading />);
		expect(container.firstChild).toHaveClass('LoadingWidget');
	});
});