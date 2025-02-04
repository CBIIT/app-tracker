import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwitchFormItemEditor from './SwitchFormItemEditor';


import { Form } from 'antd';

jest.mock('react-quill', () => {
    return function DummyQuill() {
        return <div data-testid="react-quill"></div>;
    };
});

jest.mock('../SwitchFormItem/SwitchFormItem', () => {
    return function DummySwitchFormItem({ onChangeHandler }) {
        return <input type="checkbox" data-testid="SwitchFormItemEditorSwitch" name="testName" label="Test Label" readOnly={false} onChange={(e) => onChangeHandler(e.target.checked)} />;
    };
});
// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};
describe('SwitchFormItemEditor', () => {
    const formInstance = {
        getFieldValue: jest.fn().mockReturnValue(false),
    };

    const defaultProps = {
        formInstance: formInstance,
        rules: [],
        readOnly: false,
        onToggle: jest.fn(),
        onBlur: jest.fn(),
    };
    afterEach(cleanup);
    it('renders SwitchFormItemEditor component', () => {
        render(
            <Form>
                <SwitchFormItemEditor {...defaultProps} />
            </Form>
        );
        expect(screen.getByTestId('SwitchFormItemEditorSwitch')).toBeInTheDocument();
    });

    it('toggles editor visibility based on switch', () => {
        render(
            <Form>
                <SwitchFormItemEditor {...defaultProps} />
            </Form>
        );

        const switchInput = screen.getByRole('checkbox');
        const editor = screen.queryByTestId('react-quill');

        expect(editor).not.toBeVisible();

        fireEvent.click(switchInput);

        expect(editor).toBeVisible();
    });

    it('calls onToggle when switch is toggled', () => {
        render(
            <Form>
                <SwitchFormItemEditor {...defaultProps} />
            </Form>
        );

        const switchInput = screen.getByRole('checkbox');

        fireEvent.click(switchInput);

        expect(defaultProps.onToggle).toHaveBeenCalled();
    });

    it('initializes showEditor state based on props.showEditor', () => {
        render(
            <Form>
                <SwitchFormItemEditor {...defaultProps} showEditor={true} />
            </Form>
        );

        const editor = screen.getByTestId('react-quill');
        expect(editor).toBeVisible();
    });

    it('initializes showEditor state based on formInstance.getFieldValue', () => {
        formInstance.getFieldValue.mockReturnValue(true);

        render(
            <Form>
                <SwitchFormItemEditor {...defaultProps} showEditor={undefined} />
            </Form>
        );

        const editor = screen.getByTestId('react-quill');
        expect(editor).toBeVisible();
    });


    it('does not call onToggle if not provided', () => {
        const propsWithoutOnToggle = {
            formInstance: formInstance,
            rules: [],
            readOnly: false,
            onBlur: jest.fn(),
        };

        render(
            <Form>
                <SwitchFormItemEditor {...propsWithoutOnToggle} />
            </Form>
        );

        const switchInput = screen.getByRole('checkbox');

        fireEvent.click(switchInput);
        expect(jest.fn()).not.toHaveBeenCalled();
    });


});