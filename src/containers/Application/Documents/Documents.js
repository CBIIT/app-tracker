import InfoCard from '../../../components/UI/InfoCard/InfoCard';
import './Documents.css';

const documents = (props) => (
	<div style={props.style}>
		<InfoCard title='Applicant Documents'>
			<ul className='ApplicantDocumentList'>
				{props.documents.map((document, index) => (
					<li key={index}>
						<div className='LineItemItem'>{document.title}</div>
						<div className='LineItemItem'>
							<a href={document.downloadLink}>{document.filename}</a>
						</div>
					</li>
				))}
			</ul>
		</InfoCard>
	</div>
);

export default documents;
