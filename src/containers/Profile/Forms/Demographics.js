import { useContext, useEffect } from 'react';
import axios from 'axios';

import {
	Form,
	Checkbox,
	Col,
	Button,
	Typography,
	message,
	Radio,
	Row,
	Space,
	Tooltip
} from 'antd';
const { Paragraph, Title } = Typography;
import { InfoCircleOutlined } from '@ant-design/icons';

import { SAVE_PROFILE } from '../../../constants/ApiEndpoints';

import ProfileContext from '../Util/FormContext';
import { convertDataToBackend } from '../Util/ConvertDataToBackend';

const DemographicsForm = ({ setDemoOpen }) => {
	const [formInstance] = Form.useForm();
	const contextValue = useContext(ProfileContext);
	const { profile, hasProfile, setHasProfile } = contextValue;
	const share = Form.useWatch('share', formInstance);
	const { setCurrentProfileInstance, setProfile } = contextValue;

	useEffect(() => {
		setCurrentProfileInstance(formInstance);
	}, []);

	const onSave = async (values) => {
		const successKey = 'success';
		const errorKey = 'error';
		const validatedAnswers = await formInstance.validateFields();
		if (validatedAnswers.share === undefined || validatedAnswers.share === '') {
			message.error({
				errorKey,
				content: 'Please select if you would like to share your demographics to improve the hiring process.',
				duration: 3
			});

			await formInstance.validateFields();
		} else {
			try {
				let data = {...profile, demographics: values};
				setProfile(data);
				await axios.post(SAVE_PROFILE, convertDataToBackend(data));
				message.info({
					successKey,
					content: 'Demographics saved successfully',
					duration: 3
				});
			} catch (e) {
				console.log(e);
				message.error('Sorry! There was an error saving your profile.')
			}
		}
		setHasProfile(true);
		setDemoOpen(false);
	}

	return (
		<>
			<div style={{marginLeft: 50, marginRight: 50}}>
				<Col span={24}>
					<Title level={4}>Demographic Information</Title>
					{!profile?.demographics.share ? (
						<Paragraph>
							You have no demographic details saved in your profile. Entering
							your details takes a few minutes and helps improve the federal
							hiring process. We never use your details in hiring decisions or
							send individual details to hiring managers.
						</Paragraph>
					) : (
						<></>
					)}
					
					<Space>
						<Title level={5} style={{"margin-top": "10px"}}>Your privacy is protected.</Title>
						<Tooltip
							title='Demographic information shared here will not save until the "save" button is tapped.'
						>
							<Typography.Link>
								<InfoCircleOutlined style={{ fontSize: '1.25rem' }} />
							</Typography.Link>
						</Tooltip>
					</Space>
					<Paragraph>
						We use demographics to find out if our recruitment efforts are
						reaching all segments of the population, consistent with federal
						equal employment opportunity laws. We do not provide demographic
						data to any hiring officials, anyone involved in the hiring process
						or the public. Review our {/*content to open in new window*/}{' '}
						privacy policy and the {/* also opens link in new window */}{' '}
						Paperwork Reduction Act for more information.
					</Paragraph>
					<Space direction='vertical' size={12} />
				</Col>
				<Form
					form={formInstance}
					initialValues={profile?.demographics}
					labelCol={{ span: 24 }}
					wrapperCol={{ span: 24 }}
					style={{ maxWidth: 600 }}
					requiredMark={false}
					onFinish={onSave}
					layout='vertical'
					name='demographics'
				>
					<div>
						<Form.Item
							name='share'
							label=''
							rules={[
								{
									required: true,
									message: 'Please select an option',
								},
							]}
						>
							<Radio.Group>
								<Space direction='vertical' size='middle'>
									<Radio value='1'>
										I want to share my demographic details and help improve the
										hiring process.
									</Radio>
									<Radio value= '0'>
										I do not want to answer the demographic questions.
									</Radio>
								</Space>
							</Radio.Group>
						</Form.Item>
						{share === '1' ? (
							<>
								<Form.Item name='sex' label='Sex'>
									<Radio.Group>
										<Space direction='vertical'>
											<Radio value='Male'>Male</Radio>
											<Radio value='Female'>Female</Radio>
										</Space>
									</Radio.Group>
								</Form.Item>
								<Form.Item name='ethnicity' label='Ethnicity'>
									<Radio.Group>
										<Space direction='vertical'>
											<Radio value='1'>Hispanic or Latino</Radio>
											<Radio value='0'>Not Hispanic or Latino</Radio>
										</Space>
									</Radio.Group>
								</Form.Item>
								<Form.Item name='race' label='Race'>
									<Checkbox.Group>
										<Space direction='vertical'>
											<Checkbox value='American Indian'>
												American Indian or Alaska Native
											</Checkbox>
											<Checkbox value='Asian'>Asian</Checkbox>
											<Checkbox value='African-American'>
												Black or African-American
											</Checkbox>
											<Checkbox value='Pacific Islander'>
												Native Hawaiian or other Pacific Islander
											</Checkbox>
											<Checkbox value='White'>White</Checkbox>
										</Space>
									</Checkbox.Group>
								</Form.Item>
								<Form.Item
									name='disability'
									label='Disability/Serious Health Condition'
								>
									<Checkbox.Group>
										<Space direction='vertical'>
											<Checkbox value='Deaf'>
												Deaf or serious difficulty hearing
											</Checkbox>
											<Checkbox value='Blind'>
												Blind or serious difficulty seeing even when wearing
												glasses
											</Checkbox>
											<Checkbox value='Amputee'>
												Missing an arm, leg, hand or foot
											</Checkbox>
											<Checkbox value='Paralysis'>
												Paralysis: partial or complete paralysis (any cause)
											</Checkbox>
											<Checkbox value='Disfigurement'>
												Significant disfigurement: for example, severe
												disfigurements caused by burns, wounds, accidents or
												congenital disorders
											</Checkbox>
											<Checkbox value='Mobility Impairment'>
												Significant mobility impairment: for example, uses a
												wheelchair, scooter, walker or uses a leg brace to walk
											</Checkbox>
											<Checkbox value='Psychiatric Disorder'>
												Significant psychiatric disorder: for example, bipolar
												disorder, schizophrenia, PTSD or major depression
											</Checkbox>
											<Checkbox value='Intellectual Disability'>
												Intellectual disability (formerly described as mental
												retardation)
											</Checkbox>
											<Checkbox value='Developmental Disability'>
												Developmental disability: for example, cerebral palsy or
												autism spectrum disorder
											</Checkbox>
											<Checkbox value='Brain Injury'>
												Traumatic brain injury
											</Checkbox>
											<Checkbox value='Dwarfism'>Dwarfism</Checkbox>
											<Checkbox value='Epilepsy'>
												Epilepsy or other seizure disorder
											</Checkbox>
											<Checkbox value='Other Disability'>
												Other disability or serious health condition: for
												example, diabetes, cancer, cardiovascular disease,
												anxiety disorder or HIV infection; a learning
												disability, a speech impairment or a hearing impairment
											</Checkbox>
											<Checkbox value='None'>
												None of the conditions listed above apply to me.
											</Checkbox>
											<Checkbox value='Do Not Wish to Answer'>
												I do not wish to answer questions regarding my
												disability/health conditions.
											</Checkbox>
										</Space>
									</Checkbox.Group>
								</Form.Item>
							</>
						) : (
							<></>
						)}
						<Form.Item>
							<Row>
								{!hasProfile ? (
									<></>
								) : (
									<>
										<Col span={6}>
											<Button
												className='wider-button'
												onClick={() => setDemoOpen(false)}
											>
												Cancel
											</Button>
										</Col>
										<Col span={12}></Col>
									</>
								)}
								<Col span={6}>
									<Button
										className='wider-button'
										type='primary'
										htmlType='submit'
									>
										Save
									</Button>
								</Col>
							</Row>
						</Form.Item>
					</div>
				</Form>
			</div>
		</>
	);
};

export default DemographicsForm;
