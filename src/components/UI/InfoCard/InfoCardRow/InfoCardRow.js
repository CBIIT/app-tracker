import './InfoCardRow.css';
const infoCardRow = (props) => (
	<div className='InfoCardRow' style={props.style} data-testid="info-card-row">
		{props.children}
	</div>
);

export default infoCardRow;
