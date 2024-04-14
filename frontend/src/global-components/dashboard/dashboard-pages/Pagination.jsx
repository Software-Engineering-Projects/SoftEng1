import React from "react";
import { NavLink } from "react-router-dom";
export const Pagination = ({
  totalItems,
  activePage,
  onPageChange,
  itemsPerPage,
  data,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const itemsInPages = itemsPerPage * activePage - itemsPerPage + 1;
  const itemsInLastPage = Math.min(itemsInPages + itemsPerPage - 1, totalItems);

  console.log("items in last page", itemsInLastPage);
  console.log("items in page", itemsInPages + itemsPerPage - 1);
  console.log("total items", totalItems);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      const startIndex = (pageNumber - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
      const pageItems = data.slice(startIndex, endIndex);
      onPageChange(pageNumber, pageItems);
    }
  };
  const totalPagesTillOverflow = 5;
  // Added this to handle page overflow
  const getPageRange = () => {
    if (totalPages <= totalPagesTillOverflow) {
      return Array.from({ length: totalPages }, (v, i) => i + 1);
    } else {
      const pageRange = [activePage];
      let pagesBefore = Math.floor((totalPagesTillOverflow - 1) / 2);
      let pagesAfter = Math.floor((totalPagesTillOverflow - 1) / 2);

      console.log("pagesBefore:", pagesBefore);
      console.log("pagesAfter:", pagesAfter);
      while (pageRange.length < totalPagesTillOverflow) {
        if (pageRange[0] > 1) {
          pageRange.unshift(pageRange[0] - 1);
          pagesBefore--;
        }
        if (pageRange[pageRange.length - 1] < totalPages) {
          pageRange.push(pageRange[pageRange.length - 1] + 1);
          pagesAfter--;
        }

        if (pagesBefore === 0 && pagesAfter === 0) {
          break;
        }
      }

      if (pageRange[0] > 1) {
        pageRange[0] = 1;
      }
      if (pageRange[pageRange.length - 1] < totalPages) {
        pageRange[pageRange.length - 1] = totalPages;
      }
      console.log("pageRange:", pageRange);

      return pageRange;
    }
  };

  return (
    <div className="mt-4 flex items-center justify-end">
      {totalItems > 0 && (
        <span className="mr-4 text-gray-600 text-xs">
          Results{" "}
          <span className="font-semibold text-gray-700">{itemsInPages} </span>-{" "}
          <span className="font-semibold text-gray-700">
            {itemsInLastPage}{" "}
          </span>
          of <span className="font-semibold text-red-700">{totalItems}</span>
        </span>
      )}

      <ul className="flex items-center justify-center -space-x-px h-8 text-sm">
        <li>
          <NavLink
            onClick={() => {
              if (activePage > 1) {
                handlePageChange(activePage - 1);
              }
            }}
            className={`flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-700 bg-white border border-gray-300 rounded-l-lg ${activePage === 1
              ? "bg-red-600 dark:text-white"
              : "hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white"
              }
          `}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-2.5 h-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </NavLink>
        </li>
        {getPageRange().map((pageNumber) => (
          <li key={pageNumber}>
            <NavLink
              to={`#page-${pageNumber}`}
              onClick={() => handlePageChange(pageNumber)}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ${pageNumber === activePage
                ? "text-red-700 font-semibold dark:text-white"
                : "hover:text-gray-700 hover:bg-red-300 dark:hover:bg-red-700 dark:hover:text-white"
                }`}
            >
              {pageNumber}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink
            onClick={() => {
              if (activePage < totalPages) {
                handlePageChange(activePage + 1);
              }
            }}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 rounded-r-lg bg-white border border-gray-300 ${activePage === totalPages
              ? "dark:bg-red-800 dark:border-gray-700 dark:text-gray-400"
              : "hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-red-700 dark:hover:text-white"
              }
          `}
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-2.5 h-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
