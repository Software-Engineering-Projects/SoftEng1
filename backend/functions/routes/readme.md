
# API Testing Overview

### **NOTE: Make sure you've already setup firebase to ensure testing of these endpoints as the BASE_URL will come from that**

## User API Reference

### Get user count

```http
  GET `${BASE_URL}/api/users/count`
```

### Description

This endpoint is a **GET** request and is responsible for returning the total number of users in the database. It does not require any parameters or Custom Headers.

### Request Parameters

#### Path Parameters

None

#### Body Parameters

None

#### Query Parameters

None

#### Custom Headers

None

#### Status Codes

| Code | Description                                                    |
| ---- | -------------------------------------------------------------- |
| 200  | OK. The user count was returned successfully                   |
| 500  | Internal Server Error. Something went wrong on the server side |

#### Response Body

| Parameter | Type    | Description                                 |
| --------- | ------- | ------------------------------------------- |
| success   | boolean | Whether the operation was successful or not |
| count     | number  | The total number of users in the database   |

### Sample Response

```javascript
{
    "success": true,
    "count": 32
}
```

### Get user list

```http
  GET `${BASE_URL}/api/users/list`
```

### Description

This endpoint is a **GET** request and is responsible for returning the list of users in the database. It does not require any parameters or any Custom Headers.

### Request Parameters

#### Path Parameters

None

#### Body Parameters

None

#### Query Parameters

None

#### Custom Headers

None

### Response

#### Response Body

| Parameter | Type    | Description                                                    |
| --------- | ------- | -------------------------------------------------------------- |
| success   | boolean | Whether the operation was successful or not                    |
| data      | array   | An array of user objects, each containing the following fields |

#### Status Codes

| Code | Description                                                    |
| ---- | -------------------------------------------------------------- |
| 200  | OK. The user list was returned successfully                    |
| 500  | Internal Server Error. Something went wrong on the server side |

### Sample Responses (200)

```javascript
{
    "success": true,
    "data": [
        {
            "uid": "4J3Tcqttv4TWjd3mZ1kVDrxyU3h2",
            "email": "dasdas@fdjndosjn.com",
            "emailVerified": false,
            "displayName": "oiqnwd=",
            "disabled": false,
            "metadata": {
                "lastSignInTime": "Mon, 06 Nov 2023 15:54:37 GMT",
                "creationTime": "Mon, 06 Nov 2023 15:54:37 GMT",
                "lastRefreshTime": "Mon, 06 Nov 2023 15:54:37 GMT"
            },
            "passwordHash": "aAw4dsZ3W1GVyK08CNsIOAAGhU5cvTQyk7NNX3fATbimskVUah4tn3Lu7Ig77DVy3TfFam-3a7E6mnMxgGBvmw==",
            "passwordSalt": "cUvyxboilMS7uw==",
            "tokensValidAfterTime": "Mon, 06 Nov 2023 15:54:37 GMT",
            "providerData": [
                {
                    "uid": "dasdas@fdjndosjn.com",
                    "displayName": "oiqnwd=",
                    "email": "dasdas@fdjndosjn.com",
                    "providerId": "password"
                }
            ]
        },
    ]
}
```

### Get User by ID

```http
  GET `${BASE_URL}/api/users/:userId`
```

### Description

This endpoint is a **GET** request and is responsible for returning the user details by their ID. It requires the `userId` as a path parameter.

### Request

#### Path Parameters

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| userId    | string | The ID of the user to get details |

#### Custom Headers

None

### Response

#### Response Body

| Parameter | Type    | Description                                                                  |
| --------- | ------- | ---------------------------------------------------------------------------- |
| success   | boolean | Whether the operation was successful or not                                  |
| data      | object  | An object containing the user details, such as uid, email, displayName, etc. |

#### Status Codes

| Code | Description                                                    |
| ---- | -------------------------------------------------------------- |
| 200  | OK. The user details were returned successfully                |
| 400  | Bad Request. The user ID was invalid or not provided           |
| 404  | Not Found. The user with the given ID was not found            |
| 500  | Internal Server Error. Something went wrong on the server side |

