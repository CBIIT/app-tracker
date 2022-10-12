import { useState, useEffect } from 'react';
import { Table, Tooltip, message } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import axios from 'axios';

import { SCORES } from '../../../../../constants/ApiEndpoints';

const innerScoresTable = (props) => {
	const [scores, setScores] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const [tableLoading, setTableLoading] = useState(false);

	const columns = [
		{
			title: 'Committee Member',
			dataIndex: 'name',
			key: 'name',
		},
		{ title: 'Raw Score', dataIndex: 'raw_score', key: 'raw_score' },
		{
			title: 'Avg Score',
			dataIndex: 'average_score',
			key: 'average_score',
		},
		{
			title: 'Category 1',
			dataIndex: 'category_1',
			key: 'category_1',
		},
		{
			title: 'Category 2',
			dataIndex: 'category_2',
			key: 'category_2',
		},
		{
			title: 'Category 3',
			dataIndex: 'category_3',
			key: 'category_3',
		},
		{
			title: 'Category 4',
			dataIndex: 'category_4',
			key: 'category_4',
		},
		{
			title: 'Recommend?',
			dataIndex: 'recommend',
			key: 'recommend',
		},
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

	const loadScores = async (page, pageSize) => {
		setTableLoading(true);
		try {
			const apiString =
				SCORES +
				props.applicationSysId +
				'?offset=' +
				page +
				'&limit=' +
				pageSize;
			const response = await axios.get(apiString);
			setScores(response.data.result.scores);
			setTotalCount(response.data.result.totalCount);
		} catch (error) {
			message.error('Sorry! Something went wrong when loading.');
		}
		setTableLoading(false);
	};

	useEffect(() => {
		loadScores(page, pageSize);
	}, [page, pageSize]);

	const pageSizeOptions = [5, 10, 20];

	const pagination = {
		pageSizeOptions: pageSizeOptions,
		pageSize: pageSize,
		total: totalCount,
		onChange: (page, pageSize) => {
			setPageSize(pageSize);
			setPage(page);
		},
		hideOnSinglePage: true,
	};

	return (
		<Table
			rowKey='sys_id'
			columns={columns}
			scroll={{ x: 'true' }}
			dataSource={scores}
			pagination={pagination}
			loading={tableLoading}
		/>
	);
};

export default innerScoresTable;
