import { useState } from 'react';
import axios from 'axios';
import { AsyncPaginate } from 'react-select-async-paginate';
import { components } from 'react-select';

import './UserPicker.css';

const referenceField = ({ value = {}, onChange }) => {
	const [user, setUser] = useState(value);

	const filterOption = (option, search) => {
		let query = new RegExp(search, 'gi');
		// const fieldVal = option.data['name'].display_value;
		// const secondaryFieldVal = option.data['email'].display_value;
		const fieldVal = option.data['name'].value;
		const secondaryFieldVal = option.data['email'].value;

		if (fieldVal.match(query) || secondaryFieldVal.match(query)) return true;
	};

	const formatOptionLabel = (option) => (
		<DropdownItem
			label={option['name'].value}
			email={option['email'].value}
			organization={option['organization'].value}
			// label={option['name'].display_value}
			// email={option['email'].display_value}
			// organization={option['organization'].display_value}
		/>
	);

	const triggerChange = (changedValue) => {
		onChange?.({
			...value,
			...changedValue,
		});
	};

	const onDropdownChange = (user) => {
		setUser(user);

		triggerChange(user);
	};

	const loadOptions = async (searchQuery, prevOptions) => {
		let url = buildUrl(searchQuery, prevOptions.length);
		let options = [];
		let hasMore = false;
		try {
			let res = await axios.get(url);
			let data = res.data.result;
			if (data.length !== 0) {
				options = data;
				hasMore = true;
			}
		} catch (err) {
			console.warn(err);
		}

		return { options, hasMore };
	};

	const buildUrl = (searchQuery, offset) => {
		const url = ['/api/x_g_nci_app_tracke/user/get_user_list?sysparm_query='];
		// const url = ['/api/now/table/x_g_nci_app_tracke_user?sysparm_query='];
		const responseFields = ['sys_id', 'name', 'email', 'organization'];

		if (searchQuery) {
			url.push(`nameLIKE${searchQuery}^ORemailLIKE${searchQuery} `);
		}

		url.push(`^nameISNOTEMPTY`);
		url.push(`^ORDERBYname`);
		url.push('&sysparm_fields=' + responseFields.join(','));
		url.push('&sysparm_limit=' + 20);
		url.push('&sysparm_offset=' + offset);
		url.push('&sysparm_display_value=all');

		return url.join('');
	};

	return (
		<AsyncPaginate
			className='reference-field'
			debounceTimeout={300}
			value={user}
			loadOptions={loadOptions}
			formatOptionLabel={formatOptionLabel}
			// getOptionLabel={(option) => option['name'].display_value}
			// getOptionValue={(option) => option.sys_id.display_value}
			getOptionLabel={(option) => option['name'].value}
			getOptionValue={(option) => option.sys_id.value}
			onChange={onDropdownChange}
			filterOption={filterOption}
			components={{ SingleValue }}
		/>
	);
};

// formatting selected value to only display main field
const SingleValue = ({ children, ...props }) => {
	return (
		<components.SingleValue {...props}>
			{children.props.label}
		</components.SingleValue>
	);
};

const DropdownItem = (props) => {
	return (
		<div className='UserPickerDropdown'>
			<span>{props.label}</span>
			<span className='DropdownEmail'>{props.email}</span>
			<span className='secondaryLabel'>{props.organization}</span>
		</div>
	);
};

export default referenceField;
