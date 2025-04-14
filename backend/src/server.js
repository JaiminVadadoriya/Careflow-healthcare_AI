import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js"; // Ensure that this file also uses ES module export

// Load environment variables
dotenv.config();

// App initialization
// const app = express();
const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected");

//     // Error handling
//     app.on("error", (error) => {
//       console.log("ERROR: ", error);
//       throw error;
//     });
//     // Start server
//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//   }
// })();

// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.log('MongoDB connection error:', err));
