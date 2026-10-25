import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Add your MongoDB Atlas connection string to backend/.env (see backend/.env.example).');
  }
  if (uri.includes('<') || uri.includes('>')) {
    throw new Error('MONGODB_URI still contains example placeholders. Replace them in backend/.env with your Atlas username, password, cluster and database.');
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  } catch (error) {
    const safeMessage = String(error.message || 'Unknown connection error').split(uri).join('[MONGODB_URI]');
    throw new Error(`Could not connect to MongoDB Atlas: ${safeMessage}. Check the URI in backend/.env, the database user/password, and Atlas Network Access IP allowlist.`);
  }
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
