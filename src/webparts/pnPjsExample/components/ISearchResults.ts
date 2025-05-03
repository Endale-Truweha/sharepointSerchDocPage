export interface ISearchResult {
    id: string;
    title: string;
    url: string;
    description: string;
    lastUpdated?: string;
    iconUrl?: string;
  }
  
  export interface ISearchResultsProps {
    results: ISearchResult[];
    query: string;
    isLoading?: boolean;
    totalResults?: number;
    searchTime?: number;
    onResultClick?: (result: ISearchResult) => void;
  }