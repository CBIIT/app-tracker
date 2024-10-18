import axios from 'axios';
import { CHECK_HAS_PROFILE, GET_PROFILE } from '../../constants/ApiEndpoints';
import { convertDataFromBackend } from './Util/ConvertDataFromBackend';
import { message } from 'antd';

export const getProfileInfo = async (sysId, setIsLoading, setProfile, setHasProfile) => {
    try {
        setIsLoading(true)
        const response = await axios.get(CHECK_HAS_PROFILE);
        
        if (response.data.result.exists == true) {
            const profileResponse = await axios.get(GET_PROFILE + sysId);
            setProfile(convertDataFromBackend(profileResponse.data.result.response));
            setHasProfile(true);
        } else {
            setHasProfile(false);
        }
        setIsLoading(false);
    } catch (error) {
        message.error('Sorry! There was an error loading your profile. Try refreshing the browser.', error);
    }      
};