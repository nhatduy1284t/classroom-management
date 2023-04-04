// const mongoose = require("mongoose");
import mongoose from "mongoose";

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
class DatabaseConnection {
  constructor() {}

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
      console.log("AAAA")
    }
    console.log("BBBB")
    return DatabaseConnection.instance;
  }

  /**
   * Finally, any singleton should define some business logic, which can be
   * executed on its instance.
   */
  async connect() {
    try {
      await mongoose.connect("mongodb://localhost:27017/classroommanagement");
      console.log("Connect successfully!!!");
    } catch (error) {
      console.log("Connect failure!!!");
    }
  }
}

DatabaseConnection.instance = null;

export default DatabaseConnection;