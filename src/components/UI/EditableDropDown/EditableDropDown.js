import './EditableDropDown.css';

const editableDropDown = (props) => (
	<div className='EditableFieldContainer' style={props.containerStyle}>
		<span style={props.labelStyle}>{props.label}</span><br/>
		<input type="text" style={props.valueStyle} value={props.value} size={props.size}/>
	</div>
);

export default editableDropDown;
