import EditableTable from './EditableTable/EditableTable';

const vacancyCommittee = (props) => {
	// const [formInstance] = Form.useForm();

	// const initialValues = {};

	// const dataSource = [
	// 	{
	// 		key: '1',
	// 		name: 'Zeng When',
	// 		role: 'Chair',
	// 	},
	// 	{
	// 		key: '2',
	// 		name: 'Lidmila Vilensky',
	// 		role: 'Member',
	// 	},
	// 	{
	// 		key: '3',
	// 		name: 'Laquita Elliot',
	// 		role: 'Member (non-voting)',
	// 	},
	// ];

	// const columns = [
	// 	{
	// 		title: 'Committee Member',
	// 		dataIndex: 'name',
	// 		key: 'name',
	// 	},
	// 	{
	// 		title: 'Role',
	// 		dataIndex: 'role',
	// 		key: 'role',
	// 	},
	// 	{
	// 		title: 'Actions',
	// 		dataIndex: 'actions',
	// 		key: 'actions',
	// 	},
	// ];

	return (
		<>
			<EditableTable
				name='VacancyCommittee'
				data={props.committeeMembers}
				setData={props.setCommitteeMembers}
			/>
			{/* <UserPicker /> */}
		</>
	);
};

export default vacancyCommittee;
