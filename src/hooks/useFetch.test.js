import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { useFetch } from './useFetch';
import { expect } from '@jest/globals';

jest.mock('axios');

describe('useFetch', () => {
    it('should fetch data successfully', async () => {
        const mockData = { result: 'test data' };
        axios.get.mockResolvedValueOnce({ data: mockData });

        const { result, waitForNextUpdate } = renderHook(() => useFetch('test-url'));

        await waitForNextUpdate();

        expect(result.current.data).toEqual('test data');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeUndefined();
    });

    it('should apply transform function if provided', async () => {
        const mockData = { result: 'test data' };
        const transformFunction = jest.fn().mockReturnValue('transformed data');
        axios.get.mockResolvedValueOnce({ data: mockData });

        const { result, waitForNextUpdate } = renderHook(() => useFetch('test-url', transformFunction));

        await waitForNextUpdate();

        expect(result.current.data).toEqual('transformed data');
        expect(transformFunction).toHaveBeenCalledWith('test data');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeUndefined();
    });

    it('should handle error', async () => {
        const mockError = new Error('Network error');
        axios.get.mockRejectedValueOnce(mockError);

        const { result, waitForNextUpdate } = renderHook(() => useFetch('test-url'));

        await waitForNextUpdate();

        expect(result.current.error).toEqual(mockError);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBeUndefined();
    });

    it('should set loading state correctly', async () => {
        const mockData = { result: 'test data' };
        axios.get.mockResolvedValueOnce({ data: mockData });

        const { result, waitForNextUpdate } = renderHook(() => useFetch('test-url'));

        expect(result.current.isLoading).toBe(true);

        await waitForNextUpdate();

        expect(result.current.isLoading).toBe(false);
    });
});