import './InfoCardRow.css';
const infoCardRow = (props) => (
	<div className='InfoCardRow' style={props.style}>
		{props.children}
	</div>
);

export default infoCardRow;
