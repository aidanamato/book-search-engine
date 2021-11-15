import { gql } from ('@apollo/client');

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      bookCount
      savedBooks {
        _id
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