app.get('/customer/:id/orders', async (req, res) => {
    const customerId = req.params.id;
    try {
        const orders = await viewCustomerOrders(customerId);
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send('Error retrieving orders: ' + error.message);
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));