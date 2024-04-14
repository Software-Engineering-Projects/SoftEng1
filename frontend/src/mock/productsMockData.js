// TODO: If the product is featured put it in the carousel
// TODO: For now images are only one image but in the future it can be multiple images

// FIXME: Change name, in size and addon to sizeName, addonName, addonPrice, etc

// TODO: The id's will come from the database
export const productsMockData = [
  {
    "id": 1,
    "productImage": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGJ1cmdlcnxlbnwwfHwwfHx8MA%3D%3D",
    "productName": "Chicken Burger",
    "category": "Fast Food",
    "basePrice": 5.99,
    "ingredients": ["Chicken", "Bread", "Lettuce", "Tomato"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 2 },
      { "name": "Large", "price": 2.99 }
    ],
    "addons": [
      { "name": "Cheese", "price": 0.99 },
      { "name": "Bacon", "price": 1.49 },

    ],
    "dateAdded": "2022-01-01",
    "isPublished": true,
    "isFeatured": true,
    "description": "Juicy chicken, fresh lettuce, and ripe tomatoes sandwiched in a soft bun. A classic delight for fast food lovers."
  },

  {
    "id": 2,
    "productImage": "https://images.unsplash.com/photo-1608424406467-ff8e17a1498e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8VmVnZ2llJTIwUGl6emF8ZW58MHx8MHx8fDA%3D",
    "productName": "Veggie Pizza",
    "category": "Italian",
    "basePrice": 8.99,
    "ingredients": ["Dough", "Tomato Sauce", "Cheese", "Bell Peppers", "Mushrooms"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 1.99 },
      { "name": "Large", "price": 3.99 }
    ],
    "addons": [
      { "name": "Extra Cheese", "price": 0.99 },
      { "name": "Olives", "price": 0.49 },


    ],
    "dateAdded": "2022-02-01",
    "isPublished": true,
    "isFeatured": true,
    "description": "Savor the flavors of Italy with our Veggie Pizza. A crispy crust topped with bell peppers, mushrooms, and extra cheese."
  },
  // TODO: Add the sizes, addons price to total price calculation
  {
    "id": 3,
    "productImage": "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Spaghetti Carbonara",
    "category": "Italian",
    "basePrice": 9.99,
    "ingredients": ["Spaghetti", "Eggs", "Bacon", "Parmesan Cheese", "Black Pepper"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Large", "price": 3.99 }
    ],
    "addons": [
      { "name": "Garlic Bread", "price": 0.99 },
      { "name": "Salad", "price": 1.49 },


    ],
    "dateAdded": "2022-03-15",
    "isPublished": true,
    "isFeatured": true,
    "description": "Indulge in the rich taste of our Spaghetti Carbonara. Perfectly cooked pasta with bacon, eggs, and Parmesan cheese."
  },
  {
    "id": 4,
    "productImage": "https://images.unsplash.com/photo-1570877215023-229052e10c34?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Sushi Platter",
    "category": "Japanese",
    "basePrice": 12.99,
    "ingredients": ["Sushi Rice", "Nori Seaweed", "Fish", "Vegetables"],
    "sizes": [
      { "name": "Regular", "price": 0 },
      { "name": "Large", "price": 0.99 }
    ],
    "addons": [
      { "name": "Soy Sauce", "price": 0.49 },
      { "name": "Wasabi", "price": 0.49 },


    ],
    "dateAdded": "2022-04-20",
    "isPublished": true,
    "isFeatured": true,
    "description": "Immerse yourself in the world of Japanese cuisine with our Sushi Platter. Fresh fish and vegetables rolled in nori seaweed."
  },
  {
    "id": 5,
    "productImage": "https://plus.unsplash.com/premium_photo-1663012872761-33dd73e292cc?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Steak Dinner",
    "category": "American",
    "basePrice": 15.99,
    "ingredients": ["Ribeye Steak", "Mashed Potatoes", "Gravy", "Green Beans"],
    "sizes": [
      { "name": "Regular", "price": 0 },
      { "name": "Large", "price": 4.99 }
    ],
    "addons": [
      { "name": "Garlic Butter", "price": 0.99 },
      { "name": "Mushrooms", "price": 1.49 },


    ],
    "dateAdded": "2022-05-10",
    "isPublished": true,
    "isFeatured": true,
    "description": "A hearty American feast with Ribeye Steak, creamy mashed potatoes, and green beans. Served with garlic butter and mushrooms."
  },

  {
    "id": 6,
    "productImage": "https://images.unsplash.com/photo-1627564803215-ad55bad5c5ea?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Tacos",
    "category": "Mexican",
    "basePrice": 7.99,
    "ingredients": ["Tortillas", "Ground Beef", "Lettuce", "Tomato", "Cheese"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 1.99 },
      { "name": "Large", "price": 2.99 }
    ],
    "addons": [
      { "name": "Salsa", "price": 0.49 },
      { "name": "Guacamole", "price": 0.99 },


    ],
    "dateAdded": "2022-06-18",
    "isPublished": true,
    "isFeatured": true,
    "description": "Experience the vibrant flavors of Mexico with our Tacos. Ground beef, lettuce, and cheese wrapped in soft tortillas."
  },
  {
    "id": 7,
    "productImage": "https://plus.unsplash.com/premium_photo-1669680785558-c189b49aed4e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Ice Cream Sundae",
    "category": "Dessert",
    "basePrice": 4.99,
    "ingredients": ["Vanilla Ice Cream", "Hot Fudge", "Whipped Cream", "Cherries"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 2.99 },
      { "name": "Large", "price": 4.99 }
    ],
    "addons": [
      { "name": "Sprinkles", "price": 0.49 },
      { "name": "Nuts", "price": 0.99 },


    ],
    "dateAdded": "2022-07-30",
    "isPublished": true,
    "isFeatured": true,
    "description": "Treat yourself to a delightful dessert with our Ice Cream Sundae. Vanilla ice cream, hot fudge, and whipped cream."
  },
  {
    "id": 8,
    "productImage": "https://images.unsplash.com/photo-1562835155-a7c2a225e97d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Pineapple Pizza",
    "category": "Italian",
    "basePrice": 10.99,
    "ingredients": ["Dough", "Tomato Sauce", "Cheese", "Pineapple", "Ham"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 1.99 },
      { "name": "Large", "price": 2.99 }
    ],
    "addons": [
      { "name": "Extra Cheese", "price": 0.99 },
      { "name": "Olives", "price": 0.49 },


    ],
    "dateAdded": "2022-08-25",
    "isPublished": true,
    "isFeatured": true,
    "description": "A tropical twist on traditional pizza. Enjoy the sweetness of pineapple paired with ham and extra cheese."
  },
  {
    "id": 9,
    "productImage": "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Fried Chicken",
    "category": "Fast Food",
    "basePrice": 6.99,
    "ingredients": ["Chicken", "Breading", "Mashed Potatoes", "Gravy"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 0.99 },
      { "name": "Large", "price": 1.99 }
    ],
    "addons": [
      { "name": "Coleslaw", "price": 0.49 },
      { "name": "Biscuits", "price": 0.99 },


    ],
    "dateAdded": "2022-09-12",
    "isPublished": true,
    "isFeatured": true,
    "description": "Crispy on the outside, tender on the inside. Our Fried Chicken comes with mashed potatoes and gravy."
  },
  {
    "id": 10,
    "productImage": "https://images.unsplash.com/photo-1597289124948-688c1a35cb48?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Lasagna",
    "category": "Italian",
    "basePrice": 11.99,
    "ingredients": ["Lasagna Noodles", "Ricotta Cheese", "Ground Beef", "Tomato Sauce"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 2.99 },
      { "name": "Large", "price": 3.99 }
    ],
    "addons": [
      { "name": "Garlic Bread", "price": 0.99 },
      { "name": "Salad", "price": 1.49 },


    ],
    "dateAdded": "2022-10-20",
    "isPublished": true,
    "isFeatured": true,
    "description": " Layers of lasagna noodles, ricotta cheese, and savory meat sauce. A classic Italian dish."
  },

  {
    "id": 11,
    "productImage": "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Pepperoni Pizza",
    "category": "Pizza",
    "basePrice": 8.99,
    "ingredients": ["Pepperoni", "Pizza Dough", "Tomato Sauce", "Mozzarella Cheese"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 4.99 },
      { "name": "Large", "price": 8.99 }
    ],
    "addons": [
      { "name": "Green Peppers", "price": 0.49 },
      { "name": "Olives", "price": 0.49 },


    ],
    "dateAdded": "2022-02-15",
    "isPublished": true,
    "isFeatured": true,
    "description": "A pizza lover's dream! Pepperoni, mozzarella cheese, and tomato sauce on a perfect crust."
  },
  {
    "id": 12,
    "productImage": "https://images.unsplash.com/photo-1648857529887-28d03f6774ea?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Chocolate Sundae",
    "category": "Dessert",
    "basePrice": 4.49,
    "ingredients": ["Chocolate Ice Cream", "Hot Fudge", "Whipped Cream", "Sprinkles"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 2.49 },
      { "name": "Large", "price": 5.49 }
    ],
    "addons": [],
    "dateAdded": "2022-03-10",
    "isPublished": true,
    "isFeatured": true,
    "description": "Indulge your sweet tooth with our Chocolate Sundae. Rich chocolate ice cream, hot fudge, and sprinkles."
  },
  {
    "id": 13,
    "productImage": "https://plus.unsplash.com/premium_photo-1664478291780-0c67f5fb15e6?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Spaghetti Bolognese",
    "category": "Italian",
    "basePrice": 12.99,
    "ingredients": ["Spaghetti", "Bolognese Sauce", "Ground Beef", "Parmesan Cheese"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 3.49 },
      { "name": "Large", "price": 4.99 }
    ],
    "addons": [
      { "name": "Garlic Bread", "price": 0.99 },
      { "name": "Salad", "price": 1.49 },


    ],
    "dateAdded": "2022-04-20",
    "isPublished": true,
    "isFeatured": true,
    "description": "A comforting Italian favorite. Spaghetti with hearty Bolognese sauce and Parmesan cheese."
  },
  {
    "id": 14,
    "productImage": "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Sushi Roll Combo",
    "category": "Japanese",
    "basePrice": 14.99,
    "ingredients": ["Rice", "Nori", "Fish", "Vegetables"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 4.99 },
      { "name": "Large", "price": 6.99 }
    ],
    "addons": [],
    "dateAdded": "2022-05-12",
    "isPublished": true,
    "isFeatured": true,
    "description": "Dive into the flavors of Japan with our Sushi Roll Combo. Fresh rice, nori, fish, and vegetables."
  },
  {
    "id": 15,
    "productImage": "https://images.unsplash.com/photo-1519996529931-28324d5a630e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Fruit Salad",
    "category": "Salad",
    "basePrice": 6.99,
    "ingredients": ["Mixed Fruits", "Honey", "Lime Juice", "Mint Leaves"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 2.49 },
      { "name": "Large", "price": 4.99 }
    ],
    "addons": [],
    "dateAdded": "2022-06-30",
    "isPublished": true,
    "isFeatured": true,
    description: "A refreshing salad with mixed fruits, honey, and lime juice. Perfect for a hot summer day."
  },

  {
    "id": 16,
    "productImage": "https://plus.unsplash.com/premium_photo-1661445033671-cd3f5eb46f34?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Ribeye Steak",
    "category": "Steakhouse",
    "basePrice": 19.99,
    "ingredients": ["Ribeye Steak", "Mashed Potatoes", "Asparagus", "Steak Sauce"],
    "sizes": [
      { "name": "8 oz", "price": 0 },
      { "name": "12 oz", "price": 2.99 },
      { "name": "16 oz", "price": 5.99 }
    ],
    "addons": [
      { "name": "Garlic Butter", "price": 0.99 },
      { "name": "Mushroom Sauce", "price": 1.49 },


    ],
    "dateAdded": "2022-07-18",
    "isPublished": true,
    "isFeatured": true,
    "description": "A succulent Ribeye Steak cooked to perfection. Served with mashed potatoes, asparagus, and steak sauce."
  },
  {
    "id": 17,
    "productImage": "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Cappuccino",
    "category": "Beverage",
    "basePrice": 3.49,
    "ingredients": ["Espresso", "Steamed Milk", "Foamed Milk"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 2.99 },
      { "name": "Large", "price": 3.49 }
    ],
    "addons": [],
    "dateAdded": "2022-08-05",
    "isPublished": true,
    "isFeatured": true,
    description: "A classic Italian coffee drink. Espresso with steamed milk and foamed milk."
  },
  {
    "id": 18,
    "productImage": "https://plus.unsplash.com/premium_photo-1664478244517-513dc18af854?q=80&w=1914&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Burrito",
    "category": "Mexican",
    "basePrice": 7.99,
    "ingredients": ["Rice", "Black Beans", "Guacamole", "Salsa"],
    "sizes": [
      { "name": "Regular", "price": 0 },
      { "name": "Large", "price": 2.99 }
    ],
    "addons": [],
    "dateAdded": "2022-09-14",
    "isPublished": true,
    "isFeatured": true,
    "description": "A Mexican favorite. Rice, black beans, guacamole, and salsa wrapped in a soft tortilla."
  },



  {
    "id": 19,
    "productImage": "https://plus.unsplash.com/premium_photo-1681826633566-eeb271980a61?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Fresh Vegetable Juice",
    "category": "Beverage",
    "basePrice": 4.99,
    "ingredients": ["Carrots", "Cucumbers", "Kale", "Lemon"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 2.49 },
      { "name": "Large", "price": 4.99 }
    ],
    "addons": [],
    "dateAdded": "2022-10-25",
    "isPublished": true,
    "isFeatured": true,
    "description": "A refreshing drink made with fresh carrots, cucumbers, kale, and lemon."
  },
  {
    "id": 20,
    "productImage": "https://images.unsplash.com/photo-1574782256243-69c18023f7b4?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Club Sandwich",
    "category": "Sandwich",
    "basePrice": 9.49,
    "ingredients": ["Turkey", "Bacon", "Lettuce", "Tomato"],
    "sizes": [
      { "name": "Regular", "price": 0 },
      { "name": "Large", "price": 3.49 }
    ],
    "addons": [
      { "name": "Egg", "price": 0.49 },
      { "name": "Avocado", "price": 0.99 },


    ],
    "dateAdded": "2022-11-08",
    "isPublished": true,
    "isFeatured": true,
    "description": "A satisfying combination of turkey, bacon, lettuce, and tomato. Add an egg or avocado for extra flavor."
  },
  {
    "id": 21,
    "productImage": "https://plus.unsplash.com/premium_photo-1661730314652-911662c0d86e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Beef Taco",
    "category": "Mexican",
    "basePrice": 2.99,
    "ingredients": ["Ground Beef", "Taco Shell", "Lettuce", "Salsa"],
    "sizes": [
      { "name": "Regular", "price": 0 }
    ],
    "addons": [
      { "name": "Cheese", "price": 0.49 },
      { "name": "Sour Cream", "price": 0.49 },


    ],
    "dateAdded": "2022-12-12",
    "isPublished": true,
    "isFeatured": true,
    "description": "A classic Mexican dish. Ground beef, lettuce, and salsa in a crispy taco shell."
  },
  {
    "id": 22,
    "productImage": "https://images.unsplash.com/photo-1558401391-34ef38f87ed2?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Blueberry Pancakes",
    "category": "Breakfast",
    "basePrice": 6.49,
    "ingredients": ["Pancakes", "Blueberries", "Maple Syrup", "Whipped Cream"],
    "sizes": [
      { "name": "Regular", "price": 0 }
    ],
    "addons": [],
    "dateAdded": "2023-01-05",
    "isPublished": true,
    "isFeatured": true,
    "description": "Blueberry Pancakes: Start your morning right with our Blueberry Pancakes. Fluffy pancakes with sweet blueberries and maple syrup."
  },

  {
    "id": 23,
    "productImage": "https://images.unsplash.com/photo-1615761136599-86165bdf1a83?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Lobster Dinner",
    "category": "Seafood",
    "basePrice": 24.99,
    "ingredients": ["Lobster", "Butter", "Garlic", "Lemon"],
    "sizes": [
      { "name": "Whole Lobster", "price": 0 }
    ],
    "addons": [],
    "dateAdded": "2023-02-20",
    "isPublished": true,
    "isFeatured": true,
    "description": "Elevate your dining experience with our Lobster Dinner. Whole lobster served with butter, garlic, and lemon."
  },
  {
    "id": 24,
    "productImage": "https://images.unsplash.com/photo-1598679253544-2c97992403ea?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Sweet Potato Fries",
    "category": "Appetizer",
    "basePrice": 3.99,
    "ingredients": ["Sweet Potatoes", "Salt", "Cayenne Pepper"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 2.49 },
      { "name": "Large", "price": 4.99 }
    ],
    "addons": [
      { "name": "Chipotle Mayo", "price": 0.49 },
      { "name": "Ketchup", "price": 0.49 },


    ],
    "dateAdded": "2023-03-15",
    "isPublished": true,
    "isFeatured": true,
    "description": "Crispy sweet potato fries with a choice of chipotle mayo or ketchup for dipping."
  },

  {
    "id": 25,
    "productImage": "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Fresh Lemonade",
    "category": "Beverage",
    "basePrice": 2.49,
    "ingredients": ["Lemons", "Water", "Sugar"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 2.49 },
      { "name": "Large", "price": 4.99 }
    ],
    "addons": [],
    "dateAdded": "2023-04-10",
    "isPublished": true,
    "isFeatured": true,
    "description": "A refreshing drink made with fresh lemons, water, and sugar."
  },
  {
    "id": 26,
    "productImage": "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Meatballs",
    "category": "Mexican",
    "basePrice": 8.99,
    "ingredients": ["Ground Pork", "Eggs", "Black Pepper", "Flour"],
    "sizes": [
      { "name": "Regular", "price": 0 }
    ],
    "addons": [],
    "dateAdded": "2023-05-25",
    "isPublished": true,
    "isFeatured": true,
    "description": "Juicy meatballs made with ground pork, eggs, black pepper, and flour."
  },
  {
    "id": 27,
    "productImage": "https://images.unsplash.com/photo-1608039755401-742074f0548d?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Chicken Wings",
    "category": "Appetizer",
    "basePrice": 7.49,
    "ingredients": ["Chicken Wings", "Buffalo Sauce", "Celery", "Ranch Dressing"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 3.49 },
      { "name": "Large", "price": 5.49 }
    ],
    "addons": [],
    "dateAdded": "2023-06-10",
    "isPublished": true,
    "isFeatured": true,
    "description": "Crispy chicken wings tossed in buffalo sauce. Served with celery and ranch dressing."
  },

  {
    "id": 28,
    "productImage": "https://images.unsplash.com/photo-1599599810694-b5b37304c041?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Hot Dog",
    "category": "Fast Food",
    "basePrice": 3.49,
    "ingredients": ["Hot Dog Bun", "Hot Dog Sausage", "Mustard", "Ketchup"],
    "sizes": [
      { "name": "Regular", "price": 0 }
    ],
    "addons": [],
    "dateAdded": "2023-07-12",
    "isPublished": true,
    "isFeatured": true,
    "description": "A classic American favorite. Hot dog sausage, mustard, and ketchup in a soft bun."
  },
  {
    "id": 29,
    "productImage": "https://images.unsplash.com/photo-1578843526990-da0509d5ecc6?q=80&w=1941&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Salmon Sashimi",
    "category": "Japanese",
    "basePrice": 11.99,
    "ingredients": ["Salmon", "Wasabi", "Soy Sauce", "Pickled Ginger"],
    "sizes": [
      { "name": "Regular", "price": 0 }
    ],
    "addons": [],
    "dateAdded": "2023-08-18",
    "isPublished": true,
    "isFeatured": true,
    "description": "Fresh salmon sashimi served with wasabi, soy sauce, and pickled ginger."
  },
  {
    "id": 30,
    "productImage": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "productName": "Pasta",
    "category": "Italian",
    "basePrice": 10.49,
    "ingredients": ["Pasta", "Mixed Vegetables", "Tomato Sauce", "Parmesan Cheese"],
    "sizes": [
      { "name": "Small", "price": 0 },
      { "name": "Regular", "price": 3.49 },
      { "name": "Large", "price": 5.49 }
    ],
    "addons": [
      { "name": "Garlic Bread", "price": 0.99 },
      { "name": "Caesar Salad", "price": 1.49 },


    ],
    "dateAdded": "2023-09-22",
    "isPublished": true,
    "isFeatured": true,
    "description": "A hearty Italian classic. Pasta with mixed vegetables, tomato sauce, and Parmesan cheese."
  }

];
