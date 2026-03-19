Auth endpoint:

POST
-> /auth/login (string email, string password) => Authenticate credentials and sends a verification code to the user's email upon success.

POST
-> /auth/verify-login (string email, string code) => Verifies the code; if it matches, the user is logged in and receives a JWT token.

POST
-> /auth/register (string email, string username, string password) => Initiates registration and sends a verification code to the email provided.

POST
-> /auth/verify-register (string email, string code) => Validates the code and insert the user account to the database.

POST
-> /auth/logout () => Clears the access_token cookie and invalidates the session.

POST => require JWT token
-> /auth/update (string email, string username, string password -> all off these optional) => Initiates a profile update and sends a verification code to the current email address.

POST => require JWT token
-> /auth/verify-update (string code) => Updates the user's data if the code is correct (data to be changed is provided in the initial update request).

POST
-> /auth/forgot-password (string email) => Sends a password reset verification code to the specified email.

POST
-> /auth/reset-password (string email, string code, string newPassword) => Updates the password if the verification code is valid.

GET => require JWT token
-> /auth/me => Returns the authenticated user's email and username.