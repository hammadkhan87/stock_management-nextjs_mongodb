import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    let {action,slug,initialQuantity} = await request.json()
  const uri =
    "mongodb+srv://mongodb:NZ2yDKnwmVfzkrbZ@mystock.mwvsmep.mongodb.net/";
  const client = new MongoClient(uri);

  try {
      await client.connect();

    const database = client.db("hammad");
    const inventory = database.collection("inventory");
    // Query for a movie that has the title 'Back to the Future'
    const filter = {slug:slug}
    let newQuantity = action === "plus" ? parseInt(initialQuantity)+1:parseInt(initialQuantity)-1
    const updateDoc ={
        $set:{
            quantity:newQuantity
        }
    }
    const result = await inventory.updateOne(filter,updateDoc,{})
    // console.log(movie);
    return NextResponse.json({success:true,message:`${result.matchedCount} documents matched the filter , updated ${result.modifiedCount} documents`});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}