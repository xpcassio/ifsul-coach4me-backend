import express, { Request, Response } from "express";
import cors from "cors";

import routes from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

// Define the port the server will listen on
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
