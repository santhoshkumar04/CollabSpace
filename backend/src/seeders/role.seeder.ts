import mongoose from "mongoose";
import "dotenv/config";
import connectDatabase from "../config/database.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role.permission";

const seedRoles = async () => {
  console.log("Seeding roles started...");
  try {
    await connectDatabase();
    const session = await mongoose.startSession();
    session.startTransaction();

    console.log("Clearing existing roles...");
    await RoleModel.deleteMany({}, { session });

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permissions = RolePermissions[role];

      // check if the role already exists
      const existingRole = await RoleModel.findOne({ name: role }).session(
        session
      );

      if (!existingRole) {
        const newRole = new RoleModel({ name: role, permissions: permissions });
        await newRole.save({ session });
        console.log(`Role ${role} added with permission`);
      } else {
        console.log(`Role ${role} already existing`);
      }
    }

    await session.commitTransaction();
    console.log("Transaction committed");

    session.endSession();
    console.log("Session ended");

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
};

seedRoles().catch((error) => console.log("Error running seed script:", error));
