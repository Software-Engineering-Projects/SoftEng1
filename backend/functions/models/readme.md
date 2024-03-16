## Products Collection Schema

#### Check the Schema in the models folder to check out more of the validation rules

```javascript
const schema = {
    "id": "string",
    "name": "string",
    "basePrice": "number",
    "sizes": "object" {
        "price": "number",
        "name": "string"
    },
    "addons": "object"{
        "name": "string",
        "price": "number"
    },
    "ingredients": "array" [
        "string"
    ],
    "description": "string",
    "category": "string",
    "imageUrl": "string",
    "isFeatured": "boolean",
    "isPublished": "boolean",
    "nutritionalInfo": "object" {
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
  "id": "p1",
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
    "id": "string",
    "userId": "string",
    "orderDate": "string",
    "status": "string",
    "customerName": "string",
    "customerEmail": "string",
    "shippingAddress": "object" {
        "address": "string",
        "city": "string",
        "province": "string"
    },
    // This will contain all items from the cart based on the user's Id (Based on the cart model)
    "cartId": "string",
    "totalPrice": "number",
}
``` 

## Order Example (Valid Inputs)

```javascript
const data = {
    "id": "o1",
    "userId": "u1",
    "orderDate": "2024-01-30",
    "status": "confirmed",
    "customerName": "Alice",
    "customerEmail": "alice@example.com",
    "shippingAddress": {
        "address": "123 Main Street",
        "city": "Binangonan",
        "province": "Calabarzon"
    },
    "cartId": "c1",
    "totalPrice": 35
}
```

## Cart Collection Schema

```javascript
const schema = {
    "id": "string",
    "items": "object" {
        {
          "productId": "string",
          "productIdentifier": "string",
          "productQuantity": "number",
          "productPrice": "number",
        }
    },
    "totalPrice": "number",
}
```

## Cart Example (Valid Inputs)

```javascript
const data = {
  "id": "c1",
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
  "totalPrice": 32
};
