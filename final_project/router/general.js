
//General 


const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    if (users.find(user => user.username === req.body.username)) {
        return res.send("User name already exists")
    }

    if (!req.body.username) {
        return res.send("User name cannot be empty. ")
    }

    if (!req.body.password) {
        return res.send("Password cannot be empty. ")
    }

    users.push({ "username": req.body.username, "password":req.body.password });

    return res.send("New user account " + (' ')+ (req.body.username) + " is registered successfully!")
 });


// Get the book list available in the shop
public_users.get('/', async function (req, res) {    
    const getBooks = () => {
        return new Promise( (resolve, reject) => {
            setTimeout(() => {
                const bookStore = Object.entries(books);
                if(bookStore) {
                    resolve(bookStore)
                }
                else{ 
                    reject('error');
                }
            }, 500);
        });
        
    }

    getBooks().then((booklist) => {
        res.status(300).json({ books: booklist });
    })
    .catch(err => {
        res.status(500).json({ message: err });
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    const getBooks = () => {
        return new Promise( (resolve, reject) => {
            setTimeout(() => {
                const result = Object.entries(books).find(book => book[0] == isbn)
                if (result) {
                    resolve(result)
                }
                else{ 
                    reject('sorry, no matching book found with the given ISBN.');
                }
            }, 500);
            
        });
        
    }

    getBooks().then((result) => {
        res.status(200).json({ result });
    })
    .catch(err => {
        res.status(500).json({ message: err });
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = decodeURIComponent(req.params.author);
    console.log({ author })
    
    const getBooks = () => {
        
        return new Promise( (resolve, reject) => {
            //filters book based on author
            setTimeout(() => {
                const result = Object.entries(books).find(book => book[1].author === author)
            
                if (result) {
                    resolve(result)
                }
            else{ 
                reject('sorry, no matching book found with the given author name.');
            }
            },500)
        });        
    }

    getBooks().then((result) => {
        res.status(200).json({ result });
    })
    .catch(err => {
        res.status(500).json({ message: err });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = decodeURIComponent(req.params.title);

    const getBooks = () => {
        
        return new Promise( (resolve, reject) => {
            setTimeout(() => {
                //filters book based on title

                const result = Object.entries(books).find(book => book[1].title === title)
            
                if (result) {
                    resolve(result)
                }
                else{ 
                    reject('sorry, no matching book found with the given title.');
                }
            },500)
        });        
    }

    getBooks().then((result) => {
        res.status(200).json({ result });
    })
    .catch(err => {
        res.status(500).json({ message: err });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const result = Object.entries(books).find(book => book[0] === isbn)
    console.log({ result })
    const reviews = result[1].reviews;
  return res.status(200).json({  reviews });
});

module.exports.general = public_users;

