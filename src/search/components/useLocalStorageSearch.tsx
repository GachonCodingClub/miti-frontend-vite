import { useEffect } from "react";
import { IGroup } from "../../model/group";

export const useLocalStorageSearch = (
  searchTerm: string,
  setSearchTerm: React.Dispatch<string>,
  searchResults: IGroup[],
  setSearchResults: React.Dispatch<IGroup[]>,
  SEARCH_TERM_KEY: string,
  SEARCH_RESULTS_KEY: string
) => {
  // localStorage에서 검색어와 검색결과 가져옴
  useEffect(() => {
    const storedSearchTerm = localStorage.getItem(SEARCH_TERM_KEY);
    const storedSearchResults = localStorage.getItem(SEARCH_RESULTS_KEY);

    if (storedSearchTerm) {
      setSearchTerm(storedSearchTerm);
    }

    if (storedSearchResults) {
      setSearchResults(JSON.parse(storedSearchResults));
    }
  }, [setSearchTerm, setSearchResults, SEARCH_TERM_KEY, SEARCH_RESULTS_KEY]);

  // 검색어가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(SEARCH_TERM_KEY, searchTerm);
  }, [SEARCH_TERM_KEY, searchTerm]);

  // 검색 결과가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(SEARCH_RESULTS_KEY, JSON.stringify(searchResults));
  }, [SEARCH_RESULTS_KEY, searchResults]);
};