### Sample Response 200 (Successful)

```javascript
{
    "success": true,
    "data": {
        "uid": "5muwk8aUsxRTJ6NmK6mUWWTVIgd2",
        "email": "213312@yahoo.com",
        "emailVerified": false,
        "disabled": false,
        "metadata": {
            "lastSignInTime": "Fri, 20 Oct 2023 03:30:08 GMT",
            "creationTime": "Fri, 20 Oct 2023 03:30:08 GMT",
            "lastRefreshTime": "Fri, 20 Oct 2023 04:42:48 GMT"
        },
        "tokensValidAfterTime": "Fri, 20 Oct 2023 03:30:08 GMT",
        "providerData": [
            {
                "uid": "213312@yahoo.com",
                "email": "213312@yahoo.com",
                "providerId": "password"
            }
        ]
    }
}

```

### Delete User by ID

### Same as Get User ID

```http
  DELETE `${BASE_URL}/api/users/:userId`
```

### Sample Response 200 (Successful)

```javascript
{
    "success": true,
    "msg": "User deleted successfully"
}
```

### Sample Response 404 (Not Found)

```javascript
{
    "success": false,
    "msg": "An error occurred while deleting the user",
    "error": "There is no user record corresponding to the provided identifier."
}
```

### User Login

```http
   POST `{{baseUrl}}/api/users/login`
```
### Description

This endpoint is used to authenticate a user. It expects a POST request with the user's credentials (typically their username/email and password) in the request body. If the credentials are valid, it will return a token that the user can use for authenticated requests to other endpoints.

### Request Body
```JSON
{
  "username": "example@gmail.com",
  "password": "password123"
}
```

### Sample Response 200 (Successful)

```JSON
{
    "success": true,
    "idToken": "strings"
}
```

### Assign Admin Role

```http
  POST `${BASE_URL}/api/users/setAdminRole/:userId`
```

### Description

This endpoint is a **POST** request and is responsible for assigning a user an admin role. It takes the `userId` as a path parameter and the `adminId` as a request body. The `adminId` is the ID of the user who is performing the action. <br></br>
NOTE: There are few checks done before assigning the admin role:

- The `adminId` must exist and must be an admin. If not, the endpoint will return a **401 Unauthorized** error.
- The `userId` must be a valid user ID and must not be an admin already. If not, the endpoint will return a **400 Bad Request** error.

If the checks pass, the endpoint will update the user's role to admin and return a **200 OK** response with a success message.

### Request

#### Path Parameters

| Parameter | Type   | Description                      |
| --------- | ------ | -------------------------------- |
| userId    | string | The ID of the user to make admin |

#### Request Body

| Parameter | Type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| adminId   | string | The ID of the user who is performing the action |

### Response

#### Response Body

| Parameter | Type    | Description                                      |
| --------- | ------- | ------------------------------------------------ |
| success   | boolean | Whether the operation was successful or not      |
| msg       | string  | A message indicating the result of the operation |

#### Status Codes

| Code | Description                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------- |
| 200  | OK. The user was assigned an admin role successfully                                                          |
| 400  | Bad Request. The user ID was invalid or the user was already an admin or the user does not have an admin role |
| 401  | Unauthorized. The admin ID was invalid or the user was not an admin                                           |
| 404  | Not Found. The user with the given ID was not found                                                           |
| 500  | Internal Server Error. Something went wrong on the server side                                                |

### Sample Response 200

```javascript
{
    "success": true,
    "msg": "User role updated successfully"
}
```

### Sample Response 400

```javascript
{
  "success": false,
  "msg": "User with id: <userId> is not an admin and cannot assign admin role"
}
```

### Sample Response 500

```javascript
{
    "success": false,
    "msg": "SET ADMIN ROLE ERROR [SERVER]",
    "error": "There is no user record corresponding to the provided identifier."
}
```

### Set Role as type User

### Same as set admin role, `params` and `request body`

### Description

This endpoint is a **POST** request and is responsible for assigning a user an user type role. It takes the `userId` as a path parameter and the `adminId` as a request body. The `adminId` is the ID of the user who is performing the action. There are few checks done before assigning the role type of user

