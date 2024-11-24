import mongoose from 'mongoose';

async function initMongoConnection() {
  const MONGO_URI = process.env.MONGODB_URL;

  if (!MONGO_URI) {
    throw new Error('MONGODB_URL is not defined in the environment variables');
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

export default initMongoConnection;
