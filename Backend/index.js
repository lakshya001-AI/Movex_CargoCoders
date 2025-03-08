const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectMongoDB = require("./Database/connectDB");
const userModel = require("./Database/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import jwt
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const { Ollama } = require("ollama");
const ollama = new Ollama();
const path = require("path");

dotenv.config();
connectMongoDB();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client/build")));

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey12345!@";

// Root Route
app.get("/", (req, res) => {
  res.send("Hello, this is the Backend");
});

// Create Account Route
app.post("/createAccount", async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;

    // Check if user already exists
    const userExists = await userModel.findOne({ emailAddress });
    if (userExists) {
      return res.status(400).send({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword,
    });

    console.log(newUser);
    res.status(201).send({ message: "Account created successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

// Login Route with JWT Token Generation
app.post("/loginUser", async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ emailAddress });

    if (!user) {
      return res.status(401).send({ message: "User not found!" });
    }

    // Verify password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).send({ message: "Invalid credentials!" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.emailAddress },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token validity
      }
    );

    res.status(200).send({
      message: "Logged in successfully!",
      token, // Send the token to the client
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).send({ message: "An error occurred" });
  }
});

// Middleware to Verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Store decoded data in request object
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token!" });
  }
};

// Example of a Protected Route
app.get("/protectedRoute", verifyToken, (req, res) => {
  res.status(200).send({
    message: "Access granted to protected route!",
    user: req.user, // Return user data from token
  });
});

// app.post("/getDomesticRoute", async (req, res)=>{

//   try {

//     const{origin, destination, mode, weight, hscode, shipmentType, instructions} = req.body;

//      // Validate inputs
//      if (!origin || !destination || !mode || !weight || !hscode || !shipmentType || !instructions) {
//       console.log("Missing required fields:", {
//         origin, destination, mode, weight, hscode, shipmentType, instructions
//       });
//       return res.status(400).json({
//         error: "Please provide all required details including origin, destination, transport mode, budget, and preferences.",
//       });
//     }

//     // Set headers for streaming
//     res.writeHead(200, {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//       "Access-Control-Allow-Origin": "*",
//     });

//     const messages = [{
//       role: "user",
//       content: `If I need to send a ${weight} kg ${shipmentType} shipment having hscode: ${hscode} from ${origin} to ${destination} by ${mode}, ensuring ${instructions} . Please provide the following things
//       1] Best route
//       2] Cost
//       3] Time
//       `
//     }];

//     try {
//       // Create text stream
//       const textStream = await ollama.chat({
//         model: "deepseek-r1:1.5b",
//         messages: messages,
//         stream: true,
//       });

//       console.log("Stream started");

//       let accumulatedContent = "";
//       let isInThinkTag = false;
//       let thinkContent = "";

//       // Stream the response
//       for await (const chunk of textStream) {
//         if (chunk.message?.content) {
//           accumulatedContent += chunk.message.content;

//           // Check for complete think tags
//           if (accumulatedContent.includes("<think>") && !isInThinkTag) {
//             isInThinkTag = true;
//           }

//           if (isInThinkTag && accumulatedContent.includes("</think>")) {
//             // Extract think content
//             const thinkMatch = accumulatedContent.match(
//               /<think>([\s\S]*?)<\/think>/
//             );
//             if (thinkMatch) {
//               thinkContent = thinkMatch[1];

//               // Get content after think tag
//               const remainingContent =
//                 accumulatedContent.split("</think>")[1] || "";

//               // Send both think content and remaining content
//               res.write(
//                 `data: ${JSON.stringify({
//                   think: thinkContent,
//                   text: remainingContent,
//                 })}\n\n`
//               );

//               // Reset accumulator to just the remaining content
//               accumulatedContent = remainingContent;
//               isInThinkTag = false;
//               console.log(accumulatedContent);
//             }
//           } else if (!isInThinkTag && accumulatedContent.trim()) {
//             // If we're not in a think tag and have content, send it
//             res.write(
//               `data: ${JSON.stringify({
//                 text: accumulatedContent,
//               })}\n\n`
//             );
//             console.log(accumulatedContent);

//             accumulatedContent = "";
//           }
//         }
//       }

//       // Send any remaining content
//       if (accumulatedContent.trim()) {
//         res.write(
//           `data: ${JSON.stringify({
//             text: accumulatedContent,
//           })}\n\n`
//         );
//       }

//       console.log("Stream completed");
//       res.write("data: [DONE]\n\n");
//     } catch (streamError) {
//       console.error("Streaming error:", streamError);
//       res.write(
//         `data: ${JSON.stringify({ error: "Stream error occurred" })}\n\n`
//       );
//     } finally {
//       res.end();
//     }

//   } catch (error) {
//     console.error("Error in financial advice endpoint:", error);
//     if (!res.headersSent) {
//       res.status(500).json({ error: "Failed to generate advice" });
//     } else {
//       res.write(`data: ${JSON.stringify({ error: "Error occurred" })}\n\n`);
//       res.end();
//     }
//   }

// });

