import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
// Replace the uri string with your connection string.

export async function GET(request) {
  const uri =
    "mongodb+srv://mongodb:NZ2yDKnwmVfzkrbZ@mystock.mwvsmep.mongodb.net/";
  const client = new MongoClient(uri);
  //   async function run() {
  try {
      await client.connect();

    const database = client.db("hammad");
    const movies = database.collection("inventory");
    // Query for a movie that has the title 'Back to the Future'
    const query = {  };
    const movie = await movies.find(query).toArray();
    // console.log(movie);
    return NextResponse.json({ "a": 34,movie });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// run().catch(console.dir)
// }
