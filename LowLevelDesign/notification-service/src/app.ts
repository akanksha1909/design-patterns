import express from "express";
import { notificationController } from "./controllers/notification.controller.js";

const app = express();
app.use(express.json());

app.post("/notifications", notificationController.send)

export default app;