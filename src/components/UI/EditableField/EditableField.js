import './EditableField.css';

// const childToParent = () => {
   
// }

// const handleChange = (event) => {
// 	//alert('val:' + event.target.value);
// };


const editableField = (props) => (
	<div className='EditableFieldContainer' style={props.containerStyle}>
		<span style={props.labelStyle}>{props.label}</span><br/>
		<input type="text" style={props.valueStyle} value={props.value} size={props.size} onChange={props.callback}/>
	</div>
);

export default editableField;
