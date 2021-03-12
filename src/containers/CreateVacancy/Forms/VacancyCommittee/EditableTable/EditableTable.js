import { useState } from 'react';

import { Form, Table, Button } from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	CheckOutlined,
	CloseOutlined,
} from '@ant-design/icons';

import './EditableTable.css';
import EditableCell from './EditableCell/EditableCell';

const originData = [];

const editableTable = (props) => {
	const form = props.formInstance;
	const [data, setData] = useState(originData);
	const [editingKey, setEditingKey] = useState('');
	const [addingKey, setAddingKey] = useState('');

	const isEditing = (record) => record.key === editingKey;

	const clearKeys = () => {
		setEditingKey('');
		setAddingKey('');
	};

	const validateCommittee = async () => {
		const numberOfChairMembers = data.filter((member) => {
			return member.role === 'Chair';
		});

		if (numberOfChairMembers.length < 1)
			throw new Error(
				"Atleast one committee member must be of the role 'Chair'"
			);
		else form.setFields([{ name: 'vacancyCommitteeValidator', error: '' }]);
	};

	const getInputType = (dataIndex) => {
		switch (dataIndex) {
			case 'user':
				return 'typeAhead';
			case 'displayValue':
				return 'typeAhead';
			case 'role':
				return 'dropdown';
			default:
				return 'text';
		}
	};

	const addButtonHandler = () => {
		let newIndex = 0;
		if (data.length > 0) newIndex = Math.max(...data.map(({ key }) => key)) + 1;

		const newData = {
			key: newIndex,
			user: null,
			role: newIndex === 0 ? 'Chair' : 'Member (voting)',
		};

		form.setFieldsValue({
			...newData,
		});

		setData([...data, newData]);
		setEditingKey(newIndex);
		setAddingKey(newIndex);
	};

	const removeButtonHandler = (key) => {
		const newData = data.filter((row) => row.key !== key);
		setData(newData);
		props.setData(newData);
		clearKeys();
		form.validateFields(['vacancyCommitteeValidator']);
	};

	const edit = (record) => {
		form.setFieldsValue({
			...record,
		});
		setEditingKey(record.key);
	};

	const cancel = () => {
		setEditingKey('');
		if (addingKey !== '') removeButtonHandler(addingKey);
	};

	const save = async (key) => {
		try {
			const row = await form.validateFields(['user', 'role']);
			const newData = [...data];
			const index = newData.findIndex((item) => key === item.key);

			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, { ...item, ...row });
			} else {
				newData.push(row);
			}

			setData(newData);
			clearKeys();
			props.setData(newData);
			form.validateFields(['vacancyCommitteeValidator']);
		} catch (errInfo) {
			// console.log('Validate Failed:', errInfo);
		}
	};

	const columns = [
		{
			title: 'Committee Member',
			dataIndex: 'user',
			editable: true,
			width: '50%',
			render: (_, record) => {
				const editable = isEditing(record);
				// return editable ? <></> : <div>{record.user.name.display_value}</div>;
				return editable ? <></> : <div>{record.user.name.value}</div>;
			},
		},
		{
			title: 'Role',
			dataIndex: 'role',
			editable: true,
			width: '25%',
		},
		{
			title: 'Action',
			dataIndex: 'operation',
			width: '25%',
			render: (_, record) => {
				const editable = isEditing(record);
				return editable ? (
					<>
						<Button
							className='ActionButton'
							type='link'
							onClick={() => save(record.key)}
							icon={<CheckOutlined />}
						>
							save
						</Button>
						<Button
							className='ActionButton'
							type='link'
							onClick={cancel}
							icon={<CloseOutlined />}
						>
							cancel
						</Button>
					</>
				) : (
					<>
						<Button
							className='ActionButton'
							type='text'
							disabled={editingKey !== ''}
							onClick={() => edit(record)}
							icon={<EditOutlined />}
						>
							edit
						</Button>
						<Button
							className='ActionButton'
							type='text'
							disabled={editingKey !== ''}
							onClick={() => removeButtonHandler(record.key)}
							icon={<DeleteOutlined />}
						>
							remove
						</Button>
					</>
				);
			},
		},
	];

	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: getInputType(col.dataIndex),
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

	return (
		<Form form={form} component={false} name={props.name}>
			<Table
				locale={{
					emptyText:
						"Currently no committee members.  Click 'add member' to begin adding committee members.",
				}}
				components={{
					body: {
						cell: EditableCell,
					},
				}}
				dataSource={data}
				columns={mergedColumns}
				pagination={{
					hideOnSinglePage: true,
				}}
			/>
			<Button
				className='AddButton'
				type='secondary'
				onClick={addButtonHandler}
				disabled={editingKey !== ''}
			>
				<PlusOutlined /> add member
			</Button>

			<Form.Item
				name='vacancyCommitteeValidator'
				rules={[{ validator: validateCommittee }]}
			>
				{/* Supress antd warning about using name */}
				<input style={{ display: 'none' }} />
			</Form.Item>
		</Form>
	);
};

export default editableTable;
