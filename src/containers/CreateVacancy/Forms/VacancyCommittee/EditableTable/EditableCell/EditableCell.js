import { Form, Select, Input } from 'antd';
import UserPicker from '../../../../../../components/UI/UserPicker/UserPicker';
import {
	COMMITTEE_CHAIR,
	COMMITTEE_MEMBER_VOTING,
	COMMITTEE_MEMBER_NON_VOTING,
	COMMITTEE_HR_SPECIALIST,
	COMMITTEE_EDI_REPRESENTATIVE,
	COMMITTEE_EXEC_SEC,
	COMMITTEE_MEMBER_VOTING_READ_ONLY,
} from '../../../../../../constants/Roles';

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
						<Option value={COMMITTEE_CHAIR}>Chair</Option>
						<Option value={COMMITTEE_MEMBER_VOTING}>Member (voting)</Option>
						<Option value={COMMITTEE_MEMBER_NON_VOTING}>
							Member (non-voting)
						</Option>
						<Option value={COMMITTEE_HR_SPECIALIST}>
							HR Specialist (non-voting)
						</Option>
						<Option value={COMMITTEE_EDI_REPRESENTATIVE}>
							EDI Representative (non-voting)
						</Option>
						<Option value={COMMITTEE_EXEC_SEC}>
							Executive Secretary (non-voting)
						</Option>
						<Option value={COMMITTEE_MEMBER_VOTING_READ_ONLY}>
							Member Voting (read-only)
						</Option>
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
