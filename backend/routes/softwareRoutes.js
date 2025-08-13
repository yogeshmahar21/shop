const express = require("express");
const router = express.Router();

const softwareOptions = [
  { name: "Blender", formats: [".blend", ".fbx", ".obj", ".stl", ".dae", ".abc"] },
  { name: "Autodesk Maya", formats: [".mb", ".ma", ".fbx", ".obj", ".abc"] },
  { name: "Autodesk 3ds Max", formats: [".max", ".fbx", ".obj", ".3ds", ".dae"] },
  { name: "ZBrush", formats: [".zpr", ".ztl", ".obj", ".fbx"] },
  { name: "Cinema 4D", formats: [".c4d", ".fbx", ".obj", ".3ds", ".abc"] },
  { name: "SketchUp", formats: [".skp", ".dae", ".obj", ".stl"] },
  { name: "Tinkercad", formats: [".stl", ".obj", ".svg"] },
  { name: "Fusion 360", formats: [".f3d", ".step", ".stl", ".obj", ".igs"] },
  { name: "SolidWorks", formats: [".sldprt", ".step", ".igs", ".stl"] },
  { name: "Rhino (Rhinoceros 3D)", formats: [".3dm", ".obj", ".stl", ".step", ".igs"] },
  { name: "Houdini", formats: [".hip", ".bgeo", ".abc", ".fbx", ".obj"] },
  { name: "Modo", formats: [".lxo", ".obj", ".fbx", ".abc"] },
  { name: "Onshape", formats: [".step", ".iges", ".stl", ".obj"] },
  { name: "FreeCAD", formats: [".fcstd", ".step", ".igs", ".stl", ".obj"] },
  { name: "Meshmixer", formats: [".mix", ".stl", ".obj", ".ply"] },
  { name: "OpenSCAD", formats: [".scad", ".stl", ".off"] },
  { name: "Marvelous Designer", formats: [".zprj", ".obj", ".fbx"] },
  { name: "MagicaVoxel", formats: [".vox", ".obj", ".ply"] },
  { name: "Substance 3D Modeler (Adobe)", formats: [".sbs", ".fbx", ".obj"] },
  { name: "Lightwave 3D", formats: [".lwo", ".lws", ".fbx", ".obj"] },
  { name: "Clara.io", formats: [".fbx", ".obj", ".dae", ".3ds"] },
  { name: "Sculptris", formats: [".sc1", ".obj"] },
  { name: "SelfCAD", formats: [".stl", ".obj"] },
  { name: "Wings 3D", formats: [".wings", ".obj", ".stl", ".dae"] },
  { name: "BRL-CAD", formats: [".g", ".step", ".igs", ".stl", ".obj"] }
];

router.get("/", (req, res) => {
    res.json(softwareOptions);
});

module.exports = router;
