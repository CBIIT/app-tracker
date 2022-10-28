import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

import './CountTile.css';

const countTile = ({ apiUrl, title, data }) => {
	const [count, setCount] = useState(null);

	useEffect(() => {
		(async () => {
			const response = await axios.get(apiUrl);
			setCount(response.data.result.count);
		})();
	}, [data]);

	return (
		<span className='CountTileContainer'>
			{count !== null ? (
				<p className='CountTileCount'>{count}</p>
			) : (
				<p className='CountTileCount'>
					<LoadingOutlined style={{ fontSize: '20px' }} spin />
				</p>
			)}
			<p className='CountTileTitle'>{title}</p>
		</span>
	);
};

export default countTile;
