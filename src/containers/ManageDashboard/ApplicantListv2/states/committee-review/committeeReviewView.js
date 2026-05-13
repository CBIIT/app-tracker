import { useMemo, useCallback, useContext, useEffect, useState } from 'react';
import getCommitteeReviewColumns from './committeeReviewColumns';
import mapCommitteeReviewChange from './mapCommitteeReviewTableChange';
import { Table, Radio, Button, message } from 'antd';
import SearchContext from '../../../Util/SearchContext';
import { getColumnSearchProps } from '../../../Util/ColumnSearchProps';
import { ROLLING_CLOSE } from '../../../../../constants/VacancyStates';
import {
    APP_TRIAGE,
    SCORING,
    IN_REVIEW,
    REVIEW_COMPLETE,
} from '../../../../../constants/ApplicationStates';