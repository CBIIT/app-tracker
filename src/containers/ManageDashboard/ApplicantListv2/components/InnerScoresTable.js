import { useEffect, useMemo, useState } from 'react';
import { Table, Tooltip, message } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import axios from 'axios';
import { SCORES } from '../../../../constants/ApiEndpoints';

const pageSizeOptions = [5, 10, 20];

const InnerScoresTable = ({ applicationSysId }) => {
	const [scores, setScores] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const [loading, setLoading] = useState(false);
	const [numOfCategories, setNumOfCategories] = useState(0);

	useEffect(() => {
		const loadScores = async () => {
			setLoading(true);

			try {
				const response = await axios.get(
					`${SCORES}${applicationSysId}?offset=${page}&limit=${pageSize}`
				);
				setScores(response?.data?.result?.scores || []);
				setTotalCount(response?.data?.result?.totalCount || 0);
				setNumOfCategories(response?.data?.result?.numOfCategories || 0);
			} catch (_error) {
				message.error('Sorry! Something went wrong when loading.');
			} finally {
				setLoading(false);
			}
		};

		loadScores();
	}, [applicationSysId, page, pageSize]);

	const columns = useMemo(() => {
		const baseColumns = [
			{
				title: 'Committee Member',
				dataIndex: 'name',
				key: 'name',
			},
			{ title: 'Raw Score', dataIndex: 'raw_score', key: 'raw_score' },
			{ title: 'Avg Score', dataIndex: 'average_score', key: 'average_score' },
		];

		const dynamicCategoryColumns = Array.from(
			{ length: Number(numOfCategories) || 0 },
			(_value, index) => {
				const categoryNumber = index + 1;
				return {
					title: `Category ${categoryNumber}`,
					dataIndex: `category_${categoryNumber}`,
					key: `category_${categoryNumber}`,
				};
			}
		);

		return [
			...baseColumns,
			...dynamicCategoryColumns,
			{ title: 'Recommend?', dataIndex: 'recommend', key: 'recommend' },
			{
				title: 'Comments',
				dataIndex: 'comments',
				key: 'comments',
				render: (comment) => (
					<Tooltip title={comment} trigger='click'>
						<CommentOutlined />
					</Tooltip>
				),
			},
		];
	}, [numOfCategories]);

	return (
		<Table
			rowKey='sys_id'
			columns={columns}
			scroll={{ x: true }}
			dataSource={scores}
			loading={loading}
			pagination={{
				pageSizeOptions,
				pageSize,
				total: totalCount,
				hideOnSinglePage: true,
				onChange: (nextPage, nextPageSize) => {
					setPage(nextPage);
					setPageSize(nextPageSize);
				},
			}}
		/>
	);
};

export default InnerScoresTable;