import './EditableReferences.css';
import EditableField from '../../components/UI/EditableField/EditableField'
import EditableRadio from '../../components/UI/EditableRadio/EditableRadio'
import { Button, Menu, Dropdown, Form, Input, Col, Row, Divider } from 'antd';

const editableReferences = (props) => (
	<Form
	name="basic"
	labelCol={{ span: 24 }}
	wrapperCol={{ span: 24 }}
	style={{ maxWidth: 600 }}
	initialValues={{ remember: true }}
	//onFinish={onFinish}
	//onFinishFailed={onFinishFailed}
	autoComplete="off"
	>
		<Row>
			<h2 style={{ marginBottom: '3px' }}>References</h2>
		</Row>
		<Row>
			<Col span={10}>
				<EditableField label="First Name" size="18"/>
			</Col>
			<Col span={4}> </Col>
			<Col span={10}>
				<EditableField label="Last Name" size="18"/>
			</Col>
		</Row>
		<Row>
			<Col span={10}>
				<EditableField label="Email" size="18"/>
			</Col>
			<Col span={4}> </Col>
			<Col span={10}>
				<EditableField label="Phone Number" size="18"/>
			</Col>
		</Row>
		<Row>
			<Col span={10}>
				<EditableField label="Company" size="18"/>
			</Col>
			<Col span={4}> </Col>
			<Col span={10}>
				<EditableField label="Position" size="18"/>
			</Col>
		</Row>
		<Row>
			<EditableRadio label="May we contact this person?" options="Yes,No"/>
		</Row>
		<Divider />
	</Form>
);

export default editableReferences;
