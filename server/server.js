const express = require('express'); // require express
const app = express(); // create app
const PORT = 3001;
// require the json files
const superheroInfo = require('./superhero_info.json');
const superheroPowers = require('./superhero_powers.json');
const path = require('path'); // require path
const mongoose = require('mongoose'); // require mongoose
const cors = require('cors');
const bcrypt = require('bcrypt'); // require bcrypt for hashing
const jwt = require('jsonwebtoken'); // require jwt for authentication

// temporary key
const myKey = 'secret-key';

app.use(cors());

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/superheroes');

const db = mongoose.connection
// event listeners for connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// create a schema for created lists
const listSchema = new mongoose.Schema({
    list_name: { type: String, required: true },
    last_modified: Date,
    created_by: { type: String, required: true },
    number_of_heroes: { type: Number, default: 0 },
    public: { type: Boolean, default: false },
    description: { type: String, required: false }, 
    reviews: {
        type:[{
            rating: {type: Number, required: true },
            comment: {type: String, required: false },
            hidden: {type: Boolean, default: false },
            review_num: {type: Number, required: true},
            created_by: {type: String, required: true},
            date_created: {type : Date, required: true}
        }]
    },
    average_rating: Number,
    superheroes: {
        type: [{
            id: { type: Number, required: true },
            name: { type: String, required: true },
            Gender: String,
            'Eye color': String,
            Race: String,
            'Hair color': String,
            Height: Number,
            Publisher: String,
            'Skin color': String,
            Alignment: String,
            Weight: Number,
            Powers: [String],
        }],
        required: true,
        validate: [array => array.length > 0, 'At least one superhero is required'],
    },
});

const HeroLists = mongoose.model('List', listSchema);

// create a schema for user accounts
const accountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: String, // temporary
    deactivated: { type: Boolean, default: false },
    main_admin: {type: Boolean, default: false},
    admin_privileges: { type: Boolean, default: false },
    email_validated: { type: Boolean, default: false },
    verification_link: { type: String },
    number_of_lists: { type: Number, default: 0}
});

const UserAccounts = mongoose.model('User', accountSchema);

// create a schema for the security and privacy policy
const privacyPolicySchema = new mongoose.Schema({
    title: { type: String, default: 'Privacy and Security Policy' },
    content: { type: String, required: true },
    created_by: { type: String, required: true },
    created_on: { type: Date, required: true },
    last_updated_on: { type: Date, required: false },
    last_updated_by: { type: String, required: false}
}); 

const PrivacyPolicy = mongoose.model('PrivacyPolicy', privacyPolicySchema);

// create a schema for AUP
const acceptableUsePolicySchema = new mongoose.Schema({
    title: { type: String, default: 'Acceptible Use Policy (AUP)' },
    content: { type: String, required: true },
    created_by: { type: String, required: true },
    created_on: { type: Date, required: true },
    last_updated_on: { type: Date, required: false },
    last_updated_by: { type: String, required: false}
});

const AcceptibleUsePolicy = mongoose.model('AUP', acceptableUsePolicySchema);

// create a schema for DCMA
const DCMASchema = new mongoose.Schema({
    title: { type: String, default: 'DCMA Notice and Takedown Policy' },
    content: { type: String, required: true },
    created_by: { type: String, required: true },
    created_on: { type: Date, required: true },
    last_updated_on: { type: Date, required: false },
    last_updated_by: { type: String, required: false}
});

const DCMA = mongoose.model('DCMA', DCMASchema)

// create a schema for takedown requests, notices, and disputes
const requestsNoticesDisputesSchema = new mongoose.Schema({
    type: { type: String, required: true },
    request_id: { type: Number, required: true },
    date_received: { type: String, required: true },
    notes: { type: String, required: true },
    status: { type: String, required: true }
});

const RequestsNoticesDisputes = mongoose.model('RequestsNoticesDisputes', requestsNoticesDisputesSchema)

// middleware to parse JSON request bodies
app.use(express.json()); 

// middleware for logging for all routes
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// function to initialize the database with an admin account
const initializeAdminAccount = async () => {
    try {
      // check if an admin account already exists
      const existingAdmin = await UserAccounts.findOne({ username: 'admin' });
  
      if (!existingAdmin) {
        // if admin account does not exist, create one with a hashed password
        const saltRounds = 10;
        const adminPassword = 'admin'; // set password to admin
  
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
  
        const adminAccount = new UserAccounts({
            username: 'admin',
            email: 'admin@email.com',
            password: hashedPassword,
            main_admin: true,
            admin_privileges: true,
            email_validated: true, 
            verification_link: ''
        });
  
        // save the admin account to the database
        await adminAccount.save();

        // update verification_link for admin (just to follow the schema format)
        const verificationToken = jwt.sign({ username: 'admin' }, myKey, { expiresIn: '365d' });
        // update admin's verification link
        adminAccount.verification_link = verificationToken;
        await adminAccount.save();
  
        console.log('Admin account created successfully.');
      } else {
        console.log('Admin account already exists.');
      }
    } catch (error) {
      console.error('Error initializing admin account:', error.message);
    }
};