// app.post("/getDomesticRoute", async (req, res) => {
//   try {
//     const { origin, destination, mode, weight, hscode, shipmentType, instructions } = req.body;

//     // Validate inputs
//     if (!origin || !destination || !mode || !weight || !hscode || !shipmentType || !instructions) {
//       console.log("Missing required fields:", {
//         origin,
//         destination,
//         mode,
//         weight,
//         hscode,
//         shipmentType,
//         instructions,
//       });
//       return res.status(400).json({
//         error: "Please provide all required details including origin, destination, transport mode, weight, shipment type, and instructions.",
//       });
//     }

//     // Set headers for streaming
//     res.writeHead(200, {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//       "Access-Control-Allow-Origin": "*",
//     });

//     const messages = [
//       {
//         role: "user",
//         content: `I need to send a ${weight} kg ${shipmentType} shipment (HS Code: ${hscode}) from ${origin} to ${destination} via ${mode}. It should ensure: ${instructions}. Provide only the following details:
//         - Best Route
//         - Cost (in INR)
//         - Estimated Time (in hours or days)
//         Format the response as JSON object with keys: bestRoute, cost, and time.`,
//       },
//     ];

//     try {
//       // Create text stream
//       const textStream = await ollama.chat({
//         model: "deepseek-r1:1.5b",
//         messages: messages,
//         stream: true,
//       });

//       console.log("Stream started");

//       let accumulatedContent = "";

//       for await (const chunk of textStream) {
//         if (chunk.message?.content) {
//           accumulatedContent += chunk.message.content;
//         }
//       }

//       // Parse JSON from the AI response
//       let parsedResponse;
//       try {
//         parsedResponse = JSON.parse(accumulatedContent);

//         if (parsedResponse.bestRoute && parsedResponse.cost && parsedResponse.time) {
//           console.log(`data: ${JSON.stringify({
//               bestRoute: parsedResponse.bestRoute,
//               cost: parsedResponse.cost,
//               time: parsedResponse.time,
//             })}\n\n`);

//           res.write(
//             `data: ${JSON.stringify({
//               bestRoute: parsedResponse.bestRoute,
//               cost: parsedResponse.cost,
//               time: parsedResponse.time,
//             })}\n\n`
//           );
//         } else {
//           throw new Error("Incomplete response from AI");
//         }
//       } catch (parseError) {
//         console.error("Parsing error:", parseError);
//         res.write(
//           `data: ${JSON.stringify({
//             error: "Failed to parse AI response. Please try again.",
//           })}\n\n`
//         );
//       }

//       res.write("data: [DONE]\n\n");
//     } catch (streamError) {
//       console.error("Streaming error:", streamError);
//       res.write(
//         `data: ${JSON.stringify({ error: "Stream error occurred" })}\n\n`
//       );
//     } finally {
//       res.end();
//     }
//   } catch (error) {
//     console.error("Error in getDomesticRoute endpoint:", error);
//     if (!res.headersSent) {
//       res.status(500).json({ error: "Internal server error occurred" });
//     } else {
//       res.write(`data: ${JSON.stringify({ error: "Error occurred" })}\n\n`);
//       res.end();
//     }
//   }
// });

app.post("/getDomesticRoute", async (req, res) => {
  try {
    const {
      origin,
      destination,
      mode,
      weight,
      hscode,
      shipmentType,
      instructions,
    } = req.body;

    // Validate inputs
    if (
      !origin ||
      !destination ||
      !mode ||
      !weight ||
      !hscode ||
      !shipmentType ||
      !instructions
    ) {
      console.log("Missing required fields:", {
        origin,
        destination,
        mode,
        weight,
        hscode,
        shipmentType,
        instructions,
      });
      return res.status(400).json({
        error:
          "Please provide all required details including origin, destination, transport mode, weight, shipment type, and instructions.",
      });
    }

    // Set headers for streaming
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    const messages = [
      {
        role: "user",
        content: `I need to send a ${weight} kg ${shipmentType} shipment (HS Code: ${hscode}) from ${origin} to ${destination} via ${mode}. It should ensure: ${instructions}. 
        Provide the response in JSON format with the following keys:
        {
          "bestRoute": "string",
          "cost": "number",
          "time": "string"
        }`,
      },
    ];

    try {
      // Create text stream
      const textStream = await ollama.chat({
        model: "deepseek-r1:1.5b",
        messages: messages,
        stream: true,
      });

      console.log("Stream started");

      let accumulatedContent = "";

      for await (const chunk of textStream) {
        if (chunk.message?.content) {
          accumulatedContent += chunk.message.content;
        }
      }

      // Extract JSON from AI response
      let parsedResponse;
      try {
        const jsonMatch = accumulatedContent.match(/\{[\s\S]*?\}/); // Match the JSON part of the response
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);

          if (
            parsedResponse.bestRoute &&
            parsedResponse.cost &&
            parsedResponse.time
          ) {
            console.log(
              `data: ${JSON.stringify({
                bestRoute: parsedResponse.bestRoute,
                cost: parsedResponse.cost,
                time: parsedResponse.time,
              })}\n\n`
            );
            res.write(
              `data: ${JSON.stringify({
                bestRoute: parsedResponse.bestRoute,
                cost: parsedResponse.cost,
                time: parsedResponse.time,
              })}\n\n`
            );
            res.status(200).send(
              JSON.stringify({
                bestRoute: parsedResponse.bestRoute,
                cost: parsedResponse.cost,
                time: parsedResponse.time,
              })
            );
          } else {
            throw new Error("Incomplete response from AI");
          }
        } else {
          throw new Error("No valid JSON found in AI response");
        }
      } catch (parseError) {
        console.error("Parsing error:", parseError);
        res.write(
          `data: ${JSON.stringify({
            error: "Failed to parse AI response. Please try again.",
          })}\n\n`
        );
      }

      res.write("data: [DONE]\n\n");
    } catch (streamError) {
      console.error("Streaming error:", streamError);
      res.write(
        `data: ${JSON.stringify({ error: "Stream error occurred" })}\n\n`
      );
    } finally {
      res.end();
    }
  } catch (error) {
    console.error("Error in getDomesticRoute endpoint:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error occurred" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Error occurred" })}\n\n`);
      res.end();
    }
  }
});

