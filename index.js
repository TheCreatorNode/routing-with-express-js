const express = require("express");
const app = express();
const url = require("url");
const fs = require("fs");

app.use(express.json());

const readFile = () => {
  try {
    const data = fs.readFileSync("students.json", "utf-8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error(error.message);
  }
};

// const setHeader = () => {
//   const origin = res.setHeader("Access-Control-Allow-Origin", "*");
//   const allowMethod = res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,POST,PUT,DELETE,OPTIONS"
//   );
//   const allowHeader = res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type"
//   );

//   return { origin, allowHeader, allowMethod };
// };

let studentData;

app.get("/students", (req, res) => {
  // setHeader();
  console.log(req);
  try {
    if (!req.query.course) {
      studentData = readFile();
      res.status(200).json(studentData);
    }
  } catch (error) {
    const errorMessage = {
      error: "An error occurred",
      details: `${error.message}`,
    };
    res.status(500).json(errorMessage);
  }
});

app.get("/students", (req, res) => {
  studentData = readFile();
  let result;
  if (req.query.course) {
    const course = req.query.course;
    result = studentData.filter(
      (s) => s.course.toLowerCase() === course.toLowerCase()
    );

    if (result.length === 0) {
      res.status(400).json({ Error: `NO student founf for the ${course}` });
    }
  } else {
    result = { message: `please provide a valid query` };
  }
  res.status(200).json(result);
});

app.get("/students/", (req, res) => {});

app.listen(8081);
