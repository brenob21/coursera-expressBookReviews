const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios_url = "https://brenobaldass-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"

public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred"});
      } else {
        return res.status(400).json({message: "User already exists!"});    
      }
    } 
    return res.status(400).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    if(books) return res.status(200).json({books: books});
    return res.status(400).json({message: "no books found"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
        if(books) {
            let isbn = req.params.isbn;
            let book = books[isbn];
            if(book) return res.status(200).json({books: book});
        }
    return res.status(400).json({message: "no book found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    if(books){
        let author = req.params.author;
        let values = Object.values(books);
        let book = values.filter( book => book.author === author);
        if(book) return res.status(200).json({book: book});
    }
    return res.status(400).json({message: "no book found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) { 
    if(books){
        let title = req.params.title;
        let values = Object.values(books);
        let book = values.filter( book => book.title === title);
        if(book) return res.status(200).json({book: book});
    }
    return res.status(400).json({message: "no book found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    if(books){
        let isbn = req.params.isbn;
        let book = books[isbn];
        if(book) return res.status(200).json({book_reviews: book.reviews});
    }
    return res.status(400).json({message: "no book found"});
});



const allBooks = async () => {
   let res = await axios.get(`${axios_url}/`);
   console.log(res.data);
}
const booksByISBN = async () => {
    let res = await axios.get(`${axios_url}/isbn/1`);
    console.log(res.data);
}
const booksByAuthor = async () => {
    let res = await axios.get(`${axios_url}/author/Jane Austen`)
    console.log(res.data);
}
const booksByTitle = async () => {
    let res = await axios.get(`${axios_url}/title/Pride and Prejudice`);
    console.log(res.data);
}

console.log(booksByTitle());
module.exports.general = public_users;
