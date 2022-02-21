import mongoose from 'mongoose';

const connection = {};
console.log(process.env.MONGODB_CONNECTION_URI, "as supposed server")
async function dbConnection() {
    if(connection.isConnected){
        return;
    }
    const db = await mongoose.connect(process.env.MONGODB_CONNECTION_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    connection.isConnected = db.connections[0].readyState;
    console.log(`Successfully accessed database: ${connection.isConnected}`)
}

export default dbConnection;