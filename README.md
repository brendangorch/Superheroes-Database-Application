# Superheroes-Database-Application
A full-stack application for creating accounts, searching for superheroes, and creating public customized lists from a document of hundreds of heroes (from Kaggle). The back-end was developed using node.js, express, mongodb, and bcrypt + jwt for security. The front-end was developed using react with JavaScript. Follows REST principles.

![image](https://github.com/brendangorch/Superheroes-Database-Application/assets/145873615/61b40ba6-8d8c-4ff2-854b-a72c19b6c036)




# Steps for Running the Program
1) Download all the files from the client and server folders (make sure to install the exact directories)
2) Run 'npm install' in the terminal while in the directory for client
3) Repeat step 2 but in the directory for server
4) Run 'npm start' in the client directory
5) Run 'node server.js' in the server directory

# Key Functionalities
Creation of a new account uses jwt for verifying emails. Users can only login if their email is verified.
<br/>
<br/>
![image](https://github.com/brendangorch/Superheroes-Database-Application/assets/145873615/3481c793-5b51-4f75-8255-da0d83fb7084)
<br/>
<br/>
The admin (one admin for the whole site) has special permissions such as updating policies (DMCA, privacy, etc.), disabling user accounts, hiding reviews on public lists, granting admin privileges to other users, and all functionalities that a regular user has.
<br/>
<br/>

<br/>
<br/>
Non-logged in users can only search for heroes, and view the most recently created public lists.
<br/>
<br/>
![image](https://github.com/brendangorch/Superheroes-Database-Application/assets/145873615/19b8b146-acb6-485e-b808-22563db8d5e9)
<br/>
![image](https://github.com/brendangorch/Superheroes-Database-Application/assets/145873615/e2247cc0-1f75-4f75-bab8-f5eed418b1ff)
<br/>
<br/>
Logged-in users can create lists of any number of superheroes, set these lists to private/public, and update every aspect of their own lists. They can also leave reviews on other public lists.
<br/>
<br/>

<br/>
<br/>
