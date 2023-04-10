import './EditableProfile.css';
import EditableField from '../../components/UI/EditableField/EditableField'
import EditableDropDown from '../../components/UI/EditableDropDown/EditableDropDown'
import EditableReferences from '../EditableReferences/EditableReferences'

const editableProfile = (props) => (
	<div className='EditableProfileContainer' style={props.containerStyle}>
		<h2 style={{ marginBottom: '3px' }}>John Wick</h2>
		<EditableField label="First Name" size="18"/>
		<EditableField label="Middle Name" size="18"/>
		<EditableField label="Last Name" size="18"/>
		<EditableField label="Address" size="55"/>
		<EditableField label="Address (optional)" size="55"/>
		<EditableField label="City" size="18"/>
		<EditableField label="State/Province" size="18"/>
		<EditableField label="Country" size="18"/>
		<EditableField label="Zip/Postal Code" size="18"/>
		<EditableField label="Email" size="18"/>
		<EditableField label="Confirm Email" size="18"/>
		<EditableField label="Phone Number" size="18"/>
		<EditableField label="Business Phone Number (Optional)" size="18"/>
		<EditableDropDown label="Highest Level of Education" options="Bachelors,Masters,Doctorate"/>
		<EditableDropDown label="Are you a US citizen?" options="Yes,No"/>
		<EditableReferences/>
	</div>
);

export default editableProfile;
