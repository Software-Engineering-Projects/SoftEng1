import { SearchIcon } from 'lucide-react';
import React from 'react';
// TODO: Create a search function to search the products in the database by name
// TODO: Create a page to display the search results given the query param of the product name
export const SearchInputMainPage = () => {
  return (
    <form className="flex items-center">
      <label htmlFor="simple-search" className="sr-only">
        Search
      </label>
      <div className="relative ">
        <div className="absolute inset-y-0 left-0 flex flex-col items-center pl-3 pointer-events-none "></div>
        <input
          type="text"
          id="simple-search"
          className="flex bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search menu items..."
          required
        />
      </div>
      <button
        type="submit"
        className="p-2.5 ml-2 text-sm font-medium text-white bg-rose-600 rounded-lg border border-rose-600 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-amber-300 dark:bg-rose-500 dark:hover:bg-rose-600 dark:focus:ring-amber-700"
      >
        <SearchIcon className="w-5 h-5" aria-hidden="true" />
        <span className="sr-only">
          Search
        </span>
      </button>
    </form>
  );
}
