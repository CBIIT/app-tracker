import EditableTable from './EditableTable/EditableTable';

const vacancyCommittee = (props) => {
	return (
		<>
			<EditableTable
				name='VacancyCommittee'
				data={props.committeeMembers}
				setData={props.setCommitteeMembers}
				getData={props.getCommitteeMembers}
				formInstance={props.formInstance}
			/>
		</>
	);
};

export default vacancyCommittee;
