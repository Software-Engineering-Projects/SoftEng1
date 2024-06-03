import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productsMockData } from '@/mock/productsMockData.js';
import { SearchFilter, DataTable, Pagination, AddButton } from '@/global-components/dashboard/dashboard-pages/dashboard-pages-component-index.js';

import { ImageOff } from 'lucide-react';

// FIXME: THIS IS JUST MOCK DATA, TABLE HEADERS ARE NOT FINAL

export const DashboardProducts = () => {
  const dispatch = useDispatch();
  const itemsPerPage = 20;

  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState(1);

  console.log('searchQuery:', searchQuery);
  console.log('activePage:', activePage);

  // TODO: Replace this with actual API call for the products list
  // useEffect(() => {
  //   if (!userList) {
  //     getUserList()
  //       .then((data) => {
  //         dispatch(setUserListDetails(data));
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user list: ", error);
  //       });
  //   }
  // }, [dispatch, userList]);

  const productHeader = [
    { title: 'Product Image' },
    { title: 'Product Name' },
    { title: 'Category' },
    { title: 'Base Price' },
    { title: 'Ingredients' },
    { title: 'Sizes' },
    { title: 'Addons' },
    { title: 'Date Added' },
    { title: 'Published' },
    { title: 'Featured' }
  ];

  // FIXME: The image should be rendering in the data table
  const productsMockDataList = productsMockData
    ? productsMockData.map((product) => ({
      'Product Image': Array.isArray(product.productImage) ? product.productImage.map((src, index) => (
        <div key={index} className="p-7 items-center justify-center flex">
          <img
            src={src}
            alt="Product"
            className="w-full h-56 object-cover transform transition-transform duration-200 hover:scale-105"
            height="200"
            style={{
              aspectRatio: "200/200",
              objectFit: "cover",
            }}
            width="200"
          />
        </div>
      )) : (
        <>
          <div className="px-7 items-center justify-center flex">
            <ImageOff className="w-5 h-5" />
          </div>
          <span className='flex items-center justify-center'>No Image</span>
        </>
      ),
      // TODO: Separate the prices and names, or make them a list
      'Product Name': product.productName || '-',
      'Category': product.category || '-',
      'Base Price': '$' + (product.basePrice || '-'),
      'Ingredients': product.ingredients?.join(', ') || '-',
      'Sizes': product.sizes?.map(size => `${size.name}: $${size.price}`).join(' | ') || '-',
      'Addons': product.addons?.map(addon => `${addon.name}: $${addon.price}`).join(' | ') || (
        <span className="text-red-600">No Addons</span>
      ),
      'Date Added': product.dateAdded || '-',
      'Published': product.isPublished || '-',
      'Featured': product.isFeatured || '-',
    })) : [];


  const [filteredData, setFilteredData] = useState(productsMockDataList);

  console.log('filteredData:', filteredData);
  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    const trimmedQuery = searchQuery.trim().toLowerCase();

    const filteredData = productsMockDataList.filter((item) =>
      productHeader.some((header) => {
        const itemValue = item[header.title];
        if (typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(trimmedQuery);
        } else if (Array.isArray(itemValue)) {
          return itemValue.some(
            (value) =>
              typeof value === 'string' &&
              value.toLowerCase().includes(trimmedQuery),
          );
        } else if (typeof itemValue === 'number') {
          return itemValue.toString().toLowerCase().includes(trimmedQuery);
        } else {
          return false;
        }
      }),
    );

    setFilteredData(filteredData);
    setActivePage(1);
    console.log('trimmedQuery:', trimmedQuery);
    console.log('handleSearch filteredData:', filteredData);
  };

  const totalItems = searchQuery
    ? filteredData.length
    : productsMockDataList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const totalOriginalItems = productsMockDataList.length;
  const totalFilteredItems = filteredData.length;

  const totalPagesOriginal = Math.ceil(totalOriginalItems / itemsPerPage);
  const totalPagesFiltered = Math.ceil(totalFilteredItems / itemsPerPage);

  console.log('totalItems:', totalItems);
  console.log('totalPages:', totalPages);
  console.log('totalOriginalItems:', totalOriginalItems);
  console.log('totalFilteredItems:', totalFilteredItems);
  console.log('totalPagesOriginal:', totalPagesOriginal);
  console.log('totalPagesFiltered:', totalPagesFiltered);

  const handlePageChange = (pageNumber) => {
    // Ensure that pageNumber stays within valid bounds
    if (pageNumber < 1) {
      pageNumber = 1;
    } else {
      const totalPagesToUse = searchQuery
        ? totalPagesFiltered
        : totalPagesOriginal;
      if (pageNumber > totalPagesToUse) {
        pageNumber = totalPagesToUse;
      }
    }

    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    let dataForPage;
    if (searchQuery) {
      dataForPage = filteredData.slice(startIndex, endIndex);
    } else {
      dataForPage = productsMockDataList.slice(startIndex, endIndex);
    }

    setTableData(dataForPage);
    setActivePage(pageNumber);
    console.log('dataForPage:', dataForPage);
    console.log('pageNumber:', pageNumber);
  };

  // Calculate the start and end indices for the current page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items to display for the current page
  const currentItems = searchQuery
    ? filteredData.slice(startIndex, endIndex)
    : productsMockDataList.slice(startIndex, endIndex);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between pb-4 bg-white dark:bg-gray-900 pt-4">
        <AddButton message="Product" path="/dashboard/products/add" />

        {productsMockData && (
          <SearchFilter searchQuery={searchQuery} onSearch={handleSearch} />
        )}
      </div>

      <DataTable
        header={productHeader}
        data={currentItems}
        activePage={activePage}
        itemsPerPage={itemsPerPage}
      />

      {filteredData.length === 0 && searchQuery && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
          No results found
        </div>
      )}

      <Pagination
        totalItems={totalItems}
        activePage={activePage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        data={searchQuery ? filteredData : productsMockDataList}
      />
    </div>
  );
};
