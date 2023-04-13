import { useContext, useEffect, useState } from 'react';
import { Form, Checkbox, Typography, Radio, Row, Space } from 'antd';
const { Paragraph, Title } = Typography;

import ProfileContext from '../Util/FormContext';
// import Loading from '../../../components/Loading/Loading';

// user from auth
// pass demographics as props; if props is empty then display empty form
// options array
// if user has no demographics on the demo table top mock up paragraph
// every user should see privacy notice
// ask share question
// if user decides to share; populate remaining demographics questions
const DemographicsForm = ({ demographics }) => {
	const [componentDisabled, setComponentDisabled] = useState(true);
	const [formInstance] = Form.useForm();
	const contextValue = useContext(ProfileContext);
	const { profile } = contextValue;

	useEffect(() => {
		const { setCurrentProfileInstance } = contextValue;
		setCurrentProfileInstance(formInstance);
		console.log('demographics:', demographics);
		console.log('profile:', profile);
		console.log('formInstance', formInstance.getFieldValue('share'));
	}, []);

	return (
		<>
			<div>
				<Title level={4}>Demographic Information</Title>
				{profile.demographics ? (
					<Paragraph>
						You have no demographic details saved in your profile. Entering your
						details takes a few minutes and helps improve the federal hiring
						process. We never use your details in hiring decisions or send
						individual details to hiring managers.
					</Paragraph>
				) : (
					<></>
				)}
				<Title level={5}>Your privacy is protected.</Title>
				<Paragraph>
					We use demographics to find out if our recruitment efforts are
					reaching all segments of the population, consistent with federal equal
					employment opportunity laws. We do not provide demographic data to any
					hiring officials, anyone involved in the hiring process or the public.
					Review our {/*content to open in new window*/} privacy policy and the{' '}
					{/* also opens link in new window */} Paperwork Reduction Act for more
					information.
				</Paragraph>
				<Form
					form={formInstance}
					initialValues={profile.demographics}
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
									<Radio value={1}>
										I want to share my demographic details and help improve the
										hiring process.
									</Radio>
									<Radio value={0}>
										I do not want to answer the demographic questions.
									</Radio>
								</Space>
							</Radio.Group>
						</Form.Item>
						{formInstance.getFieldValue('share') == 1 ? (
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
											<Radio value={1}>Hispanic or Latino</Radio>
											<Radio value={0}>Not Hispanic or Latino</Radio>
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
								<Form.Item name='disability' label='Disability/Serious Health Condition'>
									<Checkbox.Group>
										<Space direction='vertical'>
											<Checkbox value='Deaf'>Deaf or serious difficulty hearing</Checkbox>
											<Checkbox value='Blind'>Blind or serious difficulty seeing even when wearing glasses</Checkbox>
											<Checkbox value='Amputee'>Missing an arm, leg, hand or foot</Checkbox>
											<Checkbox value='Paralysis'>Paralysis: partial or complete paralysis (any cause)</Checkbox>
											<Checkbox value='Disfigurement'>Significant disfigurement: for example, severe disfigurements caused by burns, wounds, accidents or congenital disorders</Checkbox>
											<Checkbox value='Mobility Impairment'>Significant mobility impairment: for example, uses a wheelchair, scooter, walker or uses a leg brace to walk</Checkbox>
											<Checkbox value='Psychiatric Disorder'>Significant psychiatric disorder: for example, bipolar disorder, schizophrenia, PTSD or major depression</Checkbox>
											<Checkbox value='Intellectual Disability'>Intellectual disability (formerly described as mental retardation)</Checkbox>
											<Checkbox value='Developmental Disability'>Developmental disability: for example, cerebral palsy or autism spectrum disorder</Checkbox>
											<Checkbox value='Brain Injury'>Traumatic brain injury</Checkbox>
											<Checkbox value='Dwarfism'>Dwarfism</Checkbox>
											<Checkbox value='Epilepsy'>Epilepsy or other seizure disorder</Checkbox>
											<Checkbox value='Other Disability'>Other disability or serious health condition: for example, diabetes, cancer, cardiovascular disease, anxiety disorder or HIV infection; a learning disability, a speech impairment or a hearing impairment</Checkbox>
											<Checkbox value='None'>None of the conditions listed above apply to me.</Checkbox>
											<Checkbox value='Do Not Wish to Answer'>I do not wish to answer questions regarding my disability/health conditions.</Checkbox>
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

export default DemographicsForm;
