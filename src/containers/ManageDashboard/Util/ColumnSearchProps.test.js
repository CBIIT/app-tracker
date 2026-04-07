import { getColumnSearchProps } from './ColumnSearchProps';
import { MANAGE_APPLICATION } from '../../../constants/Routes';

describe('ColumnSearchProps', () => {
    const buildDropdownHarness = (options = {}) => {
        const {
            dataIndex = 'status',
            keyLabel = 'Status',
            searchText = 'alpha',
            searchedColumn = 'status',
            selectedKeys = ['john'],
            searchInput = { current: { select: jest.fn() } },
        } = options;

        const clearFilters = Object.prototype.hasOwnProperty.call(
            options,
            'clearFilters'
        )
            ? options.clearFilters
            : jest.fn();

        const setSearchText = jest.fn();
        const setSearchedColumn = jest.fn();
        const setSelectedKeys = jest.fn();
        const confirm = jest.fn();
        const close = jest.fn();

        const columnProps = getColumnSearchProps(
            dataIndex,
            keyLabel,
            searchText,
            setSearchText,
            searchedColumn,
            setSearchedColumn,
            searchInput
        );

        const dropdown = columnProps.filterDropdown({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        });

        const dropdownChildren = Array.isArray(dropdown.props.children)
            ? dropdown.props.children
            : [dropdown.props.children];

        const input = dropdownChildren[0];
        const space = dropdownChildren[1];

        const buttons = Array.isArray(space.props.children)
            ? space.props.children
            : [space.props.children];

        const hasMatchingLabel = (children, label) => {
            if (typeof children === 'string') {
                return children === label;
            }

            if (Array.isArray(children)) {
                return children.some((child) => {
                    return child === label;
                });
            }

            return false;
        };

        const findButton = (label) => {
            return buttons.find((btn) => {
                return hasMatchingLabel(btn.props.children, label);
            });
        };

        return {
            columnProps,
            dropdown,
            input,
            searchButton: findButton('Search'),
            resetButton: findButton('Reset'),
            filterButton: findButton('Filter'),
            closeButton: findButton('Close'),
            mocks: {
                setSearchText,
                setSearchedColumn,
                setSelectedKeys,
                confirm,
                close,
                clearFilters,
                searchInput,
            },
        };
    };

    it('builds dropdown with expected container and input placeholder', () => {
        const { dropdown, input } = buildDropdownHarness({ keyLabel: 'Applicant' });

        const stopPropagation = jest.fn();

        dropdown.props.onKeyDown({ stopPropagation });

        expect(stopPropagation).toHaveBeenCalledTimes(1);
        expect(input.props.placeholder).toBe('Search Applicant');
    });

    it('updates selected keys from input change', () => {
        const { input, mocks } = buildDropdownHarness();

        input.props.onChange({ target: { value: 'new value' } });
        expect(mocks.setSelectedKeys).toHaveBeenCalledWith(['new value']);

        input.props.onChange({ target: { value: '' } });
        expect(mocks.setSelectedKeys).toHaveBeenCalledWith([]);
    });

    it('executes search on Enter key press', () => {
        const { input, mocks } = buildDropdownHarness({
            dataIndex: 'status',
            selectedKeys: ['pending'],
        });

        input.props.onPressEnter();

        expect(mocks.confirm).toHaveBeenCalledTimes(1);
        expect(mocks.setSearchText).toHaveBeenCalledWith('pending');
        expect(mocks.setSearchedColumn).toHaveBeenCalledWith('status');
    });

    it('executes search from Search button', () => {
        const { searchButton, mocks } = buildDropdownHarness({
            dataIndex: 'department',
            selectedKeys: ['engineering'],
        });

        searchButton.props.onClick();

        expect(mocks.confirm).toHaveBeenCalledTimes(1);
        expect(mocks.setSearchText).toHaveBeenCalledWith('engineering');
        expect(mocks.setSearchedColumn).toHaveBeenCalledWith('department');
    });

    it('resets filters from Reset button when clearFilters exists', () => {
        const { resetButton, mocks } = buildDropdownHarness();

        resetButton.props.onClick();

        expect(mocks.clearFilters).toHaveBeenCalledTimes(1);
        expect(mocks.setSearchText).toHaveBeenCalledWith('');
        expect(mocks.setSearchedColumn).toHaveBeenCalledWith('');
    });

    it('does nothing on Reset button when clearFilters is missing', () => {
        const { resetButton, mocks } = buildDropdownHarness({
            clearFilters: null,
        });

        resetButton.props.onClick();

        expect(mocks.setSearchText).not.toHaveBeenCalled();
        expect(mocks.setSearchedColumn).not.toHaveBeenCalled();
    });

    it('applies non-closing filter from Filter button', () => {
        const { filterButton, mocks } = buildDropdownHarness({
            dataIndex: 'city',
            selectedKeys: ['london'],
        });

        filterButton.props.onClick();

        expect(mocks.confirm).toHaveBeenCalledWith({ closeDropdown: false });
        expect(mocks.setSearchText).toHaveBeenCalledWith('london');
        expect(mocks.setSearchedColumn).toHaveBeenCalledWith('city');
    });

    it('closes dropdown from Close button', () => {
        const { closeButton, mocks } = buildDropdownHarness();

        closeButton.props.onClick();

        expect(mocks.close).toHaveBeenCalledTimes(1);
    });

    it('renders filter icon with expected color based on filtered flag', () => {
        const { columnProps } = buildDropdownHarness();

        const filteredIcon = columnProps.filterIcon(true);
        const unfilteredIcon = columnProps.filterIcon(false);

        expect(filteredIcon.props.style.color).toBe('#1677ff');
        expect(unfilteredIcon.props.style.color).toBeUndefined();
    });

    it('focuses input on open change when visible is true', () => {
        jest.useFakeTimers();

        const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
        const { columnProps, mocks } = buildDropdownHarness();

        columnProps.onFilterDropdownOpenChange(true);

        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);

        jest.runAllTimers();

        expect(mocks.searchInput.current.select).toHaveBeenCalledTimes(1);

        setTimeoutSpy.mockRestore();
        jest.useRealTimers();
    });

    it('does not schedule focus when open change visible is false', () => {
        const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
        const { columnProps } = buildDropdownHarness();

        columnProps.onFilterDropdownOpenChange(false);

        expect(setTimeoutSpy).not.toHaveBeenCalled();

        setTimeoutSpy.mockRestore();
    });

    it('renders applicant_name as link with highlighted text when searched column matches', () => {
        const props = getColumnSearchProps(
            'applicant_name',
            'Applicant',
            'jo',
            jest.fn(),
            'applicant_name',
            jest.fn(),
            { current: { select: jest.fn() } }
        );

        const element = props.render('John Doe', { sys_id: '42' });

        expect(element.props.to).toBe(MANAGE_APPLICATION + '42');
        expect(element.props.children.props.searchWords).toEqual(['jo']);
        expect(element.props.children.props.textToHighlight).toBe('John Doe');
    });

    it('renders applicant_name as plain link text when searched column does not match', () => {
        const props = getColumnSearchProps(
            'applicant_name',
            'Applicant',
            'jo',
            jest.fn(),
            'status',
            jest.fn(),
            { current: { select: jest.fn() } }
        );

        const element = props.render('John Doe', { sys_id: '43' });

        expect(element.props.to).toBe(MANAGE_APPLICATION + '43');
        expect(element.props.children).toBe('John Doe');
    });

    it('renders non-applicant column with highlighter when searched column matches', () => {
        const props = getColumnSearchProps(
            'status',
            'Status',
            'pen',
            jest.fn(),
            'status',
            jest.fn(),
            { current: { select: jest.fn() } }
        );

        const highlighted = props.render('Pending', {});
        const highlightedNull = props.render(null, {});

        expect(highlighted.props.searchWords).toEqual(['pen']);
        expect(highlighted.props.textToHighlight).toBe('Pending');
        expect(highlightedNull.props.textToHighlight).toBe('');
    });

    it('renders non-applicant column as raw text when searched column does not match', () => {
        const props = getColumnSearchProps(
            'status',
            'Status',
            'pen',
            jest.fn(),
            'department',
            jest.fn(),
            { current: { select: jest.fn() } }
        );

        expect(props.render('Pending', {})).toBe('Pending');
    });
});