### Sample Response 200 (Most are similar to the set admin role)

```javascript
{
    "success": true,
    "msg": "User role updated successfully"
}
```

## Product API Reference

### Create Single Product

```http
  POST `${BASE_URL}/api/products/create`
```

### Description

This endpoint is a **POST** request and is responsible for creating a new product in the database. It requires the `name`, `price`, and `category` of the product as a request body.

### Request

#### Request Body

| Parameter       | Type    | Description                                                        |
| --------------- | ------- | ------------------------------------------------------------------ |
| name            | string  | The name of the product to create                                  |
| price           | number  | The base price of the product in USD                               |
| category        | string  | The category of the product, such as pizza, beverage, etc.         |
| sizes           | array   | An array of objects that contain the name and price of each size   |
| addons          | array   | An array of objects that contain the name and price of each addon  |
| ingredients     | array   | An array of strings that list the ingredients of the product       |
| description     | string  | A brief description of the product                                 |
| imageUrl        | string  | A URL that points to an image of the product                       |
| isFeatured      | boolean | A flag that indicates whether the product is featured or not       |
| isPublished     | boolean | A flag that indicates whether the product is published or not      |
| nutritionalInfo | object  | An object that contains the nutritional information of the product |
| preparationTime | number  | The time in minutes it takes to prepare the product                |

#### Headers

None

### Response

#### Response Body

| Parameter | Type    | Description                                                                       |
| --------- | ------- | --------------------------------------------------------------------------------- |
| success   | boolean | Whether the operation was successful or not                                       |
| data      | object  | An object containing the product details, such as id, name, price, category, etc. |
| msg       | string  | A message indicating the result of the operation                                  |
| id        | string  | The ID of the product that was created                                            |

#### Status Codes

| Code | Description                                                    |
| ---- | -------------------------------------------------------------- |
| 201  | Created. The product was created successfully                  |
| 400  | Bad Request. The request body was invalid or missing           |
| 500  | Internal Server Error. Something went wrong on the server side |

### Sample JSON Response 201(Create)

```javascript
{
    "success": true,
    "msg": "Product created successfully",
    "data": {
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
        "ingredients": [
            "Cheese",
            "Tomato Sauce",
            "Flour",
            "Yeast"
        ],
        "description": "A classic cheese pizza with a crispy crust and a rich tomato sauce.",
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
    },
    "id": "2jeHGsXzW7uJ8g8ou9AB"
}
```

### Get all products

```http
  GET `${BASE_URL}/api/products/all`
```

Sure, I can help you improve your API documentation. Here are some suggestions:

- You can add a **description** section to explain what the endpoint does and what parameters it returns.
- You can add a **request** section to specify the query parameters or Custom Headers that the endpoint expects.
- You can add a **response** section to list the possible status codes and response body fields that the endpoint returns.
- You can use a **table** format to display the fields in a structured way.
- You can add a **sample response** section under the **response** section and use a code block to display the JSON response.

Here is a possible improved documentation for your endpoint:

### Get all products

### Description

This endpoint is a **GET** request and is responsible for returning the list of all products in the database. It does not require any parameters or Custom Headers.

### Request

#### Query Parameters

None

#### Custom Headers

None

### Response

#### Response Body

| Parameter | Type    | Description                                                                      |
| --------- | ------- | -------------------------------------------------------------------------------- |
| success   | boolean | Whether the operation was successful or not                                      |
| data      | array   | An array of product objects, each containing the id, name, price, category, etc. |

The product object has the same fields as described in the **Create Single Product** endpoint.

#### Status Codes

| Code | Description                                                    |
| ---- | -------------------------------------------------------------- |
| 200  | OK. The product list was returned successfully                 |
| 500  | Internal Server Error. Something went wrong on the server side |

### Sample JSON Response

