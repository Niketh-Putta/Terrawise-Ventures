// Simple script to create an admin user
import { storage } from "./server/storage.js";

async function createAdmin() {
  try {
    const adminData = {
      email: "admin@terrawise.com",
      fullName: "Terrawise Admin",
      password: "admin123" // Change this in production
    };

    const admin = await storage.createAdminUser(adminData);
    console.log("Admin user created successfully:", admin.email);
    console.log("You can now login with:");
    console.log("Email: admin@terrawise.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
  process.exit(0);
}

createAdmin();