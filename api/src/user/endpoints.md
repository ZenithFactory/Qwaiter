USER endpoints:

RESTAURANTS => (all of these require JWT token):

POST
-> /user/create/restaurant (string restaurantName, string address)
    -> Creates a new restaurant associated with the authenticated owner.

DELETE
-> /user/delete/restaurant (string restaurantID)
    -> Deletes the specified restaurant if it belongs to the authenticated owner.

GET
-> /user/restaurants
    -> Returns a list of all restaurants owned by the authenticated user.

POST
-> /user/update/restaurant/:id (string id (param))
    -> Updates the details of a specific restaurant.

TABLES => (all of these require JWT token):

POST
-> /user/create/table (string restaurantID, string tableName, string authCode)
    -> Creates a new table for a specific restaurant.

DELETE
-> /user/delete/table (string restaurantID, string tableID)
    -> Removes a table from a restaurant.

POST
-> /user/update/table (string restaurantID, string tableID, string tableName, string authCode)
    -> Updates an existing table's information.

GET
-> /user/tables/:restaurantID (string restaurantID (param))
    -> Returns all tables belonging to the specified restaurant.

STAFF (WORKERS) => (all of these require JWT token):

POST
-> /user/create/worker (string restaurantID, string name, string username, string password, (admin, waiter, kitchen) role)
    -> Adds a new worker/staff member to the owner's restaurant systems.

GET
-> /user/staff/:restaurantID (string restaurantID (param))
    -> Retrieves all staff members assigned to a specific restaurant.

POST
-> /user/update/staff (string restaurantID, string name, string username, string password, (admin, waiter, kitchen) role)
    -> Updates a worker's information.

CATEGORIES => (all of these require JWT token):

POST
-> /user/create/category (string restaurantID, string categoryName, number displayOrder (optional))
    -> Creates a new menu category (e.g., Drinks, Meals).

GET
-> /user/categories/:restaurantID (string restaurantID (param))
    -> Public endpoint: Returns all categories available in a specific restaurant.

DELETE
-> /user/delete/category (string restaurantID, string categoryID)
    -> Removes a menu category.

PATCH
-> /user/update/categories (string restaurantID, string categoryID, string name (optional), number displayOrder (optional))
    -> Updates an existing category.

MENU ITEMS

POST => require JWT token
/user/create/menuItem (string restaurantID, string categoryID (optional), string name, string description (optional), number price)
    -> Adds a new item to the restaurant's menu.

DELETE => require JWT token
-> /user/delete/menuItem (string restaurantID, string menuItemID)
    -> Removes a specific menu item.

GET
/user/:restaurantId/menuItem/:menuItemId (UUID-string restaurantId, UUID-string menuItemId)
    -> Public endpoint: Returns details of a specific menu item.

GET
-> /user/:restaurantId/menu (UUID restaurantId)
    -> Public endpoint: Returns the full menu of the specified restaurant.

PATCH => require JWT token
-> /user/update/menuItem (string restaurantID, string menuItemID, string categoryID (optional), string name (optional), string description (optional), number price (optional))
    -> Updates an existing menu item's details.