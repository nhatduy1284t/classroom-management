import mongoose from 'mongoose';

/* Singleton Design Pattern */
class DatabaseConnection {
    constructor() {
        this.database_connection = this.connect
    }
  
    getNewDBConnection() {
      return this.database_connection;
    }

    async connect() {
        try {
            await mongoose.connect(process.env.MONGO_URL);
            console.log('Connect successfully!!!'); 
        } catch (error) {
            console.log('Connect failure!!!');
        } 
    }
} 

export default new DatabaseConnection();

/*
Why does this work? In Node.js, it works because of the module caching system. The module caching system says that "modules are cached after the first time they are loaded" (source - Node.js docs). That means in the second example above, the new instance exported is cached and re-used each time it's required. 

https://daily.dev/blog/the-4-creational-design-patterns-in-node-js-you-should-know
*/