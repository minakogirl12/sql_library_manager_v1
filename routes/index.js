var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

// Handler function to wrap each route.
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  let books = await Book.findAll();
  res.json(books);
}));

/* GET List of all books page */
router.get('/books', asyncHandler(async (req, res) => {
  let books = await Book.findAll();
  res.render('all_books', {title:'Books', books})
}));

/* GET Create a new book page */
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', {title:'New Book'})
}));

/* POST Add new book to database */
router.post('/books/new', asyncHandler(async (req, res) => {
  try {
    //create a new book
    await Book.create(req.body);
    res.status(201).json({ "message": "Book added successfully!" });
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

/* GET Book details form */
router.get('/books/:id', asyncHandler(async (req, res) => {
}));

/* POST Update book info to database */
router.post('/books/:id', asyncHandler(async (req, res) => {
}));

/* POST Delete book from database */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
}));


module.exports = router;