// post method to create a new account
app.post('/api/open/createaccount', async (req, res) => {
    try {
        // get the username, email, and password from the body
        const { email, username, password } = req.body;
    
        // check if the email is already taken
        const existingEmail = await UserAccounts.findOne({email: email});
        // check if the username is already taken
        const existingUsername = await UserAccounts.findOne({username: username});
        if (existingEmail) {
            return res.status(200).json({ message: 'Email already taken.' });
        }
        else if (existingUsername) {
            return res.status(200).json({ message: 'Username already taken.' });
        } else {
            // hash the password with bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            // create a new user account with the username, email, and the hashed password and save to db
            const newUser = new UserAccounts({
                username: username,
                email: email,
                password: hashedPassword,
                main_admin: false,
                admin_privileges: false,
                email_validated: false,
                verification_link: ''
            });
            await newUser.save();

            // generate verification token to be sent to frontend and used as link
            const verificationToken = jwt.sign({ email: newUser.email }, myKey, { expiresIn: '365d' });
            // update the user's verification link
            newUser.verification_link = verificationToken;
            await newUser.save();


            return res.status(200).json({ message: 'Account created successfully.',  verificationToken });
        }
    
    
    } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to verify user account
app.post('/api/secure/verifyemail', async (req, res) => {
    try {
        // get the token sent from frontend
        const {verificationToken} = req.body;

        // verify the token with my key
        const decoded = jwt.verify(verificationToken, myKey);

        // find the user with the decoded email
        const user = await UserAccounts.findOne({ email: decoded.email });

        // user not found
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // update the user's email_validated status to true
        user.email_validated = true;

        // save the updated user
        await user.save();
        return res.status(200).json({ message: `Email verified successfully for ${user.email}` });


    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    
});

// post method for login
app.post('/api/open/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserAccounts.findOne({ email });

        // if email does not exist
        if (!user) {
            return res.status(200).json({ message: 'An account with this email does not exist.' });
        }

        // compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // if password is incorrect
        if (!isPasswordValid) {
            return res.status(200).json({ message: 'Incorrect password.' });
        }
        // if account is deactivated
        if (user.deactivated) {
            return res.status(200).json({ message: `Account is deactivated, please contact the site administrator.` });
        }

        // if username and password are correct, and account is verified
        if (user.email_validated) {
            // send the verificationToken as data
            const verificationToken = user.verification_link;
            return res.status(200).json({ message: 'Login successful.', verificationToken });
        } else {
            const verificationToken = user.verification_link;
            return res.status(200).json({ message: 'Account is not verified.', verificationToken});
        }
        

    } catch (error) {
        console.error('Error finding user or validating password:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});
  
// post method to get username from JWT token
app.post('/api/secure/getusername', async (req, res) => {
    
    const {token} = req.body;
    try {
        // search for a user with the token
        const user = await UserAccounts.findOne({ verification_link: token });

        // if no user exists with that token
        if (!user) {
            return res.status(401).json({ message: 'An account with this token does not exist.' });
        }

        // return the username
        const username = user.username;
        return res.status(200).json({ message: 'User was found.', username});

    } catch (error) {
        console.error('Error occured:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to get admin_privileges of an account from JWT token
app.post('/api/secure/getprivileges', async (req, res) => {
    const {token} = req.body;
    try {
        // search for a user with the token
        const user = await UserAccounts.findOne({ verification_link: token });

        // if no user exists with that token
        if (!user) {
            return res.status(401).json({ error: 'An account with this token does not exist.' });
        }

        // return the privileges
        const privileges = user.admin_privileges;
        return res.status(200).json({ message: 'User was found.', privileges});

    } catch (error) {
        console.error('Error occured:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method for changing password
app.post('/api/secure/changepassword', async (req, res) => {
    try {
      const { verificationToken, currentPassword, newPassword } = req.body;
      
  
      // verify jwt token
      const decoded = jwt.verify(verificationToken, myKey);
  
      // find user with the decoded email
      const user = await UserAccounts.findOne({ username: decoded.username });
      
  
      // if user is not found
      if (!user) {
        return res.status(200).json({ message: 'User not found.' });
      }
  
      // check if the provided current password matches the one in the database for that user
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  
      // if password is incorrect
      if (!isPasswordValid) {
        return res.status(200).json({ message: 'Incorrect password.' });
      }
  
      // hash the new password to be saved
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
  
      // update and save the new password
      user.password = hashedNewPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// post method to get heroes by name (3b)
app.post('/api/open/search/:name?', (req, res) => {
    // get the name of the hero entered, as well as race, publisher, and power
    const name = req.params.name;
    const race = req.body.race;
    const publisher = req.body.publisher;
    const power = req.body.power;

    // create an empty list
    var heroesFilteredByName = [];

    // first, check if name is provided
    if (!name) {
        const allSuperheroes = superheroInfo
        // if name is not provided, add powers to each hero, then add all to the return list
        for (const hero of allSuperheroes) {
            hero.Powers = [];
            for(const heroPowers of superheroPowers) {
                if (hero.name === heroPowers.hero_names) {
                    for (let power in heroPowers) {
                        if (heroPowers[power] === "True") {
                            hero.Powers.push(power);
                        }
                    }
                }
            }
        }
        heroesFilteredByName = allSuperheroes;
    } else {
        const lowercaseName = name.toLowerCase().replace(/\s/g, ''); // convert to lowercase for case insensitivity
        // first find info of matched heroes
        // filter through info json, and find any matches for name independent of case (case-insensitivity)
        const matchedHeroes = superheroInfo.filter(hero => {
            const heroName = hero.name.toLowerCase().replace(/\s/g, '');
            // add heroes that match name
            return heroName.startsWith(lowercaseName);
        });

        // we now must add the powers of each hero in matchedHeroes
        // loop through all matched heroes
        for (const matchedHero of matchedHeroes) {
            matchedHero.Powers = [];
            for (const heroPowers of superheroPowers) {
                // find the matched hero in the powers json 
                if (matchedHero.name === heroPowers.hero_names) {
                    // only add true powers of that hero
                    for (let power in heroPowers) {
                        if (heroPowers[power] === "True") {
                            matchedHero.Powers.push(power);
                        }
                    }
                }
            }
        }
        heroesFilteredByName = matchedHeroes;
    }    

    // create empty list
    var heroesFilteredByRace = [];
    // we now have a list of the matched heroes by name, let's filter by race now
    if (!race) {
        // if no race was entered, just keep the same list of heroes (filtered by just name)
        heroesFilteredByRace = heroesFilteredByName;
    } else {
        // if race is entered, filter the list by race
        const lowercaseRace = race.toLowerCase().replace(/\s/g, '');
        // loop through heroes of the list, and check if there race matches
        for (const hero of heroesFilteredByName) {
            // if race matches, add the hero to the new list
            if (hero.Race.toLowerCase().replace(/\s/g, '').startsWith(lowercaseRace)) {
                heroesFilteredByRace.push(hero);
            }
        }
    }

    // create empty list 
    var heroesFilteredByPublisher = [];
    // we now have a list of the matched heroes by name and race, let's filter by publisher now
    if (!publisher) {
        // if no publisher was entered, just keep the same list of heroes (filtered by name and publisher)
        heroesFilteredByPublisher = heroesFilteredByRace;
    } else {
        // if publisher is entered, filter the list by publisher
        const lowercasePublisher = publisher.toLowerCase().replace(/\s/g, '');
        // loop through heroes of the list, and check if there publisher matches
        for (const hero of heroesFilteredByRace) {
            // if publisher matches, add the hero to the new list
            if (hero.Publisher.toLowerCase().replace(/\s/g, '').startsWith(lowercasePublisher)) {
                heroesFilteredByPublisher.push(hero);
            }
        }
    }

    // create empty list
    var heroesFilteredByPower = [];
    // we now have a list of the matched heroes by name, race, and publisher, let's filter by power now
    if (!power) {
        // if no power is entered, just keep the same list
        heroesFilteredByPower = heroesFilteredByPublisher;
    } else {
        // if power was entered, filter list by power
        const lowercasePower = power.toLowerCase().replace(/\s/g, '');
        // loop through heroes of the list, check if they have the power
        for (const hero of heroesFilteredByPublisher) {
            for (const power of hero.Powers) {
                if (power.toLowerCase().replace(/\s/g, '').includes(lowercasePower)) {
                    heroesFilteredByPower.push(hero);
                }
            }
        }
    }

    if (heroesFilteredByPower) {
        res.send(heroesFilteredByPower);
    } else {
        const msg = `Superhero with name: ${name} was not found!`;
        const obj = {
            "message": msg
        }
        res.status(404).send(obj);
    }
});


// post method to create a list
app.post('/api/secure/createlist', async (req, res) => {
    
    try {
        // get the username of the list creator, list name, description, and first hero to add
        const { username, listName, description, heroId } = req.body;

        // check if a list with the same name already exists
        const existingList = await HeroLists.findOne({ list_name: listName });

        // if the list already exists
        if (existingList) {
            return res.status(200).json({ message: 'A list with the same name already exists' });
        }

        // get the hero by the id given
        const superhero = superheroInfo.find(s => s.id === parseInt(heroId));
       

        if (!superhero) {
            return res.status(200).json({ message: `Hero with id ${heroId} does not exist.`})
        }

        // add the powers
        superhero.Powers = [];
        const heroName = superhero.name;
            for (const heroPowers of superheroPowers) {
                // find the matched hero in the powers json 
                if (heroName === heroPowers.hero_names) {
                    // only add true powers of that hero
                    for (let power in heroPowers) {
                        if (heroPowers[power] === "True") {
                            superhero.Powers.push(power);
                        }
                    }
                }
            }
   
        // get the user who is creating the list 
        const user = await UserAccounts.findOne({ username: username });

        // if the user has less than 20 lists, create the new one
        if (user.number_of_lists < 20) {

            // create a date object for last_modified
            const currentDate = new Date();
            // create a new list object
            const newList = new HeroLists({
                list_name: listName,
                last_modified: currentDate,
                created_by: username,
                superheroes: [superhero], // add the provided hero to the list
                number_of_heroes: 1
            });

            // if description was provided, update it 
            if (description) {
                newList.description = description;
            } 
            // save the new list to the database
            await newList.save();
            
            // increment the number of lists the user has created by 1
            user.number_of_lists += 1;

            const savedUser = await user.save();

            return res.status(200).json({ message: 'List created successfully' });
        } else {
            return res.status(200).json({message: 'You have already created 20 lists. Delete a list to make another.'});
        }

        
    } catch (error) {
        console.error('Error occured:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to edit description of a list
app.post('/api/secure/editlistdescription', async (req, res) => {
    try {
        const { username, listName, description } = req.body;

        // check if the list exists and is created by the current user's username
        const existingList = await HeroLists.findOne({ list_name: listName, created_by: username });

        if (!existingList) {
            return res.status(200).json({ message: 'List not found or or not created by you.' });
        }

        // create a date object for last_modified
        const currentDate = new Date();

        // update description and last_modified for the list
        existingList.description = description;
        existingList.last_modified = currentDate;

        // save the list
        const savedList = await existingList.save();

        return res.status(200).json({ message: `Description for ${listName} updated successfully.`, list: savedList });
    } catch (error) {
        console.error('Error occured:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to add hero to a list
app.post('/api/secure/addherotolist', async (req, res) => {
    try {
        const { username, listName, heroId } = req.body;

        // check if the list exists and is created by the current user's username
        const existingList = await HeroLists.findOne({ list_name: listName, created_by: username });

        if (!existingList) {
            return res.status(200).json({ message: 'List not found or or not created by you.' });
        }

        // get the hero entered
        const superhero = superheroInfo.find(s => s.id === parseInt(heroId));

        // check if the hero already exists in the list
        const heroAlreadyInList = existingList.superheroes.some(hero => hero.id === superhero.id);

        if (heroAlreadyInList) {
            return res.status(200).json({ message: `${superhero.name} is already in the list: ${listName}` });
        }

        // if hero does not exist
        if (!superhero) {
            return res.status(200).json({ message: `Hero with id ${heroId} does not exist.` });
        }

        // add the powers to the superhero
        superhero.Powers = [];
        const heroName = superhero.name;
        for (const heroPowers of superheroPowers) {
            // find the matched hero in the powers json
            if (heroName === heroPowers.hero_names) {
                // only add true powers of that hero
                for (let power in heroPowers) {
                    if (heroPowers[power] === 'True') {
                        superhero.Powers.push(power);
                    }
                }
            }
        }

        // create a date object for last_modified
        const currentDate = new Date();

        // add the hero to the list's 'superheroes' array
        existingList.superheroes.push(superhero);
        existingList.number_of_heroes += 1;
        existingList.last_modified = currentDate;

        // save the updated list
        const savedList = await existingList.save();

        return res.status(200).json({ message: `${superhero.name} added successfully.`, list: savedList });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to delete a hero from a list
app.post('/api/secure/deleteherofromlist', async (req, res) => {
    try {  
        const { username, listName, heroId } = req.body;

        // check if a list with the specified name and created_by username exists
        const existingList = await HeroLists.findOne({ list_name: listName, created_by: username });

        // if list does not exist
        if (!existingList) {
            return res.status(200).json({ message: 'List not found or not created by you.' });
        }

        // get the hero entered
        const superhero = superheroInfo.find(s => s.id === parseInt(heroId));

        // if hero does not exist
        if (!superhero) {
            return res.status(200).json({ message: `Hero with id ${heroId} does not exist.` });
        }

        // check if the hero with the ID exists in the list
        const heroIndex = existingList.superheroes.findIndex(hero => hero.id === parseInt(heroId));

        if (heroIndex === -1) {
            return res.status(200).json({ message: `${superhero.name} does not exist in list: ${listName}` });
        }
        
        // if only one hero exists in the list, do not delete it
        if (existingList.number_of_heroes === 1) {
            return res.status(200).json({ message: `You cannot delete this hero from the list as it is the last hero in the list.` });
        }

        // create a date object for last_modified
        const currentDate = new Date();

        // delete the hero from the list's superheroes array
        existingList.superheroes.splice(heroIndex, 1);
        existingList.number_of_heroes -= 1;
        existingList.last_modified = currentDate;

        // save the updated list
        const savedList = await existingList.save();

        return res.status(200).json({ message: ` ${superhero.name} deleted from the list successfully.`, list: savedList });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

// post method to set the privacy of a list to private
app.post('/api/secure/setlisttoprivate', async (req, res) => {
    try {
        const { username, listName } = req.body;

        // check if a list with the specified name and created_by username exists
        const existingList = await HeroLists.findOne({ list_name: listName, created_by: username });

        // if list does not exist
        if (!existingList) {
            return res.status(200).json({ message: 'List not found or not created by you.' });
        }
        
        // if list is already set to private
        if (!existingList.public) {
            return res.status(200).json({ message: `${listName} is already set to private.` });
        }

        // create a date object for last_modified
        const currentDate = new Date();

        // set the list to private
        existingList.public = false;
        existingList.last_modified = currentDate;
        const savedList = await existingList.save()

        return res.status(200).json({ message: `${listName} has been set to private.` });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to set the privacy of a list to public
app.post('/api/secure/setlisttopublic', async (req, res) => {
    try {
        const { username, listName } = req.body;

        // check if a list with the specified name and created_by username exists
        const existingList = await HeroLists.findOne({ list_name: listName, created_by: username });

        // if list does not exist
        if (!existingList) {
            return res.status(200).json({ message: 'List not found or not created by you.' });
        }
        
        // if list is already set to public
        if (existingList.public) {
            return res.status(200).json({ message: `${listName} is already set to public.` });
        }

        // create a date object for last_modified
        const currentDate = new Date();

        // set the list to public
        existingList.public = true;
        existingList.last_modified = currentDate;
        const savedList = await existingList.save()

        return res.status(200).json({ message: `${listName} has been set to public.` });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to delete a list
app.post('/api/secure/deleteList', async (req, res) => {
    try {
        const { username, listName } = req.body;

        // check if a list with the specified name and created_by username exists
        const existingList = await HeroLists.findOne({ list_name: listName, created_by: username });

        // if list does not exist
        if (!existingList) {
            return res.status(200).json({ message: 'List not found or not created by you.' });
        }

        // delete the list
        await existingList.deleteOne();

        // decrement created lists by that user by 1
        const user = await UserAccounts.findOne({ username: username });
        user.number_of_lists -= 1;
        const savedUser = await user.save();


        return res.status(200).json({ message: `${listName} deleted successfully.` });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to display all lists created by a single user
app.post('/api/secure/displayuserlists', async (req, res) => {
    try {
        const {username} = req.body;
        // find all lists created by the user
        const userLists = await HeroLists.find({ created_by: username });

        return res.status(200).json({ lists: userLists });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

// post method to grant site manager to other users as the admin
app.post('/api/admin/grantsitemanager', async (req, res) => {

    try {
        // get the jwt token of the admin and username of the user to grant site manager to
        const { adminToken, username} = req.body;

        // check if the provided token matches the admin token
        const admin = await UserAccounts.findOne({ username: 'admin', verification_link: adminToken });

        // if the token does not match the admin token
        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to grant site manager to users.'} );
        }

        // find the user to grant site manager to
        const user = await UserAccounts.findOne({ username: username });
        
        if (!user) {
            return res.status(200).json( { message: `${username} does not exist.`} );
        }

        if (user.admin_privileges === true) {
            return res.status(200).json( { message: `${username} is already a site manager.`} );
        }

        // grant admin privileges and save user
        user.admin_privileges = true;
        const savedUser = user.save();

        return res.status(200).json( { message: `Site manager granted to ${username}`, savedUser} )

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to revoke site manager to other users as the admin
app.post('/api/admin/revokesitemanager', async (req, res) => {

    try {
        // get the jwt token of the admin and username of the user to grant site manager to
        const { adminToken, username} = req.body;

        // check if the provided token matches the admin token
        const admin = await UserAccounts.findOne({ username: 'admin', verification_link: adminToken });

        // if the token does not match the admin token
        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to revoke site manager to users.'} );
        }

        // find the user to revoke site manager from
        const user = await UserAccounts.findOne({ username: username });
        
        if (!user) {
            return res.status(200).json( { message: `${username} does not exist.`} );
        }

        if (user.admin_privileges === false) {
            return res.status(200).json( { message: `${username} is already not a site manager.`} );
        }

        // revoke admin privileges and save user
        user.admin_privileges = false;
        const savedUser = user.save();

        return res.status(200).json( { message: `Site manager revoked from ${username}`, savedUser} )

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// post method to enable a user 
app.post('/api/admin/enableuser', async (req, res) => {
    try {
    
        // get the jwt token of the admin and username of the user to enable
        const {adminToken, username} = req.body;

        // check if the provided token matches the admin token
        const admin = await UserAccounts.findOne({ verification_link: adminToken, admin_privileges: true });

        // if the token does not match the admin token
        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to enable users.'} );
        }

        // find the user to enable
        const user = await UserAccounts.findOne({ username: username });
        
        if (!user) {
            return res.status(200).json( { message: `${username} does not exist.`} );
        }

        // if this user is already enabled
        if (user.deactivated === false) {
            return res.status(200).json( { message: `${username}'s account is already enabled.`} );
        }

        // enable the user and save
        user.deactivated = false;
        const savedUser = await user.save();

        return res.status(200).json( { message: `${username}'s account has been enabled.`} )

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to disable a user 
app.post('/api/admin/disableuser', async (req, res) => {
    try {
        // get the jwt token of the admin and username of the user to disable
        const {adminToken, username} = req.body;

        // check if the provided token matches a user with admin privileges
        const admin = await UserAccounts.findOne({ verification_link: adminToken, admin_privileges: true });

        // if the token does not match user with privileges
        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to disable users.'} );
        }

        // find the user to disable
        const user = await UserAccounts.findOne({ username: username });
        
        if (!user) {
            return res.status(200).json( { message: `${username} does not exist.`} );
        }

        // if this user is already disabled
        if (user.deactivated === true) {
            return res.status(200).json( { message: `${username}'s account is already disabled.`} );
        }

        // enable the user and save
        user.deactivated = true;
        const savedUser = await user.save();

        return res.status(200).json( { message: `${username}'s account has been disabled.`} )

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to get all lists (for admin purposes)
app.post('/api/admin/getalllists', async (req, res) => {
    try {
        const {adminToken} = req.body;

        // check if the provided token matches a user with admin privileges
        const admin = await UserAccounts.findOne({ admin_privileges: true, verification_link: adminToken });

        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to view all lists.'} );
        }

        // get all lists in the db
        const userLists = await HeroLists.find();

        return res.status(200).json({ lists: userLists });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get method to return 10 most recently modified lists
app.get('/api/open/getrecentlists', async (req, res) => {
    try {
        // find the 10 most recently modified lists, sorted in descending order (only public lists)
        const recentlyModifiedLists = await HeroLists
        .find({ public: true })
        .sort({ last_modified: -1 })
        .limit(10);
       
        // return the lists
        return res.status(200).json({ recentlyModifiedLists });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

// post method to mark a review as hidden
app.post('/api/admin/hidereview', async (req, res) => {
    try {
        const { adminToken, listName, reviewNumber } = req.body;

        // check if the provided token matches a user with admin privileges
        const admin = await UserAccounts.findOne({ admin_privileges: true, verification_link: adminToken });

        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to hide a review.'} );
        }

        // find the list by name
        const list = await HeroLists.findOne({ list_name: listName });

        // if no list exists
        if (!list) {
            return res.status(200).json({ message: 'List not found.' });
        }

        // find the review by review_num
        const reviewIndex = list.reviews.findIndex(review => review.review_num === reviewNumber);

        // if no review exists
        if (reviewIndex === -1) {
            return res.status(200).json({ message: 'Review not found in the list.' });
        }

        // if review is already hidden
        if (list.reviews[reviewIndex].hidden === true) {
            return res.status(200).json({ message: 'Review is already hidden.' });
        }

        // mark the review as hidden
        list.reviews[reviewIndex].hidden = true;

        // save the updated list
        await list.save();

        return res.status(200).json({ message: 'Review hidden successfully.' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

// post method to unhide a review
app.post('/api/admin/unhidereview', async (req, res) => {
    try {
        const { adminToken, listName, reviewNumber } = req.body;

        // check if the provided token matches a user with admin privileges
        const admin = await UserAccounts.findOne({ admin_privileges: true, verification_link: adminToken });

        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to hide a review.'} );
        }

        // find the list by name
        const list = await HeroLists.findOne({ list_name: listName });

        // if no list exists
        if (!list) {
            return res.status(200).json({ message: 'List not found.' });
        }

        // find the review by review_num
        const reviewIndex = list.reviews.findIndex(review => review.review_num === reviewNumber);

        // if no review exists
        if (reviewIndex === -1) {
            return res.status(200).json({ message: 'Review not found in the list.' });
        }

        // if review is already unhidden
        if (list.reviews[reviewIndex].hidden === false) {
            return res.status(200).json({ message: 'Review is already unhidden.' });
        }

        // mark the review as unhidden
        list.reviews[reviewIndex].hidden = false;

        // save the updated list
        await list.save();

        return res.status(200).json({ message: 'Review unhidden successfully.' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});


// post method to leave a review on a list 
app.post('/api/secure/addreviewtolist', async (req, res) => {
    try {
        const { username, listName, reviewComment, reviewRating } = req.body;

        // find the list by name
        const list = await HeroLists.findOne({ list_name: listName });

        // if list does not exist
        if (!list) {
            return res.status(200).json({ message: 'List not found.' });
        }

        // create a date object for date_created
        const currentDate = new Date();

        // create a new review object
        const newReview = {
            rating: reviewRating,
            comment: reviewComment,
            hidden: false,
            review_num: list.reviews.length, // will increment after each review is added (unique id for reviews basically)
            created_by: username,
            date_created: currentDate
        };

        // add the review to the list's reviews array
        list.reviews.push(newReview);

        // update the average rating
        const totalRating = list.reviews.reduce((sum, review) => sum + review.rating, 0);
        list.average_rating =  parseFloat((totalRating / list.reviews.length).toFixed(1));

        // save list
        await list.save();

        return res.status(200).json({ message: 'Review added successfully.'})

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

// post method to create a new security and privacy policy for admins/SMs
app.post('/api/admin/createprivacypolicy', async (req, res) => {
    try {
        const { adminToken, policyContent} = req.body;

        // check if the provided token matches a user with admin privileges
        const admin = await UserAccounts.findOne({ admin_privileges: true, verification_link: adminToken });

        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to create policies.'} );
        }

        // check if policy already exists
        const existingPolicy = await PrivacyPolicy.findOne();
        if (existingPolicy) {
            return res.status(200).json( { message: 'A privacy policy already exists. You cannot create another, but you can update it.'} );
        }

        // create a date object for created_on
        const currentDate = new Date();

        // create a new policy object
        const newPolicy = new PrivacyPolicy({
            content: policyContent,
            created_by: admin.username,
            created_on: currentDate
        });

        await newPolicy.save();

        return res.status(200).json( { message: 'Security/Privacy Policy successfully created.'} );
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to update security and privacy policy for admins/SMs
app.post('/api/admin/updateprivacypolicy', async (req, res) => {
    try {
        const { adminToken, policyContent} = req.body;

        // check if the provided token matches a user with admin privileges
        const admin = await UserAccounts.findOne({ admin_privileges: true, verification_link: adminToken });

        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to update policies.'} );
        }

        // get the policy object
        const existingPolicy = await PrivacyPolicy.findOne();

        // create a date object for last_modified
        const currentDate = new Date();
        existingPolicy.last_updated_on = currentDate;
        existingPolicy.last_updated_by = admin.username;
        existingPolicy.content = policyContent;

        await existingPolicy.save();

        return res.status(200).json( { message: 'Security/Privacy Policy successfully updated.'} );

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get method to get the content of the privacy policy
app.get('/api/open/getprivacypolicy', async (req, res) => {
    try {
        // get the policy object
        const existingPolicy = await PrivacyPolicy.findOne();
        
        if (!existingPolicy) {
            return res.status(200).json( { message: 'Security/Privacy Policy does not exist.'} );
        }

        // return the content of the policy
        return res.status(200).json( {content: existingPolicy.content} );

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    

});


// post method to create a new AUP
app.post('/api/admin/createaup', async (req, res) => {
    try {
        const { adminToken, policyContent} = req.body;

        // check if the provided token matches a user with admin privileges
        const admin = await UserAccounts.findOne({ admin_privileges: true, verification_link: adminToken });

        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to create policies.'} );
        }

        // check if policy already exists
        const existingAUP = await AcceptibleUsePolicy.findOne();
        if (existingAUP) {
            return res.status(200).json( { message: 'An AUP already exists. You cannot create another, but you can update it.'} );
        }

        // create a date object for created_on
        const currentDate = new Date();

        // create a new AUP object
        const newAUP = new AcceptibleUsePolicy({
            content: policyContent,
            created_by: admin.username,
            created_on: currentDate
        });

        await newAUP.save();

        return res.status(200).json( { message: 'Acceptible Use Policy (AUP) successfully created.'} );
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to update AUP
app.post('/api/admin/updateaup', async (req, res) => {
    try {
        const { adminToken, policyContent} = req.body;

        // check if the provided token matches a user with admin privileges
        const admin = await UserAccounts.findOne({ admin_privileges: true, verification_link: adminToken });

        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to update policies.'} );
        }

        // get the AUP object
        const existingAUP = await AcceptibleUsePolicy.findOne();

        // create a date object for last_modified
        const currentDate = new Date();
        existingAUP.last_updated_on = currentDate;
        existingAUP.last_updated_by = admin.username;
        existingAUP.content = policyContent;

        await existingAUP.save();

        return res.status(200).json( { message: 'Acceptible Use Policy (AUP) successfully updated.'} );

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get method to get the content of the AUP
app.get('/api/open/getaup', async (req, res) => {
    try {
        // get the policy object
        const existingAUP = await AcceptibleUsePolicy.findOne();
        
        if (!existingAUP) {
            return res.status(200).json( { message: 'Acceptible Use Policy (AUP) does not exist.'} );
        }

        // return the content of the AUP
        return res.status(200).json( {content: existingAUP.content} );

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to create a new DCMA
app.post('/api/admin/createdcma', async (req, res) => {
    try {
        const { adminToken, policyContent} = req.body;

        // check if the provided token matches a user with admin privileges
        const admin = await UserAccounts.findOne({ admin_privileges: true, verification_link: adminToken });

        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to create policies.'} );
        }

        // check if DCMA already exists
        const existingDCMA = await DCMA.findOne();
        if (existingDCMA) {
            return res.status(200).json( { message: 'A DCMA already exists. You cannot create another, but you can update it.'} );
        }

        // create a date object for created_on
        const currentDate = new Date();

        // create a new AUP object
        const newDCMA = new DCMA({
            content: policyContent,
            created_by: admin.username,
            created_on: currentDate
        });

        await newDCMA.save();

        return res.status(200).json( { message: 'DCMA Notice and Takedown Policy successfully created.'} );
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post method to update DCMA
app.post('/api/admin/updatedcma', async (req, res) => {
    try {
        const { adminToken, policyContent} = req.body;

        // check if the provided token matches a user with admin privileges
        const admin = await UserAccounts.findOne({ admin_privileges: true, verification_link: adminToken });

        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to update policies.'} );
        }

        // get the AUP object
        const existingDCMA = await DCMA.findOne();

        // create a date object for last_modified
        const currentDate = new Date();
        existingDCMA.last_updated_on = currentDate;
        existingDCMA.last_updated_by = admin.username;
        existingDCMA.content = policyContent;

        await existingDCMA.save();

        return res.status(200).json( { message: 'DCMA successfully updated.'} );

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get method to get the content of the DCMA
app.get('/api/open/getdcma', async (req, res) => {
    try {
        // get the DCMA object
        const existingDCMA = await DCMA.findOne();
        
        if (!existingDCMA) {
            return res.status(200).json( { message: 'DCMA does not exist.'} );
        }

        // return the content of the DCMA
        return res.status(200).json( {content: existingDCMA.content} );

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

var currentId = 0;

// post method to create a new request, notice, or dispute in the db
app.post('/api/admin/logdcmarequest', async (req, res) => {
    try {

         
        const { adminToken, type, dateReceived, notes, status } = req.body;

        // check if the provided token matches a user with admin privileges
        const admin = await UserAccounts.findOne({ admin_privileges: true, verification_link: adminToken });

        if (!admin) {
            return res.status(200).json( { message: 'You do not have the privileges to update policies.'} );
        }

        // create the request
        const newRequest = new RequestsNoticesDisputes({
            type: type,
            request_id: currentId,
            date_received: dateReceived,
            notes: notes,
            status: status
        });

        await newRequest.save();

        currentId+=1;
        
        return res.status(200).json( {message: 'New DCMA request saved.'} );
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// initialize admin upon server start
initializeAdminAccount().then(() => {
    app.listen(PORT, () => {
      console.log('Server is running on port', PORT);
    });
});
