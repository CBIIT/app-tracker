import './EditableReferences.css';
import EditableField from '../EditableField/EditableField'
import EditableDropDown from '../EditableDropDown/EditableDropDown'
import EditableRadio from '../EditableRadio/EditableRadio'

const editableReferences = (props) => (
	<div className='EditableReferencesContainer' style={props.containerStyle}>
		<h2 style={{ marginBottom: '3px' }}>References</h2>
		<EditableField label="First Name" size="18"/>
		<EditableField label="Last Name" size="18"/>
		<EditableField label="Email" size="18"/>
		<EditableField label="Phone Number" size="18"/>
		<EditableField label="Company" size="18"/>
		<EditableField label="Position" size="18"/>
		<EditableRadio label="May we contact this person?" options="Yes,No"/>
	</div>
);

export default editableReferences;
