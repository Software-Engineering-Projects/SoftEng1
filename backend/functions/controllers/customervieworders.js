const firestore = admin.firestore();

async function viewCustomerOrders(customerId) {
    const orders = [];
    const snapshot = await firestore.collection('orders').where('customerId', '==', customerId).get();
    
    snapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
    });

    return orders;
}