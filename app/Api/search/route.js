import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
// Replace the uri string with your connection string.

export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query")
  const uri =
    "mongodb+srv://mongodb:NZ2yDKnwmVfzkrbZ@mystock.mwvsmep.mongodb.net/";
  const client = new MongoClient(uri);


  try {
      await client.connect();

    const database = client.db("hammad");
    const inventory = database.collection("inventory");
    // Query for a movie that has the title 'Back to the Future'
   
    const products = await inventory.aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query , $options: "i" } }, // Match name partially (case-insensitive)
             
            ]
          }
        }
      ]).toArray()
    // console.log(movie);
    return NextResponse.json({ success:true,products});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}



