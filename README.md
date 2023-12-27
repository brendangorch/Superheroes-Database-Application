# Superheroes-Database-Application
A full-stack application for creating accounts, searching for superheroes, and creating public customized lists from a document of hundreds of heroes (from Kaggle). The back-end was developed using node.js, express, mongodb, and bcrypt + jwt for security. The front-end was developed using react with JavaScript. Follows REST principles.

# Steps for Running the Program
1) Download all the files from the client and server folders (make sure to install the exact directories)
2) Run 'npm install' in the terminal while in the directory for client
3) Repeat step 2 but in the directory for server
4) Run 'npm start' in the client directory
5) Run 'node server.js' in the server directory

# Key Functionalities
Creation of a new account uses jwt for verifying emails. Users can only login if their email is verified.


The admin (one admin for the whole site) has special permissions such as updating policies (DMCA, privacy, etc.), disabling user accounts, hiding reviews on public lists, granting admin privileges to other users, and all functionalities that a regular user has.


Non-logged in users can only search for heroes, and view the most recently created public lists.


Logged-in users can create lists of any number of superheroes, set these lists to private/public, and update every aspect of their own lists. They can also leave reviews on other public lists.
