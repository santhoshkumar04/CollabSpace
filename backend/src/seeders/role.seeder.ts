import mongoose from "mongoose";

const seeder = async () => {
  console.log("Seeding roles started...");
  try {
    const session = await mongoose.startSession();
  } catch (error) {}
};
