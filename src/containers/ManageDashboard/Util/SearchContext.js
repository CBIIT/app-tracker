import { createContext, useRef } from 'react';

export const initalValue = ''

const SearchContext = createContext({
    searchText: null,
    setSearchText: () => {},
    searchedColumn: null,
    setSearchedColumn: () => {},
    //searchInput: useRef(null)
});

export default SearchContext;