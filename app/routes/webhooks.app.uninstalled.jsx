import { request } from "http";
import { authenticate } from "../shopify.server";
import mongoose from "mongoose";

export const loader = ({request})=>{
  console.log(request);
return null
}


export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  if (session) {
       // Get the collection
    await mongoose.connect(process.env.DB_URL);
    const collection = mongoose.connection.collection('database');

   // Delete documents
   const result = await collection.deleteMany({ shop: shop});
   console.log(`${result.deletedCount} documents deleted`);

   // Close the connection
   await mongoose.connection.close();
  }

  return new Response();
};
