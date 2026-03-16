import { Button, Input, Space } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { MANAGE_APPLICATION } from '../../../constants/Routes';

const handleSearch = (
	selectedKeys,
	confirm,
	dataIndex,
	setSearchText,
	setSearchedColumn
) => {
	confirm();
	setSearchText(selectedKeys[0]);
	setSearchedColumn(dataIndex);
};

const handleReset = (clearFilters, setSearchText) => {
	clearFilters();
	setSearchText('');
};

export const getColumnSearchProps = (
	dataIndex,
	key,
	searchText,
	setSearchText,
	searchedColumn,
	setSearchedColumn,
	searchInput
) => ({
	filterDropdown: ({
		setSelectedKeys,
		selectedKeys,
		confirm,
		clearFilters,
		close,
	}) => (
		<div
			style={{
				padding: 8,
			}}
			onKeyDown={(e) => e.stopPropagation()}
		>
			<Input
				ref={searchInput}
				placeholder={`Search ${key}`}
				value={selectedKeys[0]}
				onChange={(e) =>
					setSelectedKeys(e.target.value ? [e.target.value] : [])
				}
				onPressEnter={() =>
					handleSearch(
						selectedKeys,
						confirm,
						dataIndex,
						setSearchText,
						setSearchedColumn
					)
				}
				style={{
					marginBottom: 8,
					display: 'block',
				}}
			/>
			<Space>
				<Button
					type='primary'
					onClick={() =>
						handleSearch(
							selectedKeys,
							confirm,
							dataIndex,
							setSearchText,
							setSearchedColumn
						)
					}
					icon={<SearchOutlined />}
					size='small'
					style={{
						width: 90,
					}}
				>
					Search
				</Button>
				<Button
					onClick={() =>
						clearFilters && handleReset(clearFilters, setSearchText)
					}
					size='small'
					style={{
						width: 90,
					}}
				>
					Reset
				</Button>
				<Button
					type='link'
					size='small'
					onClick={() => {
						confirm({
							closeDropdown: false,
						});
						setSearchText(selectedKeys[0]);
						setSearchedColumn(dataIndex);
					}}
				>
					Filter
				</Button>
				<Button
					type='link'
					size='small'
					onClick={() => {
						close();
					}}
				>
					Close
				</Button>
			</Space>
		</div>
	),
	filterIcon: (filtered) => (
		<SearchOutlined
			style={{
				color: filtered ? '#1677ff' : undefined,
			}}
		/>
	),
	onFilter: (value, record) =>
		record[dataIndex].toLowerCase().includes(value.toLowerCase()),
	onFilterDropdownOpenChange: (visible) => {
		if (visible) {
			setTimeout(() => searchInput.current?.select(), 100);
		}
	},
	render: (text, record) => {
		if (dataIndex === 'applicant_name') {
			return searchedColumn === dataIndex ? (
				<Link to={MANAGE_APPLICATION + record.sys_id}>
					<Highlighter
						highlightStyle={{
							backgroundColor: '#FFFF00',
							padding: 0,
						}}
						searchWords={[searchText]}
						autoEscape
						textToHighlight={text ? text.toString() : ''}
					/>
				</Link>
			) : (
				<Link to={MANAGE_APPLICATION + record.sys_id}>{text}</Link>
			);
		} else {
			return searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{
						backgroundColor: '#FFFF00',
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			);
		}
	},
});
