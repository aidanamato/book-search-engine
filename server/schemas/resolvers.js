const {
  createUser,
  getSingleUser,
  getCurrentUser,
  saveBook,
  deleteBook,
  login
} = require('../controllers/user-controller');

const resolvers = {
  Query: {
    me: async (parent, args, { user }) => {
      return getCurrentUser(user);
    },
    user: async (parent, args) => {
      return getSingleUser(args);
    }
  },
  Mutation: {
    login: async (parent, args) => {
      return login(args);
    },
    addUser: async (parent, args) => {
      return createUser(args);
    },
    addBook: async (parent, args, { user }) => {
      return saveBook(args.book, user);
    },
    deleteBook: async (parent, args, { user }) => {
      return deleteBook(args, user);
    }
  }
};

module.exports = resolvers;