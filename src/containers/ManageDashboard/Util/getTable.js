import { useEffect, useState, useContext } from 'react';
import { COMMITTEE_CHAIR, COMMITTEE_MEMBER_NON_VOTING, COMMITTEE_MEMBER_VOTING, OWM_TEAM } from "../../../constants/Roles";
import { TRIAGE, SCORING, IN_REVIEW, REVIEW_COMPLETE, COMPLETED } from "../../../constants/ApplicationStates";
import { GET_ROLLING_APPLICANT_LIST } from '../../../constants/ApiEndpoints';

// ROLLING CLOSE GETTABLE 
export const getTable = (filter, userRoles, userCommitteeRole, applicantColumns, committeeColumns) => {
        // set table to table for rolling close?
        // IF user is a vacancy manager
        if (userRoles.includes(OWM_TEAM)) {
            switch (filter) {
                case SCORING:
                case IN_REVIEW:
                case COMPLETED:
                default:
                    return table
            }
        } else if (userCommitteeRole === COMMITTEE_CHAIR) {
            switch (filter) {
                case SCORING:
                case IN_REVIEW:
                case COMPLETED:
            }
        } else if (userCommitteeRole === COMMITTEE_MEMBER_VOTING || userCommitteeRole === COMMITTEE_MEMBER_NON_VOTING) {

        } else {

        }
            // SWITCH filter
                // CASE scoring
                // CASE in review
                // CASE selected
                // default return table
        // ELSE IF user is committee chair
            // SWITCH filter
                // CASE scoring
                // CASE in review
                // CASE completed
                // default return table
        // ELSE IF user is committee member
            // return committee member applicant list
        // ELSE return table

        // Needed variables:
            // imported roles
            // applicant columns
            // committee columns
            // imported table component
            // applicants
            // tablePagination
            // tableLoading
            // loadAllApplicants function
            // vacancy states
            // recommendedApplicants
            // loadRecommendedApplicants
            // referenceCollection
            // loadVacancyAndApplicants function
};