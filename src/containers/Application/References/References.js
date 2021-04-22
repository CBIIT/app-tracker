import InfoCard from '../../../components/UI/InfoCard/InfoCard';

const references = (props) => (
	<div style={props.style}>
		<InfoCard
			title='References'
			onSwitchToggle={props.handleToggle}
			switchTitle='Display to committee members?'
			switchInitialValue={props.switchInitialValue}
		>
			<ul className='ApplicantDocumentList'>
				{props.references.map((reference, index) => (
					<li key={index}>
						<div className='LineItemItem'>{reference.name}</div>
						<div className='LineItemItem'>
							<a href={reference.document.downloadLink}>
								{reference.document.filename}
							</a>
						</div>
					</li>
				))}
			</ul>
		</InfoCard>
	</div>
);

export default references;
