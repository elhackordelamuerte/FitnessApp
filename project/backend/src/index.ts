import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { workouts: true }
  });
  res.json(users);
});

app.post("/workout", async (req, res) => {
  const { userId, exercises } = req.body;
  const workout = await prisma.workout.create({
    data: {
      userId,
      exercises,
      date: new Date(),
      completed: false
    }
  });
  res.json(workout);
});

app.patch("/workout/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const workout = await prisma.workout.update({
    where: { id: Number(id) },
    data: { completed }
  });
  res.json(workout);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000")); 