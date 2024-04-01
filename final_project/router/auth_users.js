const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let similarusers = users.filter((user)=>{
      return user.username === username
    });
    if(similarusers.length > 0){
      return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      }
      return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
        return res.status(400).json({message: "Error logging in, field required"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 100 });
  
      req.session.authorization = {
        accessToken,username
    }
      return res.status(200).send("User logged in");
    } else {
      return res.status(208).json({message: "Invalid Login"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let info = req.query.review;
  const username = req.session.authorization.username;

  if(books){
    let book = books[isbn];
    let newReview = {"username":username,"review":info};
    
    if((typeof book.reviews === "object" && Object.keys(book.reviews).length === 0)|| book.reviews === []){
        book.reviews = [];
        book.reviews.push(newReview);
    } else {
        let index = book.reviews.map((rev) => rev.username).indexOf(username);
        if(index >=0 ){
            book.reviews[index] = newReview;
            return res.status(200).json({message: "Review Updated"});
        }
        else{
            book.reviews.push(newReview);
        }
    }
    return res.status(200).json({message: "Review Added"});
  }
  return res.status(500).json({message: "Error No Books"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    let isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if(books){
        let book = books[isbn];
        
        if((typeof book.reviews === "object" && Object.keys(book.reviews).length === 0)|| book.reviews === []){
            return res.status(400).json({message: "No Review Found"});
        } else {
            book = book.reviews.map((rev) => rev.username !== username);
            return res.status(200).json({message: "Review removed"});
        }
      }
      return res.status(500).json({message: "Error No Books"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
