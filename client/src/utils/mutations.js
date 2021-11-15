import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($username: String, $password: String!) {
    login(username: $username, password: $password) {
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

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      }
    }
  }
`

export const SAVE_BOOK = gql`
  mutation saveBook($book: bookInput!) {
    addBook(book: $book) {
      username
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation deleteBook($bookId: ID!) {
    deleteBook(bookId: $bookId) {
      username
      savedBooks {
        _id
      }
    }
  }
`;