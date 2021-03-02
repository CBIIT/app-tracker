import EditableTable from './EditableTable/EditableTable';

const vacancyCommittee = (props) => {
	return (
		<>
			<EditableTable
				name='VacancyCommittee'
				data={props.committeeMembers}
				setData={props.setCommitteeMembers}
			/>
		</>
	);
};

export default vacancyCommittee;
