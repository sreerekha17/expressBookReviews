// auth users

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    username: 'JLovato11',
    password: 'abcd1234!@#$'
}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const user = req.body.username;
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 6000 * 6000 });
    
    req.session.authorization = {
        accessToken
    };

    return res.status(200).send("You have successfully logged in!");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    console.log('req', req.user, req.user?.data)
    const isbn = req.params.isbn;
    const review = req.body.data;
    
    // finds the book by isbn
    const result = Object.entries(books).find(book => book[0] === isbn);

    //Retrieves username from session
    const userId = req.user?.data;
    
    // adding to the selected book based on ISBN
    result[1].reviews[userId] = review;

    return res.status(200).send({
        message: 'Your review has been submitted successfully!',
        reviews: result[1]?.reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    // finds the book by isbn
    const result = Object.entries(books).find(book => book[0] === isbn)
    const userId = req.user?.data;
    
    if (result[1].reviews[userId]) {
        delete result[1].reviews[userId];
    }

    return res.status(200).send({
        message: 'Your review has been deleted successfully!',
        reviews: result[1].reviews,
        book: result
    });


})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

