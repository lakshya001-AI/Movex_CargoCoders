import React from 'react'
import axios from "axios"

function FlavorCloud() {


  const getRates = async () => {
    try {
      // Replace these placeholders with your actual APP ID and API Key
      const APP_ID = "f59b955c-4f33-4b23-9c53-76c0f10b6ac1";
      const API_KEY = "bf143db5a542b2c726da90d48191bdce";
  
    
      const payload = {
        AppID: APP_ID,
        RestApiKey: API_KEY,
        Reference: "ReferenceMumbaiDubai",
        WeightUnit: "KG", // Using KG for India/UAE shipment
        Currency: "INR", // Setting currency to AED for UAE
        DimensionUnit: "CM", // Using CM for dimensions
        Insurance: "N",
        ShipFromAddress: {
          Name: "Mumbai Logistics",
          AttentionName: "Sender Name",
          AddressLine1: "Bandra Kurla Complex",
          City: "Mumbai",
          Country: "IN", // Country code for India
          State: "MH", // State code for Maharashtra
          Zip: "400051", // Mumbai zip code
          Phone: "919999999999", // Example Indian phone number
          Email: "sender@mumbailogistics.com"
        },
        ShipToAddress: {
          Name: "Dubai Logistics",
          AttentionName: "Receiver Name",
          AddressLine1: "Business Bay",
          AddressLine2: "Downtown",
          City: "Singapore",
State: "SG", // There are no states in Singapore, so we use the country code instead
Country: "SG", // Country code for Singapore
          Zip: "00000", // Dubai doesn't typically use postal codes
          Phone: "971555555555", // Example UAE phone number
          Email: "receiver@dubailogistics.com"
        },
        ReasonForExport: "merchandise",
        IncludeLandedCost: true,
        Pieces: [
          {
            Quantity: 1,
            Weight: 2.0, // Weight in KG
            SalePrice: 400.0, // Value in AED
            HSCode: "610910", // Example HS code for T-shirts
            OriginCountryCode: "IN", // Country of origin
            Description: "Cotton T-Shirt"
          }
        ],
        Package: {
          Weight: 2.5 // Total weight in KG
        }
      };

      
      const response = await axios.post(
        'https://partnerapi.flavorcloud.com/Rates',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log("Response Data:", response.data.Express.DDP.ShippingCost);
      console.log("Response Data:", response.data.Express.DDP.Days);
    } catch (error) {
      console.error("Error fetching rates:", error.response?.data || error.message);
    }
  };
  
  // Call the function to test the API
  getRates();


  return <>

  </>
}

export default FlavorCloud;


