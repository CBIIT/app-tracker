import {
	normalizeCommitteeRole,
	getVacancyLocation,
	getCommitteeMembers,
	getCommitteeMemberName,
	getCommitteeMemberRole,
} from './HiringDashboard';

describe('HiringDashboard widget data helpers', () => {
	test('getVacancyLocation supports flat and nested API shapes', () => {
		expect(getVacancyLocation({ location: ' Bethesda, MD ' })).toBe('Bethesda, MD');
		expect(getVacancyLocation({ basic_info: { location: { value: 'Rockville, MD' } } })).toBe('Rockville, MD');
		expect(getVacancyLocation({})).toBe('Unknown');
	});

	test('getCommitteeMembers supports multiple committee array keys', () => {
		expect(getCommitteeMembers({ committee: [{ id: 1 }] })).toEqual([{ id: 1 }]);
		expect(getCommitteeMembers({ vacancy_committee: [{ id: 2 }] })).toEqual([{ id: 2 }]);
		expect(getCommitteeMembers({ vacancyCommittee: [{ id: 3 }] })).toEqual([{ id: 3 }]);
		expect(getCommitteeMembers({})).toEqual([]);
	});

	test('committee member name and role extraction supports nested objects', () => {
		expect(getCommitteeMemberName({ user_name: 'Jane Doe' })).toBe('Jane Doe');
		expect(getCommitteeMemberName({ user: { label: 'John Smith' } })).toBe('John Smith');
		expect(getCommitteeMemberName({ user: { name: { value: 'Alex Kim' } } })).toBe('Alex Kim');
		expect(getCommitteeMemberName({})).toBe('Unknown');

		expect(getCommitteeMemberRole({ role: 'Chair' })).toBe('Chair');
		expect(getCommitteeMemberRole({ role: { value: 'Executive Secretary' } })).toBe('Executive Secretary');
		expect(getCommitteeMemberRole({ role: { label: 'Member' } })).toBe('Member');
		expect(getCommitteeMemberRole({})).toBe('');
	});

	test('normalizeCommitteeRole maps committee role labels to widget keys', () => {
		expect(normalizeCommitteeRole('Chair')).toBe('chair');
		expect(normalizeCommitteeRole('Executive Secretary')).toBe('execSec');
		expect(normalizeCommitteeRole('Member (non-voting)')).toBe('nonVoting');
		expect(normalizeCommitteeRole('EDI Representative (non-voting)')).toBe('ediRep');
		expect(normalizeCommitteeRole('HR Specialist')).toBe('hrSpecialist');
		expect(normalizeCommitteeRole('Member (read-only)')).toBe('readOnly');
		expect(normalizeCommitteeRole('Member')).toBe('member');
		expect(normalizeCommitteeRole('Unknown Role')).toBeNull();
	});
});
