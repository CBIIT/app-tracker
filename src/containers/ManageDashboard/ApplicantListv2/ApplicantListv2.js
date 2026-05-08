import { useEffect, useState, useContext } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { useSplitApplicantTables } from './hooks/useSplitApplicantTables';
// import { useNonSplitApplicantTables } from './hooks/useNonSplitApplicants'; This hook may not be needed; not written yet
// import { isSplitTableMode } from './utils/ApplicantFilters'; This has not been written yet. exists inside useSplitApplicantTables hook
import ReferenceModal from './modals/ReferenceModal';
import RejectionEmailModal from './modals/RejectionEmailModal';
import SearchContext from '../Util/SearchContext';

const ApplicantListv2 = (props) => {
    const { sysId } = useParams();
}

export default ApplicantListv2;