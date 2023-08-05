"use client"
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
// import { useClient } from 'next/client'; // Import the useClient hook from Next.js

export default function Home() {
const [productform,setProductForm] = useState({})
const[products,setProducts] = useState([])
const [alert,setAlert]=useState("")
const [dropdown,setDropDown] = useState([]) 
const [query,setquery] = useState("")
const[loading,setLoading]= useState(false)
const [loadingaction,setLoadingAction] = useState(false)
  const addProduct = async (e) =>{
    console.log("aa")
    // e.preventDefault()
    try{
      const response = await fetch('/Api/product',{
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify(productform)
      })
      if(response.ok){
        console.log("product added successfully")
        setAlert("product added successfully")
        setProductForm([])
        fetchProducts()
      }else{
        console.log("error adding product")
      }
    }catch(error){
      console.log('Error:',error)
    }

   }
   const handleChange = (e) =>{
    setProductForm({...productform, [e.target.name]: e.target.value })
   }
   const ondropDown = async(e)=>{
    setquery(e.target.value)
    setDropDown([])
    if(query.length>2){
      setLoading(true)
    const response =await fetch("/Api/search?query="+query)
    let rjson= await response.json()
    setDropDown(rjson.products)
    setLoading(false)
  }else{
    setDropDown([])
  }
   }
   const fetchProducts = async () =>{
    const response =await fetch("/Api/product")
    let rjson= await response.json()
    setProducts(rjson.products)

   }
   const buttonAction= async (action,slug,initialQuantity)=>{
    let index = products.findIndex((item)=>item.slug == slug)
    let newProducts = JSON.parse(JSON.stringify(products))
    if (action=="plus"){

      newProducts[index].quantity = parseInt(initialQuantity) +1
    }else{
      newProducts[index].quantity = parseInt(initialQuantity) -1

    }
    setProducts(newProducts)
    let dropdownindex = dropdown.findIndex((item)=>item.slug == slug)
    let newdropdown = JSON.parse(JSON.stringify(dropdown))
    if (action=="plus"){

      newdropdown[dropdownindex].quantity = parseInt(initialQuantity) +1
    }else{
      newdropdown[dropdownindex].quantity = parseInt(initialQuantity) -1

    }
    setDropDown(newdropdown)
     setLoadingAction(true)
     
      const response = await fetch('/Api/action',{
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({action,slug,initialQuantity})
      })
    setLoadingAction(false)
   }
   useEffect(()=>{
    fetchProducts()
   },[])

  return (
    <>
      <Header />

      {/* Search Product */}
      <div className="container mx-auto mt-4">
        <div className="text-green-800 text-center w-full">{alert}</div>
        <h1 className="text-2xl font-bold mb-2">Search Product</h1>
        <div className="bg-red-50 flex p-2">
          <div className="w-full  mb-2">
            <input
              // onBlur={()=>{setDropDown([])}}
              type="text"
              placeholder="Search Product"
              onChange={ondropDown}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
           
          </div>
          <div className="mb-2">
            <select
              // onChange={handleCategoryChange}
              className="border border-gray-300 px-4 py-2 rounded"
            >
              <option value="All">All</option>
              <option value="Category1">Category1</option>
              <option value="Category2">Category2</option>
              {/* Add more category options as needed */}
            </select>
          </div>
        </div>
        {loading && <div className="flex justify-center">  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="none" stroke="#000" stroke-width="10" stroke-dasharray="150.6 100.4">
    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2s" repeatCount="indefinite" />
  </circle>
</svg>
</div>
}
        {dropdown.map(item=>{
              return(
                <div className="container flex justify-between bg-purple-400 my-2 inline-block px-2" key={item.slug}>
                <span className="flex items-center">
                  {item.slug} ({item.quantity} available for RS: {item.price})
                </span>
                <div className="flex items-center py-2 pl-3">
                  <button onClick={()=>buttonAction("minus", item.slug,item.quantity)} disabled={loadingaction} className="px-2 ml-2 bg-blue-400 inline-block rounded-xl text-white text-lg cursor-pointer disabled:bg-gray-200 ">-</button>
                  <span className="px-3">{item.quantity}</span>
                  <button onClick={()=>buttonAction("plus", item.slug,item.quantity)} disabled={loadingaction} className="px-2 ml-2 bg-blue-400 inline-block rounded-xl text-white text-lg cursor-pointer disabled:bg-gray-200">+</button>
                </div>
              </div>
              )
            })}
      </div>

      {/* Add Product */}
      <div className="container mx-auto my-2">
        <h1 className="text-2xl font-bold mb-2">Add a Product</h1>
        <div className="bg-red-50 p-4">
          
            <div className="mb-2">
              <input
                type="text"
                name="slug"
                value={productform?.slug || ""}
                onChange={handleChange}
                placeholder="Product Slug"
                className="border border-gray-300 px-4 py-2 rounded"
              />
            </div>
            <div className="mb-2">
              <input
                type="number"
                name="price"
                value={productform?.price || ""}
                onChange={handleChange}
                placeholder="Product Price"
                className="border border-gray-300 px-4 py-2 rounded"
              />
            </div>
            <div className="mb-2">
              <input
                type="number"
                name="quantity"
                value={productform?.quantity || ""}
                onChange={handleChange}
                placeholder="Product Quantity"
                className="border border-gray-300 px-4 py-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={(e)=>addProduct(e)}
            >
              Add Product
            </button>
          
        </div>
      </div>

      {/* Display Current Stock */}
      <div className="container mx-auto mt-4">
        <h1 className="text-2xl font-bold mb-2">Display Current Stock</h1>
        <div className="bg-red-50 p-4">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {/* Product rows will be displayed here */}
              {products?.map(item=>{
                return (<tr key={item.slug}>
                  <td className="border px-4 py-2">{item.slug}</td>
                  <td className="border px-4 py-2">{item.price}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                </tr>)
              })}
              
              {/* <tr>
                <td className="border px-4 py-2">Sample Product 2</td>
                <td className="border px-4 py-2">15.49</td>
                <td className="border px-4 py-2">2</td>
              </tr> */}
              {/* Add more product rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
