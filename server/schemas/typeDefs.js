const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    _id: ID
    bookId: ID
    title: String
    authors: [String]
    description: String
    image: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input bookInput {
    bookId: ID!
    title: String!
    authors: [String]!
    description: String!
    image: String!
  }

  type Query {
    me: User
    user(username: String, _id: ID): User
  }

  type Mutation {
    login(email: String, username: String, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: bookInput!): User
    deleteBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;