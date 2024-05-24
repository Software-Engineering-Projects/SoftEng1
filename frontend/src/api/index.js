// NOTE: Here is where all the api endpoints will be exported so that they can be found in one place

// User API Endpoints

export { getUserList, getUserCount, getUserRole, getUserById, deleteUserById } from "./user.js";

// TODO: Product API Endpoints
export { addNewProduct, getAllProducts } from "./product.js";

// Report API Endpoints
export { getOrderStatus } from "./reports.js"

// // TODO: Order API Endpoints
export { getAllOrders, getOrderById, createOrder, updateOrderStatus, viewCustomerOrders } from "./order.js"

// NOTE: These are commented out because they are not yet implemented to avoid runtime error
// // TODO: Order API Endpoints
// export { addNewOrder, getAllOrders } from "./order.js";

// // TODO: Transaction API Endpoints
// export { addNewTransaction, getAllTransactions } from "./transaction.js";

// // TODO: Cart API Endpoints
// export { addNewCart, getAllCarts } from "./cart.js";

// // TODO: Checkout API Endpoints
// export { addNewCheckout, getAllCheckouts } from "./checkout.js";

// // TODO: Payment API Endpoints
// export { addNewPayment, getAllPayments } from "./payment.js";

// // TODO: Receipt API Endpoints
// export { addNewReceipt, getAllReceipts } from "./receipt.js";




