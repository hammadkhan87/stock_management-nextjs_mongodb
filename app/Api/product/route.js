import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
// Replace the uri string with your connection string.

export async function GET(request) {
  const uri =
    "mongodb+srv://mongodb:NZ2yDKnwmVfzkrbZ@mystock.mwvsmep.mongodb.net/";
  const client = new MongoClient(uri);

  try {
      await client.connect();

    const database = client.db("hammad");
    const inventory = database.collection("inventory");
    // Query for a movie that has the title 'Back to the Future'
    const query = {  };
    const products = await inventory.find(query).toArray();
    // console.log(movie);
    return NextResponse.json({ success:true,products});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
export async function POST(request) {
    let body = await request.json()
  const uri =
    "mongodb+srv://mongodb:NZ2yDKnwmVfzkrbZ@mystock.mwvsmep.mongodb.net/";
  const client = new MongoClient(uri);

  try {
      await client.connect();

    const database = client.db("hammad");
    const inventory = database.collection("inventory");
    // Query for a movie that has the title 'Back to the Future'
    const product = await inventory.insertOne(body)
    // console.log(movie);
    return NextResponse.json({product,ok:true});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
