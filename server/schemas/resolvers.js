const {
  createUser,
  getSingleUser,
  getCurrentUser,
  saveBook,
  deleteBook,
  login,

  getAllUsers,
  deleteUser
} = require('../controllers/user-controller');

const resolvers = {
  Query: {
    me: async (parent, args, { user }) => {
      return getCurrentUser(user);
    },
    user: async (parent, args) => {
      return getSingleUser(args);
    },

    users: async () => {
      return getAllUsers();
    }
  },
  Mutation: {
    login: async (parent, args) => {
      return login(args);
    },
    addUser: async (parent, args) => {
      return createUser(args);
    },
    saveBook: async (parent, args, { user }) => {
      return saveBook(args.book, user);
    },
    deleteBook: async (parent, args, { user }) => {
      return deleteBook(args, user);
    },

    deleteUser: async (parent, args) => {
      return deleteUser(args);
    }
  }
};

module.exports = resolvers;