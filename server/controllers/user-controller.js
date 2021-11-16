// import user model
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

module.exports = {
  // get a single user by either their id or their username
  async getSingleUser({username, _id}) {
    const foundUser = await User.findOne({
      $or: [{ _id }, { username }],
    });

    if (foundUser) {
      return (foundUser);
    }
    
    throw new AuthenticationError('Cannot find a user with this id or username!');
  },
  async getCurrentUser(user) {  
    if (user) {
      const currentUser = await User.findOne({ _id: user._id });

      return currentUser;
    }

    throw new AuthenticationError('Not logged in');
  },

  async getAllUsers() {
    const users = await User.find();

    return users;
  },

  // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
  async createUser(args) {
    const user = await User.create(args);
    const token = signToken(user);

    return { token, user };
  },
  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // {body} is destructured req.body
  async login({ username, email, password }) {
    if (username || email) {
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (user) {
        const correctPw = await user.isCorrectPassword(password);

        if (correctPw) {
          const token = signToken(user);
          return { token, user };
        }

        throw new AuthenticationError('Wrong password!');
      }

      throw new AuthenticationError("Can't find this user");
    }

    throw new AuthenticationError("Username or email required!")
  },
  // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
  // user comes from `req.user` created in the auth middleware function
  async saveBook(book, user) {
    if (user) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
      
      if (updatedUser)  {
        return updatedUser
      } 
      
      throw new AuthenticationError(err);
    }

    throw new AuthenticationError('You must be logged in to add a book');
  },
  // remove a book from `savedBooks`
  async deleteBook({ bookId }, user) {
    console.log(`Book id ${bookId}`);
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedBooks: { bookId } } },
      { new: true }
    );
    if (updatedUser) {
      return updatedUser;
    }

    throw new AuthenticationError("Couldn't find user with this id.")
  },

  async deleteUser({ _id }) {
    const deletedUser = await User.findOneAndDelete({_id});
    return deletedUser;
  }
}