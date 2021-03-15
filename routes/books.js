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

/* GET List of all books page and home*/
router.get('/', asyncHandler(async (req, res) => {
  let books = await Book.findAll();
  res.render('index', {title:'Books', books})
}));

/* GET Create a new book page */
router.get('/new',(req, res) => {
  res.render('new-book', {title:'New Book'});
});

/* POST Add new book to database */
router.post('/new', asyncHandler(async (req, res) => {
  try {
    //create a new book
    await Book.create(req.body);
    //res.status(201).json({ "message": "Book added successfully!" });
    res.redirect('/books');
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      //display form with errors
      console.log(req.body);
      res.status(400).render('new-book', { errors, book: req.body});   
    } else {
      throw error;
    }
  }
}));

/* GET Book details form */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  //res.json(book); //verifies book data sucessfully pulled from database
  if(book){

    res.render('book-detail', {title:book.title, book});
  }
  else{
    res.render('page-not-found');
  }
  
}));

/* POST Update book info to database */
router.post('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    await book.update(req.body);
    res.redirect('/books');
  }
  else{
    res.sendStatus(400); //sends 404 error if book does not exist
  }
}));

/* POST Delete book from database */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  
  const book = await Book.findByPk(req.params.id);
  
  if(book){
    await book.destroy();
    res.redirect('/books');
  }
  else{
    res.sendStatus(400);
  }
}));

/* POST Search for a book */
router.post('/search', asyncHandler(async (req, res) => {
  console.log('yo');
}));

module.exports = router;
