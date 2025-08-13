const express = require("express");
const router = express.Router();

const categoryOptions = [
  { name: "Mechanical" },
  { name: "Electrical" },
  { name: "Automobile" },
  { name: "Aerospace" },
  { name: "Civil" },
  { name: "Architectural" },
  { name: "Interior Design" },
  { name: "Product Design" },
  { name: "3D Printing" },
  { name: "Robotics" },
  { name: "Medical & Healthcare" },
  { name: "Furniture" },
  { name: "Consumer Electronics" },
  { name: "Industrial Equipment" },
  { name: "Animation & VFX" },
  { name: "Game Assets" },
  { name: "Jewelry Design" },
  { name: "Fashion & Apparel" },
  { name: "Toys & Figurines" },
  { name: "Education / Training" },
  { name: "Military / Defense" },
  { name: "Marine / Naval" },
  { name: "Sci-Fi / Fantasy" },
  { name: "Environment / Terrain" },
  { name: "Props & Accessories" },
  { name: "Vehicles & Transport" },
  { name: "Animals / Creatures" },
  { name: "Characters / Humans" },
  { name: "Buildings / Infrastructure" },
  { name: "Tools / Utilities" },
  { name: "Packaging / Branding" },
  { name: "Food / Beverage" },
  { name: "Sports Equipment" },
  { name: "Historical / Cultural" },
  { name: "Augmented Reality (AR)" },
  { name: "Virtual Reality (VR)" },
  { name: "Other" }
];


router.get("/", (req, res) => {
    res.json(categoryOptions);
});

module.exports = router;
