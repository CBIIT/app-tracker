import InfoCard from '../../../components/UI/InfoCard/InfoCard';
import InfoCardRow from '../../../components/UI/InfoCard/InfoCardRow/InfoCardRow';
import LabelValuePair from '../../../components/UI/LabelValuePair/LabelValuePair';
import ScoringWidgetSlider from './ScoringWidgetSlider/ScoringWidgetSlider';

import { Input, Radio, Button } from 'antd';

import './ScoringWidget.css';

const sliderMarks = [0, 1, 2, 3];
const sliderMin = 0;
const sliderMax = 3;

const { TextArea } = Input;
const { Group } = Radio;

const scoringWidget = (props) => (
	<div style={props.style}>
		<InfoCard title={props.title}>
			<InfoCardRow>
				<LabelValuePair
					value={props.description}
					valueStyle={{ marginBottom: '0px' }}
				/>
			</InfoCardRow>
			<div className='ScoringWidgetContent'>
				{props.categories.map((category) => (
					<ScoringWidgetSlider
						key={category.key}
						title={category.title}
						sliderMarks={sliderMarks}
						sliderMin={sliderMin}
						sliderMax={sliderMax}
						onChange={(value) => props.scoreChangeHandler(value, category.key)}
					/>
				))}
				<h2 style={{ marginBottom: '6px' }}>Overall Score Comments</h2>
				<TextArea
					rows={3}
					style={{ marginBottom: '16px' }}
					onBlur={props.onScoreCommentsChange}
				/>
				<LabelValuePair
					label='Interview Recommendation'
					labelStyle={{ marginBottom: '0px' }}
					value='Do you recommend this candidate for an interview?'
					valueStyle={{ fontSize: '12px', marginBottom: '8px' }}
				/>
				<Group
					options={props.triageOptions}
					optionType='button'
					buttonStyle='solid'
					onChange={props.onTriageSelect}
					value={props.triageChoice}
				/>
			</div>
			<InfoCardRow style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Button onClick={props.onCancelClick}>cancel</Button>
				<Button onClick={props.onSaveClick} type='primary'>
					save score
				</Button>
			</InfoCardRow>
		</InfoCard>
	</div>
);

export default scoringWidget;
