import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SubmitNewApp from './SubmitNewApp';
import {
    mockSaveAppDraftResponse,
    mockSaveAppDraftFailResponse,
    mockSaveDraftDocResponse,
    mockSaveDraftDocFailResponse,
    mockOptions,
    mockFile,
    mockFileAttachResponse,
    mockAttachmentCheckResponse,
    mockAttachmentCheckFailResponse,
    mockSubmitAppResponse,
    mockSubmitAppFailResponse,
    mockDocumentToDelete,
    mockAttachmentDeleteResponse,
    mockApplicationAttachmentCheckResponse,
    mockApplicationUpdateResponse,
    mockInfoToSend,
    mockFormData,
    mockInfoToSendEdit,
} from '../SubmitModalMockData';

describe('SubmitNewApp component', () => {

    beforeEach(() => {

    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
});