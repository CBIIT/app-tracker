import { Form, Input, Button, Collapse, Col } from 'antd';
import './ApplicantReferences.css';

const { Panel } = Collapse;

const applicantReferences = (props) => {
	return (
		<>
			<div className='form-container'>
				<div className='collapse-div'>
					<Form>
						<Collapse accordion='true' defaultActiveKey={['1']}>
							<Form.List name={props.name}>
								{(fields, { add, remove }) => {
									debugger;
									return (
										<div>
											{fields.map((field, index) => (
												<div key={field.key}>
													<Panel header={'Referece' + { index }}>
														<div className='names'>
															<Form.Item
																name={['user', 'name', 'first']}
																label='First Name'
																rules={[
																	{
																		required: true,
																		message: 'Please enter first name',
																	},
																]}
															>
																<Input placeholder='Please Enter' />
															</Form.Item>
															<Form.Item
																name={['user', 'name', 'middle']}
																label='Middle Name'
															>
																<Input placeholder='Please Enter' />
															</Form.Item>
															<Form.Item
																name={['user', 'name', 'last']}
																label='Last Name'
																rules={[
																	{
																		required: true,
																		message: 'Please enter last name',
																	},
																]}
															>
																<Input placeholder='Please Enter' />
															</Form.Item>
														</div>
														<div className='emailPhoneDiv'>
															<Form.Item
																name={['user', 'email']}
																label='Email Address'
																rules={[
																	{
																		type: 'email',
																		required: true,
																		message:
																			'Please enter a valid email address',
																	},
																]}
															>
																<Input
																	type='email'
																	placeholder='Please Enter'
																/>
															</Form.Item>
															<Form.Item
																name={['user', 'phone-number']}
																label='Phone Number'
																rules={[
																	{
																		required: true,
																		message:
																			'Please enter a valid phone number',
																	},
																]}
															>
																<Input
																	type='tel'
																	placeholder='(123) 456-7890'
																/>
															</Form.Item>
														</div>
													</Panel>
												</div>
											))}
										</div>
									);
								}}
							</Form.List>
							{/* <Panel header='Reference 1' key='1'>
							<Form
								layout='vertical'
								name='References'
								className='referencesForm'
							>
								<div className='names'>
									<Form.Item
										name={['user', 'name', 'first']}
										label='First Name'
										rules={[
											{
												required: true,
												message: 'Please enter first name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'middle']}
										label='Middle Name'
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'last']}
										label='Last Name'
										rules={[
											{
												required: true,
												message: 'Please enter last name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
								</div>
								<div className='emailPhoneDiv'>
									<Form.Item
										name={['user', 'email']}
										label='Email Address'
										rules={[
											{
												type: 'email',
												required: true,
												message: 'Please enter a valid email address',
											},
										]}
									>
										<Input type='email' placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'phone-number']}
										label='Phone Number'
										rules={[
											{
												required: true,
												message: 'Please enter a valid phone number',
											},
										]}
									>
										<Input type='tel' placeholder='(123) 456-7890' />
									</Form.Item>
								</div>
							</Form>
						</Panel> */}
							{/* <Panel header='Reference 2' key='2'>
							<Form
								layout='vertical'
								name='References'
								className='referencesForm'
							>
								<div className='names'>
									<Form.Item
										name={['user', 'name', 'first']}
										label='First Name'
										rules={[
											{
												required: true,
												message: 'Please enter first name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'middle']}
										label='Middle Name'
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'last']}
										label='Last Name'
										rules={[
											{
												required: true,
												message: 'Please enter last name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
								</div>
								<div className='emailPhoneDiv'>
									<Form.Item
										name={['user', 'email']}
										label='Email Address'
										rules={[
											{
												type: 'email',
												required: true,
												message: 'Please enter a valid email address',
											},
										]}
									>
										<Input type='email' placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'phone-number']}
										label='Phone Number'
										rules={[
											{
												required: true,
												message: 'Please enter a valid phone number',
											},
										]}
									>
										<Input type='tel' placeholder='(123) 456-7890' />
									</Form.Item>
								</div>
							</Form>
						</Panel>
						<Panel header='Reference 3' key='3'>
							<Form
								layout='vertical'
								name='References'
								className='referencesForm'
							>
								<div className='names'>
									<Form.Item
										name={['user', 'name', 'first']}
										label='First Name'
										rules={[
											{
												required: true,
												message: 'Please enter first name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'middle']}
										label='Middle Name'
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'last']}
										label='Last Name'
										rules={[
											{
												required: true,
												message: 'Please enter last name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
								</div>
								<div className='emailPhoneDiv'>
									<Form.Item
										name={['user', 'email']}
										label='Email Address'
										rules={[
											{
												type: 'email',
												required: true,
												message: 'Please enter a valid email address',
											},
										]}
									>
										<Input type='email' placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'phone-number']}
										label='Phone Number'
										rules={[
											{
												required: true,
												message: 'Please enter a valid phone number',
											},
										]}
									>
										<Input type='tel' placeholder='(123) 456-7890' />
									</Form.Item>
								</div>
							</Form>
						</Panel> */}
						</Collapse>
					</Form>
				</div>
			</div>
		</>
	);
};

export default applicantReferences;
