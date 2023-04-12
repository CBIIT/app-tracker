import { useContext, useEffect, useState } from 'react';
import { Form, Checkbox, Typography, Radio, Space } from 'antd';
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
const DemographicsForm = ({demographics}) => {
	const [displayQuestions, setDisplayQuestions] = useState(true);
    const [formInstance] = Form.useForm();
    const contextValue = useContext(ProfileContext);
	const { profile } = contextValue;

    useEffect(() => {
        const { setCurrentProfileInstance } = contextValue;
        setCurrentProfileInstance(formInstance);
        console.log('demographics:', demographics)
		console.log('profile:', profile)
		console.log('formInstance', formInstance.getFieldValue('share'))
    }, []);

	return (
		<>
			<div>
				<Title level={4}>Demographic Information</Title>
				{demographics ? (
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
					layout='horizontal'
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
					</div>
				</Form>
			</div>
		</>
	);
};

export default DemographicsForm;