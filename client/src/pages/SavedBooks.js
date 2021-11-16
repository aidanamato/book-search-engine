import React, { useState } from 'react';
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
  const user = data?.me || {};
  
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
          {user.savedBooks.length
            ? `Viewing ${user.savedBooks.length} saved ${user.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {user.savedBooks.map((book) => {
            console.log(savedBookIds, book.bookId, savedBookIds.some(savedBookId => savedBookId === book.bookId));
            
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    disabled={!savedBookIds.some(savedBookId => savedBookId === book.bookId)}
                    className='btn-block btn-danger' 
                    onClick={() => handleDeleteBook(book.bookId)}>
                    {savedBookIds.some(savedBookId => savedBookId === book.bookId)
                      ? 'Delete this Book!'
                      : 'Deleted!'
                    }
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
