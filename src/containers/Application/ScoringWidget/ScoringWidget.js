import InfoCard from '../../../components/UI/InfoCard/InfoCard';
import InfoCardRow from '../../../components/UI/InfoCard/InfoCardRow/InfoCardRow';
import LabelValuePair from '../../../components/UI/LabelValuePair/LabelValuePair';
import ScoringWidgetSlider from './ScoringWidgetSlider/ScoringWidgetSlider';

import { Input, Radio, Button, Form, Select } from 'antd';

import './ScoringWidget.css';
import { useEffect } from 'react';

const sliderMarks = [0, 1, 2, 3];
const sliderMin = 0;
const sliderMax = 3;

const { TextArea } = Input;
const { Group } = Radio;
const { Option } = Select;

const scoringWidget = (props) => {
	const [formInstance] = Form.useForm();

	useEffect(() => {
		formInstance.resetFields();
	}, [props]);

	let total = '';
	if (props.scores.length === 0) {
		total = '';
	} else {
		total = 0;
		for (var key of Object.keys(props.scores)) {
			total += +props.scores[key];
		}
	}

	let menu = {};
	if (props.committeeMemberDropdownChoices) {
		menu = (
			<Select
				style={{ width: '100%' }}
				defaultValue={0}
				onChange={props.committeeMemberDropdownOnClick}
			>
				{props.committeeMemberDropdownChoices.map((choice, index) => {
					return (
						<Option key={index} value={index}>
							{choice}
						</Option>
					);
				})}
			</Select>
		);
	}

	return (
		<div style={props.style}>
			<Form
				onFinish={props.onSaveClick}
				name='Committee-Scoring'
				form={formInstance}
				initialValues={{ recommendation: props.triageChoice }}
			>
				<InfoCard
					title={props.title}
					allowToggle={true}
					initiallyHideContent={props.initiallyHideContent}
				>
					{props.enableCommitteeMemberDropdown ? (
						<div className='ScoringWidgetMemberPicker'>
							<h2>Score and notes for: </h2>
							{menu}
						</div>
					) : null}
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
							<p style={{ display: 'inline-block' }}>{total}</p>
						</div>
						<h2 style={{ marginBottom: '6px' }}>Overall Score Comments</h2>
						<TextArea
							rows={3}
							style={{ marginBottom: '16px' }}
							onChange={props.onScoreCommentsChange}
							value={props.triageComments}
						/>
						<LabelValuePair
							label='Interview Recommendation'
							labelStyle={{ marginBottom: '0px' }}
							value='Do you recommend this candidate for an interview?'
							valueStyle={{ fontSize: '12px', marginBottom: '8px' }}
						/>
						<Form.Item
							name='recommendation'
							rules={[
								{ required: true, message: 'Please enter a recommendation' },
							]}
						>
							<Group
								options={props.triageOptions}
								optionType='button'
								buttonStyle='solid'
								onChange={props.onTriageSelect}
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
