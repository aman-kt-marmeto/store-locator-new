import { json, redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
 // Replace with actual path
import connectToDatabase from "../db.connect";
import { storeModel } from "../db.server";



export const action = async ({ request }) => {
    await authenticate.admin(request);
    const formData = await request.formData();
    const storeId = formData.get("storeId");
    console.log(storeId);
    await connectToDatabase();
  try {
  // Function to delete store in MongoDB
    const result = await storeModel.findByIdAndDelete(storeId);
    if (!result) {
      throw new Error("Store not found");
    }
    return redirect("/app"); // Redirect to the main page after deletion
  } catch (error) {
    console.log(error);
    return json({ error: "Failed to delete store" }, { status: 500 });
  }
};
