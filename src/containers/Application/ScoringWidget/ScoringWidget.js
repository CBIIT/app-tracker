import InfoCard from '../../../components/UI/InfoCard/InfoCard';
import InfoCardRow from '../../../components/UI/InfoCard/InfoCardRow/InfoCardRow';
import LabelValuePair from '../../../components/UI/LabelValuePair/LabelValuePair';
import ScoringWidgetSlider from './ScoringWidgetSlider/ScoringWidgetSlider';

import { Input, Radio, Button, Form } from 'antd';

import './ScoringWidget.css';

const sliderMarks = [0, 1, 2, 3];
const sliderMin = 0;
const sliderMax = 3;

const { TextArea } = Input;
const { Group } = Radio;

const scoringWidget = (props) => {
	let totalScores = Object.values(props.scores).map((score) => parseInt(score));
	totalScores = totalScores.reduce((a, b) => a + b);

	return (
		<div style={props.style}>
			<Form onFinish={props.onSaveClick} name='Committee-Scoring'>
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
								value={props.scores[category.key]}
								onChange={(value) =>
									props.scoreChangeHandler(value, category.key)
								}
							/>
						))}
						<div className='totalScoreDiv'>
							<h2 style={{ display: 'inline-block' }}>Total Score: </h2>{' '}
							<p style={{ display: 'inline-block' }}>{totalScores}</p>
						</div>
						<h2 style={{ marginBottom: '6px' }}>Overall Score Comments</h2>
						<TextArea
							rows={3}
							style={{ marginBottom: '16px' }}
							onChange={props.onScoreCommentsChange}
							defaultValue={props.triageComments}
						/>
						<LabelValuePair
							label='Interview Recommendation'
							labelStyle={{ marginBottom: '0px' }}
							value='Do you recommend this candidate for an interview?'
							valueStyle={{ fontSize: '12px', marginBottom: '8px' }}
						/>
						<Form.Item
							name='Recommendation'
							rules={[
								{ required: true, message: 'Please enter a recommendation' },
							]}
							initialValue={props.triageChoice}
						>
							<Group
								options={props.triageOptions}
								optionType='button'
								buttonStyle='solid'
								onChange={props.onTriageSelect}
								value={props.triageChoice}
							/>
						</Form.Item>
					</div>
					<InfoCardRow
						style={{ display: 'flex', justifyContent: 'space-between' }}
					>
						<Form.Item>
							<Button onClick={props.onCancelClick}>cancel</Button>
						</Form.Item>
						<Form.Item>
							<Button type='primary' htmlType='submit'>
								save score
							</Button>
						</Form.Item>
					</InfoCardRow>
				</InfoCard>
			</Form>
		</div>
	);
};

export default scoringWidget;
