import { useEffect, useState } from 'react';
import { message } from 'antd';
import axios from 'axios';

import {
	GET_APPLICATION_SCORES,
	SUBMIT_INDIVIDUAL_SCORING,
} from '../../../constants/ApiEndpoints';
import ScoringWidget from '../ScoringWidget/ScoringWidget';

const adminScoringWidget = (props) => {
	const [committeeScores, setCommitteeScores] = useState({});
	const [committeeMemberDropdownChoices, setCommitteeMemberDropdownChoices] =
		useState([]);
	const [selectedCommitteeMember, setSelectedCommitteeMember] = useState({
		scores: {},
		comments: '',
		triageChoice: '',
		recused: '',
	});

	useEffect(() => {
		(async () => {
			loadScores();
		})();
	}, [selectedCommitteeMember]);

	const loadScores = async () => {
		const response = await axios.get(
			GET_APPLICATION_SCORES + props.applicationId
		);

		const committeeMembers = response.data.result;

		setCommitteeScores(committeeMembers);
		setCommitteeMemberDropdownChoices(
			committeeMembers.map((member) => member.name)
		);

		if (committeeMembers.length > 0 && !selectedCommitteeMember.sysId)
			changeCommitteeMember(committeeMembers[0]);
	};

	const selectedScoreChangeHandler = (value, category) => {
		const newScores = { ...selectedCommitteeMember.scores, [category]: value };
		const newData = { ...selectedCommitteeMember, scores: newScores };
		setSelectedCommitteeMember(newData);
	};

	const onSelectedScoreCommentsChange = (event) => {
		const newData = {
			...selectedCommitteeMember,
			comments: event.target.value,
		};
		setSelectedCommitteeMember(newData);
	};

	const onTriageSelect = (event) => {
		const newData = {
			...selectedCommitteeMember,
			triageChoice: event.target.value,
		};
		setSelectedCommitteeMember(newData);
	};

	const onSaveClick = async () => {
		try {
			const scoresAndNotes = {
				app_sys_id: props.applicationId,
				score_as: selectedCommitteeMember.sysId,
				recommend: selectedCommitteeMember.triageChoice,
				comments: selectedCommitteeMember.comments,
				category_1: selectedCommitteeMember.scores.category1
					? selectedCommitteeMember.scores.category1
					: 0,
				category_2: selectedCommitteeMember.scores.category2
					? selectedCommitteeMember.scores.category2
					: 0,
				category_3: selectedCommitteeMember.scores.category3
					? selectedCommitteeMember.scores.category3
					: 0,
				category_4: selectedCommitteeMember.scores.category4
					? selectedCommitteeMember.scores.category4
					: 0,
			};

			await axios.post(SUBMIT_INDIVIDUAL_SCORING, scoresAndNotes);
			message.success(
				'Feedback and notes saved for ' + selectedCommitteeMember.name + '.'
			);
		} catch (error) {
			message.error(
				'Sorry!  An error occurred.  Save unsuccessful.  Try reloading the page and trying again.'
			);
		}
	};

	const committeeMemberDropdownOnClick = (value) => {
		const selectedCommitteeMember = committeeScores[value];
		changeCommitteeMember(selectedCommitteeMember);
	};

	const changeCommitteeMember = (committeeMember) => {
		const newSelection = {
			name: committeeMember.name,
			sysId: committeeMember.sys_id,
			scores: {
				category1: committeeMember.category_1,
				category2: committeeMember.category_2,
				category3: committeeMember.category_3,
				category4: committeeMember.category_4,
			},
			comments: committeeMember.comments ? committeeMember.comments : '',
			triageChoice: committeeMember.recommend,
			recused: committeeMember.recused,
		};

		setSelectedCommitteeMember(newSelection);
	};

	return (
		<>
			<ScoringWidget
				title="Committee Members' Rating and Feedback"
				description={
					<>
						Please score the applicant on a scale of 0 - 3 below and leave
						detailed notes in the comments box below.{' '}
						<a href={props.ratingPlanDownloadLink}>See Rating Plan.</a>
					</>
				}
				enableRecuseToggle={true}
				enableCommitteeMemberDropdown={true}
				committeeMemberDropdownChoices={committeeMemberDropdownChoices}
				committeeMemberDropdownOnClick={committeeMemberDropdownOnClick}
				style={props.style}
				scoreChangeHandler={selectedScoreChangeHandler}
				onScoreCommentsChange={onSelectedScoreCommentsChange}
				triageComments={selectedCommitteeMember.comments}
				triageChoice={selectedCommitteeMember.triageChoice}
				recused={selectedCommitteeMember.recused}
				committeeMemberId={selectedCommitteeMember.sysId}
				triageOptions={props.triageOptions}
				categories={props.categories}
				onTriageSelect={onTriageSelect}
				onCancelClick={props.onCancelClick}
				onSaveClick={onSaveClick}
				scores={selectedCommitteeMember.scores}
				initiallyHideContent={props.initiallyHideContent}
				applicationId={props.applicationId}
			/>
		</>
	);
};

export default adminScoringWidget;
