const getIndividualScoringColumns = ({
	roleCaps,
	tenantCaps,
	handlers,
	searchProps,
}) => {
	const cols = [
		{
			title: 'Applicant',
			dataIndex: 'applicant_name',
			key: 'name',
			width: 250,
			...searchProps('applicant_name', 'name'),
		},
		{
			title: 'Email',
			dataIndex: 'applicant_email',
			key: 'email',
			width: 250,
			...searchProps('applicant_email', 'email'),
		},
	];

	if (tenantCaps.showTop25) {
		cols.unshift({
			title: 'Top 25',
			dataIndex: 'top_25',
			align: 'center',
			// render? may move to different file and import. Reference IndividualScoringTable line 238
		});
	}

	if (tenantCaps.showFocusArea) {
		cols.push({
			title: 'Focus Area',
			dataIndex: 'focus_area',
			// render? May move to different file and import. Reference IndividualScoringTable line 261
			// filters
			// filteredValue
			width: 250,
		});
	}

	if (tenantCaps.disableTop25) {
		cols.push({
			title: 'Average Score',
			dataIndex: 'average_member_score',
			width: 50,
			// render? May move to different file and import. Reference IndividualScoringTable line 281
			// sorter
		});
	}

	if (roleCaps.isVacancyManager) {
		// Collect References button
		if (tenantCaps.canCollectReferences) {
			cols.push({
			title: '',
			align: 'center',
			width: 200,
			// render? May move to different file and import. Reference IndividualScoringTable line 451
		});
		}

		// Send Regret Email Button
		if (tenantCaps.disableTop25) {
			cols.push({
				title: '',
				align: 'center',
				width: 200,
				// render? May move to different file and import. Reference IndividualScoringTable line 472
			});
		}

		cols.push({
			title: 'Reference Status',
			dataIndex: 'total_received_references',
			key: 'totalReceivedReferences',
			align: 'center',
			// render? May move to different file and import. Reference IndividualScoringTable line 495
		});
	}
};

export default getIndividualScoringColumns;
