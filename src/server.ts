import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/prisma";

const PORT = env.port || 5000;
connectDB()
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});