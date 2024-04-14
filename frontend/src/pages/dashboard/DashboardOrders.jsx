import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ordersMockData, } from "../../mock/ordersMockData.js";
import { SearchFilter, DataTable, Pagination, AddButton } from "@/global-components/dashboard/dashboard-pages/dashboard-pages-component-index.js";
import { ImageOff } from "lucide-react";

// FIXME: THIS IS JUST MOCK DATA, TABLE HEADERS ARE NOT FINAL
// TODO: Search not working
export const DashboardOrders = () => {
  const dispatch = useDispatch();
  const itemsPerPage = 20;

  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);

  console.log("searchQuery:", searchQuery);
  console.log("activePage:", activePage);

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

  const orderHeader = [
    { title: "Customer Name" },
    { title: "Order Details" },
    { title: "Delivery Address" },
    { title: "Payment Method" },
    { title: "Payment Status" },
    { title: "Order Status" },
  ];

  const ordersMockDataList = ordersMockData
    ? ordersMockData.map((orders) => ({
      "Customer Name": orders.customerName || "-",

      "Order Details": orders.orderDetails || "-",
      "Delivery Address": orders.deliveryAddress || "-",
      "Payment Method": orders.paymentMethod || "-",
      "Payment Status": orders.paymentStatus || "-",
      "Order Status": orders.orderStatus || "-",
    }))
    : [];

  const [filteredData, setFilteredData] = useState(ordersMockDataList);

  console.log("filteredData:", filteredData);

  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    const trimmedQuery = searchQuery.trim().toLowerCase();

    const filteredData = ordersMockDataList.filter((item) =>
      restaurantHeader.some((header) => {
        const itemValue = item[header.title];
        if (typeof itemValue === "string") {
          return itemValue.toLowerCase().includes(trimmedQuery);
        } else if (Array.isArray(itemValue)) {
          return itemValue.some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(trimmedQuery)
          );
        } else if (typeof itemValue === "number") {
          return itemValue.toString().toLowerCase().includes(trimmedQuery);
        } else {
          return false;
        }
      })
    );

    setFilteredData(filteredData);
    setActivePage(1);
    console.log("trimmedQuery:", trimmedQuery);
    console.log("handleSearch filteredData:", filteredData);
  };

  const totalItems = searchQuery
    ? filteredData.length
    : ordersMockDataList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const totalOriginalItems = ordersMockDataList.length;
  const totalFilteredItems = filteredData.length;

  const totalPagesOriginal = Math.ceil(totalOriginalItems / itemsPerPage);
  const totalPagesFiltered = Math.ceil(totalFilteredItems / itemsPerPage);

  console.log("totalItems:", totalItems);
  console.log("totalPages:", totalPages);
  console.log("totalOriginalItems:", totalOriginalItems);
  console.log("totalFilteredItems:", totalFilteredItems);
  console.log("totalPagesOriginal:", totalPagesOriginal);
  console.log("totalPagesFiltered:", totalPagesFiltered);

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
      dataForPage = ordersMockDataList.slice(startIndex, endIndex);
    }

    setTableData(dataForPage);
    setActivePage(pageNumber);
    console.log("dataForPage:", dataForPage);
    console.log("pageNumber:", pageNumber);
  };

  // Calculate the start and end indices for the current page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items to display for the current page
  const currentItems = searchQuery
    ? filteredData.slice(startIndex, endIndex)
    : ordersMockDataList.slice(startIndex, endIndex);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between pb-4 bg-white dark:bg-gray-900 pt-4">
        <AddButton message="Order" path="/dashboard/orders/add" />

        {ordersMockDataList && (
          <SearchFilter searchQuery={searchQuery} onSearch={handleSearch} />
        )}
      </div>

      <DataTable
        header={orderHeader}
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
        data={searchQuery ? filteredData : ordersMockDataList}
      />
    </div>
  );
};
