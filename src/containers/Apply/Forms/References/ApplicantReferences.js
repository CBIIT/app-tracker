import { useContext, useEffect } from 'react';
import FormContext from '../../Context';
import { Form, Input, Button, Collapse, Col } from 'antd';
import './ApplicantReferences.css';

const { Panel } = Collapse;

const references = { references: [{}, {}, {}] };

const applicantReferences = (props) => {
	const [formInstance] = Form.useForm();
	const contextValue = useContext(FormContext);
	const { formData } = contextValue;

	useEffect(() => {
		const { setCurrentFormInstance } = contextValue;
		setCurrentFormInstance(formInstance);
	}, []);
	// const references = props.references
	return (
		<Form
			form={formInstance}
			initialValues={references}
			requiredMark={false}
			layout='vertical'
		>
			<Form.List name='references'>
				{(fields, { add, remove }) => {
					return (
						<>
							<Collapse defaultActiveKey={'0'}>
								{fields.map((field, index) => (
									<>
										<Panel header={'Reference ' + (index + 1)} key={field.key}>
											<div className='names'>
												<Form.Item
													name={[index, 'firstName']}
													label='First Name'
													colon={false}
													labelAlign='left'
													rules={[
														{
															required: true,
															message: 'Please enter first name',
														},
													]}
												>
													<Input placeholder='Please Enter' key={field.key} />
												</Form.Item>
												<Form.Item
													name={[index, 'middleName']}
													label='Middle Name'
													labelAlign='left'
													colon={false}
												>
													<Input placeholder='Please Enter' key={field.key} />
												</Form.Item>
												<Form.Item
													name={[index, 'lastName']}
													label='Last Name'
													labelAlign='left'
													colon={false}
													rules={[
														{
															required: true,
															message: 'Please enter last name',
														},
													]}
												>
													<Input placeholder='Please Enter' key={field.key} />
												</Form.Item>
											</div>
											<div className='emailPhoneDiv'>
												<Form.Item
													name={[index, 'email']}
													label='Email Address'
													labelAlign='left'
													colon={false}
													rules={[
														{
															type: 'email',
															required: true,
															message: 'Please enter a valid email address',
														},
													]}
												>
													<Input
														type='email'
														placeholder='Please Enter'
														key={field.key}
													/>
												</Form.Item>
												<Form.Item
													name={[index, 'phoneNumber']}
													label='Phone Number'
													labelAlign='left'
													colon={false}
													rules={[
														{
															required: true,
															message: 'Please enter a valid phone number',
														},
													]}
												>
													<Input
														type='tel'
														placeholder='(123) 456-7890'
														key={field.key}
													/>
												</Form.Item>
											</div>
										</Panel>

										{/* <Button
												type='primary'
												onClick={() => {
													debugger;
													remove();
												}}
											>
												remove
											</Button> */}
									</>
								))}
							</Collapse>
							<Button
								type='secondary'
								onClick={() => {
									add();
									console.log('clicked');
								}}
							>
								add more
							</Button>
						</>
					);
				}}
			</Form.List>
		</Form>
	);
};

export default applicantReferences;
