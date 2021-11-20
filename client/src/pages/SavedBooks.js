import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Auth from '../utils/auth';
import { getSavedBookIds, removeBookId } from '../utils/localStorage';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {};
  
  const [deleteBook] = useMutation(DELETE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook({
        variables: { bookId }
      });


      // upon success, remove book's id from localStorage and update savedBookIds state
      removeBookId(bookId);
      setSavedBookIds(getSavedBookIds());
    } catch (err) {
      console.error(err);
    }
  };

  // if not logged in
  if (!Auth.loggedIn()) {
    return <Redirect to="/" />
  }

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {savedBookIds.length
            ? `Viewing ${savedBookIds.length} saved ${savedBookIds.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'
          }
        </h2>
        <CardColumns>
          {userData && userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} 
              border='dark' 
              style={savedBookIds.some(savedBookId => savedBookId === book.bookId) 
                ? {}
                : {display: 'none'}
              }
              
              >
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
