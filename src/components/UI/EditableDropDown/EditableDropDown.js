import './EditableDropDown.css';
import Select from 'react-select'

const editableDropDown = (props) => (
	<div className='EditableDropDownContainer' style={props.containerStyle}>
		<span style={props.labelStyle}>{props.label}</span><br/>
		<Select options={props.options} defaultValue={props.defaultValue} onChange={props.callback}/>
	</div>
);

export default editableDropDown;
