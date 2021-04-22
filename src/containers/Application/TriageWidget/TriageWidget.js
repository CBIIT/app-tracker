import InfoCard from '../../../components/UI/InfoCard/InfoCard';
import InfoCardRow from '../../../components/UI/InfoCard/InfoCardRow/InfoCardRow';
import LabelValuePair from '../../../components/UI/LabelValuePair/LabelValuePair';
import './TriageWidget.css';
import { Radio, Input, Button } from 'antd';
const { TextArea } = Input;

const triageWidget = (props) => (
	<div style={props.style}>
		<InfoCard
			title='Hiring Team Feedback and Notes'
			className='TriageWidgetContainer'
		>
			<InfoCardRow style={{ paddingBottom: '5px' }}>
				<LabelValuePair
					label='Your Recommendation'
					value='Should this applicant be considered for a full committee review?'
					labelStyle={{ marginBottom: '0px' }}
					valueStyle={{
						fontSize: '12px',
						color: 'var(--text-extra-light)',
						marginBottom: '0px',
					}}
				/>
			</InfoCardRow>
			<InfoCardRow>
				<Radio.Group
					options={props.triageOptions}
					optionType='button'
					buttonStyle='solid'
					onChange={props.onTriageSelect}
					value={props.triageChoice}
				/>
			</InfoCardRow>
			<InfoCardRow>
				<TextArea
					rows={4}
					onChange={props.onTriageCommentsChange}
					defaultValue={props.triageComments}
					placeholder={props.triageCommentsPlaceholder}
				/>
			</InfoCardRow>
			<InfoCardRow style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Button onClick={props.onCancelClick}>cancel</Button>
				<Button onClick={props.onSaveClick} type='primary'>
					save triage
				</Button>
			</InfoCardRow>
		</InfoCard>
	</div>
);

export default triageWidget;