```javascript
{
    "success": true,
    "data": [
        {
            "id": "8ZxD6zyUkKsvbC6AiNgS",
            "productName": "Pepsi",
            "basePrice": "5",
            "sizes": [
                {
                    "price": "0",
                    "name": "regular"
                }
            ],
            "addons": [],
            "ingredients": [
                "Sugar"
            ]
        },
        {
            "id": "9co8WR1488BiVsmIKcVG",
            "productName": "Coke",
            "basePrice": "12",
            "sizes": [
                {
                    "price": "0",
                    "name": "small"
                }
            ],
            "addons": [],
            "ingredients": [
                "Sugar",
                "Syrup",
                "Mint"
            ]
        },
    ]
}
```

### Get product by ID

```http
  GET `${BASE_URL}/api/products/:productId`
```

### Description

This endpoint is a **GET** request and is responsible for returning the product details by its ID. It requires the `productId` as a path parameter.

### Request

#### Path Parameters

| Parameter | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| productId | string | The ID of the product to get details |

#### Headers

None

### Response

#### Response Body

| Parameter | Type    | Description                                                                       |
| --------- | ------- | --------------------------------------------------------------------------------- |
| success   | boolean | Whether the operation was successful or not                                       |
| data      | object  | An object containing the product details, such as id, name, price, category, etc. |

#### Status Codes

| Code | Description                                                    |
| ---- | -------------------------------------------------------------- |
| 200  | OK. The product details were returned successfully             |
| 400  | Bad Request. The product ID was invalid                        |
| 404  | Not Found. The product with the given ID was not found         |
| 500  | Internal Server Error. Something went wrong on the server side |

### Sample Response 200 (Successful)

```javascript
{
    "success": true,
    "data": {
        "productId": "AmJ6mKO4MX4lRiPS248V",
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
        "description": "A classic cheese pizza with a crispy crust and a rich tomato sauce.",
        "category": "Pizza",
        "imageUrl": "https://example.com/cheese-pizza.jpg",
        "isFeatured": false,
        "isPublished": false,
        "nutritionalInfo": {
            "carbohydrates": 40,
            "fiber": 2,
            "protein": 15,
            "fat": 12,
            "calories": 300,
            "sugar": 5
        },
        "preparationTime": 15
    }
}
```

### Update product by ID

```http
  PATCH `${BASE_URL}/api/products/:productId`
```

### Description

This endpoint is a **PATCH** request and is responsible for updating the product details by its ID. It requires the `productId` as a path parameter and field being changed. Some fields are optional whilst others are not, you can check the product schema

### Request

#### Path Parameters

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| productId | string | The ID of the product to update details |

#### Headers

None

### Response

#### Response Body

| Parameter | Type    | Description                                                                               |
| --------- | ------- | ----------------------------------------------------------------------------------------- |
| success   | boolean | Whether the operation was successful or not                                               |
| data      | object  | An object containing the updated product details, such as id, name, price, category, etc. |

The product object has the same fields as described in the **Create Single Product** endpoint.

#### Status Codes

| Code | Description                                                    |
| ---- | -------------------------------------------------------------- |
| 200  | OK. The product details were updated successfully              |
| 400  | Bad Request. The product ID or the request body was invalid    |
| 404  | Not Found. The product with the given ID was not found         |
| 500  | Internal Server Error. Something went wrong on the server side |

### Sample Response 200 (Successful)

Product Name was changed from `Cheese Pizza` to  `Cheese`, not all fields are required, and if a field is not changed no validation errors are thrown, isFeatured and isPublished will default to false as this can be used for logically implemeted a draft save feature.

```javascript
{
    "success": true,
    "data": {
        "productName": "Cheese",
        "isFeatured": false,
        "isPublished": false
    }
}
```

### Delete product by ID

```http
DELETE `${BASE_URL}/api/products/:productId`
```

### Description

This endpoint is a **DELETE** request and is responsible for deleting the product from the database by its ID. It requires the `productId` as a path parameter.

### Request

#### Path Parameters

| Parameter | Type   | Description                     |
| --------- | ------ | ------------------------------- |
| productId | string | The ID of the product to delete |

#### Headers

None

### Response

#### Response Body

