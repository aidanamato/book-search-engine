import { gql } from '@apollo/client';

export const SAVE_BOOK = gql`
  mutation saveBook($book: bookInput!) {
    saveBook(book: $book) {
      username
      savedBooks {
        bookId
        title
        authors
        description
        image
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBook($bookId: ID!) {
    deleteBook(bookId: $bookId) {
      username
      savedBooks {
        bookId
        title
        authors
        description
        image
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        savedBooks {
          title
        }
      }
    }
  }
`;