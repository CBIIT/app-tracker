import React from 'react';
import './LegalStatement.css';

const legalStatement = () => (
	<div className='LegalStatement'>
		<div className='LegalStatementContent Content'>
			<p>
				Collection of this information is authorized by The Public Health
				Service Act, Section 411 (42 USC 285a). Rights of participants are
				protected by The Privacy Act of 1974 under{' '}
				<a href='http://www.opm.gov/information-management/privacy-policy/sorn/opm-sorn-govt-5-recruiting-examining-and-placement-records.pdf'>
					OPM GOVT-5
				</a>
				. Participation is voluntary, and there are no penalties for not
				participating or withdrawing at any time. Refusal to participate will
				not affect your benefits in any way. The information collected will be
				kept private to the extent provided by law. Names and other identifiers
				will not appear in any report. Information provided will be combined for
				all participants and reported as summaries. You are being contacted
				on-line to complete this instrument so that NCI can evaluate its
				advertisement strategies and make necessary improvements to the
				application website.
			</p>
			<p>
				Public reporting burden for this collection of information is estimated
				to average 30 minutes per response, including the time for reviewing
				instructions, searching existing data sources, gathering and maintaining
				the data needed, and completing and reviewing the collection of
				information.{' '}
				<strong>
					An agency may not conduct or sponsor, and a person is not required to
					respond to, a collection of information unless it displays a currently
					valid OMB control number.
				</strong>{' '}
				Send comments regarding this burden estimate or any other aspect of this
				collection of information, including suggestions for reducing this
				burden to: NIH, Project Clearance Branch, 6705 Rockledge Drive, MSC
				7974, Bethesda, MD 20892-7974, ATTN: PRA (0925-0761). Do not return the
				completed form to this address.
			</p>
		</div>
	</div>
);

export default legalStatement;
