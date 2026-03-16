import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { OWM_TEAM } from '../../../constants/Roles';
import { validateRoleForCurrentTenant } from '../../../components/Util/RoleValidator/RoleValidator';

import './CountTile.css';

const countTile = ({ apiUrl, title, data, currentTenant, tenants }) => {
	const [count, setCount] = useState(null);

	useEffect(() => {
		(async () => {
			if (validateRoleForCurrentTenant(OWM_TEAM, currentTenant, tenants)) {
				const response = await axios.get(apiUrl);
				setCount(response.data.result.count);
			} else {
				setCount(0);
			}
		})();
	}, [data, currentTenant]);

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
