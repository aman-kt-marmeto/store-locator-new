import { json } from "@remix-run/node"; 
import { authenticate } from "../shopify.server";
import { storeModel } from "../db.server";
import connectToDatabase from "../db.connect";

export const loader = async ({ request }) => {
    const {session} = await authenticate.public.appProxy(request);
    connectToDatabase()
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    console.log(typeof id);
    const ltURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${id}&key=AIzaSyAi5q86olTxfcAwSH9KN76hNiLHxp6eBrY`
    const res =  await fetch(ltURL)
    const resData = await res.json()
    let stores = []
    if(id){
      const lng = parseFloat(resData.results[0].geometry.location.lng)
      const lat = parseFloat(resData.results[0].geometry.location.lat)
     try {
      stores = await storeModel.aggregate([
        {
          $geoNear: {
            near: {type: "Point", coordinates: [lng,lat]},
            key: "location",
            maxDistance:parseFloat(1000)*1609,
            distanceField:"dist.calculated",
            spherical:true
          }
        }
        ]);  
     } catch (error) {
      console.log(error);
      return json({ok:false});
     }
    }else{
      try {
        stores = await storeModel.find({
         shop: session.shop
       });
      } catch (error) {
       console.log(error);
       return json({ok:false});
      }
    }

    return json({ok:true, stores});
  };
