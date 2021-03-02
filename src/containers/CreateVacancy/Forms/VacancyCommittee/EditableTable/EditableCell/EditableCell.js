import { Form, Select, Input } from 'antd';
import UserPicker from '../../../../../../components/UI/UserPicker/UserPicker';

const editableCell = ({
	editing,
	dataIndex,
	title,
	inputType,
	children,
	...restProps
}) => {
	const { Option } = Select;
	const getInputNode = (inputType) => {
		switch (inputType) {
			case 'dropdown':
				return (
					<Select>
						<Option value='Chair'>Chair</Option>
						<Option value='Member (voting)'>Member (voting)</Option>
						<Option value='Member (non-voting)'>Member (non-voting)</Option>
						<Option value='HR Specialist'>HR Specialist</Option>
						<Option value='EDI Representative'>EDI Representative</Option>
						<Option value='Executive Secretary'>Executive Secretary</Option>
					</Select>
				);
			case 'name':
				return <Input />;
			case 'typeAhead':
				return <UserPicker />;
			default:
				return <Input />;
		}
	};

	const inputNode = getInputNode(inputType);

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{
						margin: 0,
					}}
					rules={[
						{
							required: true,
							message: `Please select a ${title.toLowerCase()}`,
						},
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				<div
					className='editable-cell-value-wrap'
					style={{
						paddingRight: 24,
					}}
				>
					{children}
				</div>
			)}
		</td>
	);
};

export default editableCell;
