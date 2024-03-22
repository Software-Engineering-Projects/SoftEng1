## Products Collection Schema

#### Check the Schema in the models folder to check out more of the validation rules

```javascript
const schema = {
    "productName": "string",
    "basePrice": "number",
    "sizes": "array" {
      "map": {
        "price": "number",
        "name": "string"
      }
    },
    "addons": "array"{
      "map": {
        "name": "string",
        "price": "number"
      }
    },
    "ingredients": "array" [
        "string"
    ],
    "description": "string",
    "category": "string",
    "imageUrl": "string",
    "isFeatured": "boolean",
    "isPublished": "boolean",
    "nutritionalInfo": "map" {
        "calories": "number",
        "carbohydrates": "number",
        "fat": "number",
        "fiber": "number",
        "protein": "number",
        "sugar": "number"
    },
    "preparationTime": "number"
}
```

## Product Example (Valid Inputs)

```javascript
const data = {
  "productName": "Cheese Pizza",
  "basePrice": 10,
  "sizes": [
    {
      "price": 12,
      "name": "Large"
    },
    {
      "price": 8,
      "name": "Small"
    }
  ],
  "addons": [
    {
      "name": "Extra Cheese",
      "price": 2
    },
    {
      "name": "Olives",
      "price": 1
    }
  ],
  "ingredients": ["Cheese", "Tomato Sauce", "Flour", "Yeast"],
  "productDescription": "A classic cheese pizza with a crispy crust and a rich tomato sauce.",
  "category": "Pizza",
  "imageUrl": "https://example.com/cheese-pizza.jpg",
  "isFeatured": true,
  "isPublished": true,
  "nutritionalInfo": {
    "calories": 300,
    "carbohydrates": 40,
    "fat": 12,
    "fiber": 2,
    "protein": 15,
    "sugar": 5
  },
  "preparationTime": 15
};
```

## Orders Collection Schema

```javascript
const schema = {
    "cartId": "string",
    "checkoutSessionId": : "string",
    "userId": "string",
    "orderDate": "string",
    "status": "string",
    "customerName": "string",
    "customerEmail": "string",
    "shippingAddress": "map" {
        "city": "string",
        "country": "string",
        "line1": "string",
        "line2": "string",
        "postalCode": "string",
        "state": "string"
    },
    "cartId": "string",
    "totalPrice": "number",
}
```

## Order Example (Valid Inputs)
```javascript
const data = {
  "cartId": "c1",
  "checkoutSessionId": "cs1",
  "userId": "u1",
  "orderDate": "2024-02-20T02:33:19.915Z",
  "status": "pending",
  "customerName": "Alice",
  "customerEmail": "alice@example.com",
  "shippingAddress": {
    "city": "Binangonan",
    "country": "Philippines",
    "line1": "123 Main Street",
    "line2": "",
    "postalCode": "1940",
    "state": "Rizal"
  },
  "totalPrice": 35
};
```

## Cart Collection Schema

```javascript
const schema = {
    "cartId": "string",
    "items": "array" {
        {
          "productId": "string",
          "productIdentifier": "string",
          "productQuantity": "number",
          "productPrice": "number",
        }
    },
    "totalPrice": "number",
    "userId": "string"
}
```

## Cart Example (Valid Inputs)

```javascript
const data = {
  "cartId": "c1",
  "items": [
    {
      "productId": "p1",
      "productIdentifier": "large_cheese",
      "productQuantity": 2,
      "productPrice": 10
    },
    {
      "productId": "p2",
      "productIdentifier": "medium_pepperoni",
      "productQuantity": 1,
      "productPrice": 12
    }
  ],
  "totalPrice": 32,
  "userId": "u1"
};
