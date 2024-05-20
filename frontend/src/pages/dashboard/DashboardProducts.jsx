import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchFilter, DataTable, Pagination, AddButton } from '@/global-components/dashboard/dashboard-pages/dashboard-pages-component-index.js';
import { ImageOff } from 'lucide-react';
import { getAllProducts, addNewProduct } from '@/api/index.js';

export const DashboardProducts = () => {
  const dispatch = useDispatch();
  const itemsPerPage = 20;

  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setProducts(products);
        setTableData(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [dispatch]);

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

  const productsDataList = products.map((product) => ({
    'Product Image': Array.isArray(product.productImage) ? product.productImage.map((src, index) => (
      <div key={index} className="p-7 items-center justify-center flex">
        <img
          src={src}
          alt="Product"
          className="w-full h-56 object-cover transform transition-transform duration-200 hover:scale-105"
          height="200"
          style={{ aspectRatio: "200/200", objectFit: "cover" }}
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
    'Product Name': product.productName || '-',
    'Category': product.category || '-',
    'Base Price': '$' + (product.basePrice || '-'),
    'Ingredients': product.ingredients?.join(', ') || '-',
    'Sizes': product.sizes?.map(size => `${size.name}: $${size.price}`).join(' | ') || '-',
    'Addons': product.addons?.map(addon => `${addon.name}: $${addon.price}`).join(' | ') || (
      <span className="text-red-600">No Addons</span>
    ),
    'Date Added': product.dateAdded || '-',
    'Published': product.isPublished ? 'Yes' : 'No',
    'Featured': product.isFeatured ? 'Yes' : 'No',
  }));

  const [filteredData, setFilteredData] = useState(productsDataList);

  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    const trimmedQuery = searchQuery.trim().toLowerCase();

    const filteredData = productsDataList.filter((item) =>
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
  };

  const totalItems = searchQuery ? filteredData.length : productsDataList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      pageNumber = 1;
    } else {
      const totalPagesToUse = searchQuery ? totalPages : Math.ceil(productsDataList.length / itemsPerPage);
      if (pageNumber > totalPagesToUse) {
        pageNumber = totalPagesToUse;
      }
    }

    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const dataForPage = searchQuery ? filteredData.slice(startIndex, endIndex) : productsDataList.slice(startIndex, endIndex);

    setTableData(dataForPage);
    setActivePage(pageNumber);
  };

  useEffect(() => {
    handlePageChange(activePage);
  }, [activePage, productsDataList, filteredData, searchQuery]);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between pb-4 bg-white dark:bg-gray-900 pt-4">
        <AddButton message="Product" path="/dashboard/products/add" />

        <SearchFilter searchQuery={searchQuery} onSearch={handleSearch} />
      </div>

      <DataTable
        header={productHeader}
        data={tableData}
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
      />
    </div>
  );
};
