import { useContext, useEffect } from 'react';

import {
	Form,
	Checkbox,
	Col,
	Typography,
	Radio,
	Space,
} from 'antd';
const { Paragraph, Title } = Typography;

import FormContext from '../../../Context.js';

const DemographicsStepForm = () => {
	const [formInstance] = Form.useForm();
	const contextValue = useContext(FormContext);
	const {formData, setCurrentFormInstance} = contextValue;
	
	const share = Form.useWatch('share', formInstance);

	useEffect(() => {
		setCurrentFormInstance(formInstance);
	}, []);

	return (
		<>
			<div style={{marginLeft: 50, marginRight: 50}}>
				<Col span={24}>
					<Title level={5}>Your privacy is protected.</Title>
					<Paragraph>
						We use demographics to find out if our recruitment efforts are
						reaching all segments of the population, consistent with federal
						equal employment opportunity laws. We do not provide demographic
						data to any hiring officials, anyone involved in the hiring process
						or the public. Review our {' '}
						<a
							href='https://www.opm.gov/information-management/privacy-policy/'
							target='_blank'
							rel="noopener noreferrer"
						>
							privacy policy
						</a>{' '}
						and the {' '}
						<a
							href='https://www.opm.gov/about-us/open-government/digital-government-strategy/fitara/paperwork-reduction-act-guide.pdf'
							target='_blank'
							rel="noopener noreferrer"
						>
							Paperwork Reduction Act
						</a>{' '}
						for more information.
					</Paragraph>
					<Space direction='vertical' size={12} />
				</Col>
				<Form
					form={formInstance}
					initialValues={formData?.questions}
					labelCol={{ span: 24 }}
					wrapperCol={{ span: 24 }}
					style={{ maxWidth: 600 }}
					requiredMark={false}
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
					</div>
				</Form>
			</div>
		</>
	);
};

export default DemographicsStepForm;