// Geocoding function
async function geocodeAddress(address) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: process.env.Google_Map_API,
        },
      }
    );

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      throw new Error(`Geocoding failed for address: ${address}`);
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
}

// Parse polyline to extract route steps
function parsePolyline(encodedPolyline) {
  // This is a simplified implementation
  // In a real app, you would use a library to decode the polyline and extract meaningful steps
  return [
    { instruction: "Start your journey", distance: "Start" },
    { instruction: "Follow the route", distance: "Continue" },
    { instruction: "Arrive at your destination", distance: "End" },
  ];
}

// New Routes API endpoint
app.post("/api/directions", async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res
        .status(400)
        .json({ error: "Origin and destination are required" });
    }

    // Geocode both addresses to get coordinates
    const originCoords = await geocodeAddress(origin);
    const destCoords = await geocodeAddress(destination);

    // Prepare request for Routes API
    const routesApiUrl =
      "https://routes.googleapis.com/directions/v2:computeRoutes";

    const requestData = {
      origin: {
        location: {
          latLng: {
            latitude: originCoords.latitude,
            longitude: originCoords.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destCoords.latitude,
            longitude: destCoords.longitude,
          },
        },
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
      },
      languageCode: "en-US",
      units: "IMPERIAL",
    };

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.Google_Map_API,
      "X-Goog-FieldMask":
        "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs",
    };

    console.log("Sending request to Routes API...");
    const response = await axios.post(routesApiUrl, requestData, { headers });

    // Check if we have a valid response with routes
    if (
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      throw new Error("No routes found");
    }

    const route = response.data.routes[0];

    // Convert distance from meters to miles or kilometers
    const distanceInMeters = route.distanceMeters;
    const distanceInMiles = (distanceInMeters / 1609.34).toFixed(1);

    // Convert duration from seconds to a readable format
    const durationInSeconds = parseInt(route.duration.replace("s", ""));
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const durationStr =
      hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

    // Generate steps from the encoded polyline
    // In a production app, you would want to extract detailed navigation instructions
    // from the legs.steps data if available
    const steps =
      route.legs && route.legs[0].steps
        ? route.legs[0].steps.map((step) => ({
            instruction: step.navigationInstruction || "Follow the route",
            distance: `${(step.distanceMeters / 1609.34).toFixed(1)} mi`,
          }))
        : parsePolyline(route.polyline.encodedPolyline);

    // Format the response
    const directions = {
      distance: `${distanceInMiles} mi`,
      duration: durationStr,
      steps: steps,
    };

    console.log("Successfully fetched directions");
    res.json(directions);
  } catch (error) {
    console.error("Error fetching directions:", error.message);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
    res.status(500).json({ error: "Failed to fetch directions" });
  }
});

// Route Proxy API endpoint
app.post("/api/route-proxy", async (req, res) => {
  try {
    const requestData = req.body;

    // Validate request data
    if (!requestData.origin || !requestData.destination) {
      return res
        .status(400)
        .json({ error: "Origin and destination are required" });
    }

    // Make request to Google Routes API
    const routesApiUrl =
      "https://routes.googleapis.com/directions/v2:computeRoutes";

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.Google_Map_API,
      "X-Goog-FieldMask":
        "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
    };

    console.log("Sending request to Routes API via proxy...");
    const response = await axios.post(routesApiUrl, requestData, { headers });

    // Return the response
    res.json(response.data);
  } catch (error) {
    console.error("Error in route proxy:", error.message);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
    res.status(500).json({ error: "Failed to fetch route data" });
  }
});



// Add the geocoding endpoint if it doesn't exist yet
app.get("/api/geocode", async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    console.log(`Geocoding address: ${address}`);

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address,
          key: process.env.Google_Map_API,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error in Geocoding API:", error.message);
    res.status(500).json({ error: "Geocoding request failed" });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