| Parameter | Type    | Description                                      |
| --------- | ------- | ------------------------------------------------ |
| success   | boolean | Whether the operation was successful or not      |
| msg       | string  | A message indicating the result of the operation |
| data      | object  | Object returned by firestore                     |

#### Status Codes

| Code | Description                                                    |
| ---- | -------------------------------------------------------------- |
| 200  | OK. The product was deleted successfully                       |
| 400  | Bad Request. The product ID was invalid                        |
| 404  | Not Found. The product with the given ID was not found         |
| 500  | Internal Server Error. Something went wrong on the server side |

### Sample Response 200 (Successful)

```javascript
{
    "success": true,
    "msg": "Product with ID: aAPp0QFKqlK6qFFqd8ts deleted successfully",
    "data": {
        "_writeTime": {
            "_seconds": 1707205525,
            "_nanoseconds": 513005000
        }
    }
}
```
### Admin create product

```http
  POST `${BASE_URL}/api/products/create`
```

### Description

This endpoint is a **POST** request and is responsible for creating a new product in the database. It requires the `name`, `price`, and `category` of the product as a request body. It also requires the `IdToken` of the admin user as a request headers.

### Request Header

| Key           | Value                                                             |
| ------------- | ------------------------------------------------------------------|
| Authorization | Put the token here                                                |

### Request Body

Refer to the Request Body of Create Single Product in the line 365

### Response Body

Refer to the Request Body of Create Single Product in the line 388

### Status Code

| Code | Description                                                             |
| ---- | ----------------------------------------------------------------------- |
| 201  | Created. The product was created successfully                           |
| 400  | Bad Request. The request body was invalid or missing                    |
| 500  | Internal Server Error. Something went wrong on the server side          |
| 401  | Authorization required. The token is either missing, invalid or expired |

### Sample Response 401
```JSON
{
    "success": false,
    "msg": "You are not authorized"
}
```
### Admin Update Product by ID

```http
  PATCH `${BASE_URL}/api/products/:productId`
```

### Description

This endpoint is a **PATCH** request and is responsible for updating the product details by its ID. It requires the `productId` as a path parameter and field being changed. It also requires the `IdToken` of the admin user as a request headers. Some fields are optional whilst others are not, you can check the product schema

### Request Header

| Key           | Value                                                             |
| ------------- | ------------------------------------------------------------------|
| Authorization | Put the token here                                                |

#### Path Parameters

Refer to the Path Parameters of the Update product by ID in line 650

#### Response Body

Refer to the Response Body of the the Update product by ID in line 662

#### Status Codes

| Code | Description                                                             |
| ---- | ----------------------------------------------------------------------- |
| 200  | OK. The product details were updated successfully                       |
| 400  | Bad Request. The product ID or the request body was invalid             |
| 404  | Not Found. The product with the given ID was not found                  |
| 500  | Internal Server Error. Something went wrong on the server side          |
| 401  | Authorization required. The token is either missing, invalid or expired |

### Sample Response 401
```JSON
{
    "success": false,
    "msg": "You are not authorized"
}
```

### Admin Delete product by ID

```http
DELETE `${BASE_URL}/api/products/:productId`
```

### Description

This endpoint is a **DELETE** request and is responsible for deleting the product from the database by its ID. It requires the `productId` as a path parameter. It also requires the `IdToken` of the admin user as a request headers.

### Request Header

| Key           | Value                                                             |
| ------------- | ------------------------------------------------------------------|
| Authorization | Put the token here                                                |

#### Path Parameters

Refer to the Path Parameters of the Delete product by ID in line 707

#### Response Body

Refer to the Response Body of the the Update product by ID in line 719

#### Status Codes

| Code | Description                                                             |
| ---- | ----------------------------------------------------------------------- |
| 200  | OK. The product was deleted successfully                                |
| 400  | Bad Request. The product ID was invalid                                 |
| 404  | Not Found. The product with the given ID was not found                  |
| 500  | Internal Server Error. Something went wrong on the server side          |
| 401  | Authorization required. The token is either missing, invalid or expired |

### Sample Response 401
```JSON
{
    "success": false,
    "msg": "You are not authorized"
}
```