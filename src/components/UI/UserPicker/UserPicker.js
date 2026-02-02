import { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Select, Space } from 'antd';
import useAuth from '../../../hooks/useAuth';
import { USER_LIST } from '../../../constants/ApiEndpoints.js';
import { LoadingOutlined } from '@ant-design/icons';

import './UserPicker.css';
const { Option } = Select;

const referenceField = ({ value = {}, onChange }) => {
	const { currentTenant, committeeMemberOptions, setCommitteeMemberOptions } = useAuth();
	const [user, setUser] = useState(value);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			if (committeeMemberOptions && committeeMemberOptions.length <= 0) {
				let url = buildUrl();
				try {
					const userResponse = await axios.get(url);
					userResponse.data.result?.forEach((u) => {
						u.label = u.name.value;
						u.value = u.uid;
					});
					userResponse.data.result.sort((a, b) => a.name.value.localeCompare(b.name.value));
					setCommitteeMemberOptions(userResponse.data.result)
					setIsLoading(false);
				} catch (err) {
					console.warn('UserPicker: Axios Error while loading users.', err);
					message.destroy();
					message.error('Sorry!  An error occurred.  Unable to load users.  Try reloading the page and trying again.');
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		})();
	}, []);

	const buildUrl = () => {
		const url = [USER_LIST];
		const responseFields = ['sys_id', 'name', 'email', 'organization'];


		url.push(`^nameISNOTEMPTY`);
		url.push(`^ORDERBYname`);
		url.push('&sysparm_fields=' + responseFields.join(','));
		url.push('&sysparm_tenant=' + currentTenant);

		return url.join('');
	};

	const triggerChange = (changedValue) => {
		onChange?.({
			...value,
			...changedValue,
		});
	};

	const handleChange = (index) => {
		const selectedUser = committeeMemberOptions[index] ? committeeMemberOptions[index] : {};
		setUser(selectedUser);
		triggerChange(selectedUser);
	};

	return isLoading ? (
		<Space block='true' style={{ display: 'flex', justifyContent: 'center' }}>
			<LoadingOutlined data-testid="loading-icon" style={{ fontSize: '2rem' }} />
		</Space>
	) : (
			<Select
				data-testid="user-picker-select"
				showSearch
				placeholder="Search to select a user"
				filterSort={(optionA, optionB) =>
					(optionA?.label ?? '')
						.toLowerCase()
						.localeCompare((optionB?.label ?? '').toLowerCase())
				}
				filterOption={(input, option) =>
					option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
				style={{ width: '100%' }}
				value={user}
				onChange={(value) => {
					handleChange(value);
				}}
			>
				{committeeMemberOptions && committeeMemberOptions.map((choice, index) => {
					return (
						<Option key={index} value={index}>
							{choice.name.value}
						</Option>
					);
				})}
			</Select>
	);
};


export default referenceField;
