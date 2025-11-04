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

let studentData;

app.get("/students", (req, res) => {
  try {
    const course = req.query.course;

    studentData = readFile();

    if (course) {
      const result = studentData.filter(
        (s) => s.course.toLowerCase() === course.toLowerCase()
      );
      if (result.length === 0) {
        return res
          .status(400)
          .json({ Error: `NO student found with that ${course}` });
      }

      return res.status(200).json(result);
    } else {
      res.status(200).json(studentData);
    }
  } catch (error) {
    res
      .status(400)
      .json({ Message: `Unable to fetch students`, Error: error.message });
  }
});

app.get("/students/:id", (req, res) => {
  let id = req.path.split("/")[2];
  console.log("this is the id", id);
  let student;
  try {
    studentData = readFile();
    if (id <= studentData.length) {
      student = studentData.find((s) => s.id === id);
      console.log(studentData);
      res.status(200).json({ studentData }, null, 2);
    } else {
      res.status(400).json({ error: `No student found for this ID: ${id}` });
    }
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
});

app.post("/students", (req, res) => {
  try {
    studentData = readFile();

    let newStudent = req.body;
    if (!newStudent.name && !newStudent.course) {
      res.status(400).json({ error: "Student must have a name and a course" });
    }

    newStudent.id =
      studentData.length > 0
        ? Math.max(...studentData.map((s) => s.id)) + 1
        : 1;

    studentData.push(newStudent);

    fs.writeFileSync("students.json", JSON.stringify(studentData, null, 2));
    const message = { message: `student successfully added` };
    res.status(200).json(message, null, 2);
  } catch (error) {
    res.status(400).json({ error: "Invalid JSON" });
  }
});

app.put("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const updatedStudent = req.body;
  studentData = readFile();
  let index = studentData.findIndex((s) => Number(s.id) === id);
  console.log(studentData[index]);
  try {
    if (index === -1) {
      res.status(400).json({ Error: "student not found" });
    } else {
      studentData[index] = {
        ...studentData[index],
        ...updatedStudent,
      };
      console.log(`studentdata[index] :  ${studentData}`);
      fs.writeFileSync("students.json", JSON.stringify(studentData, null, 2));
      res.status(200).json(studentData[index]);
    }
  } catch (error) {
    res.status(400).json({ error: "invalid json" });
  }
});

app.delete("/students/:id", (req, res) => {
  studentData = readFile();
  const id = parseInt(req.params.id);
  console.log(id);
  let exist = studentData.some((s) => Number(s.id) === id);

  if (!exist) {
    return res.status(400).json({ error: "student not found" });
  }
  studentData = studentData.filter((s) => Number(s.id) !== id);
  fs.writeFileSync("students.json", JSON.stringify(studentData, null, 2));

  res.status(200).json(studentData);
});

app.listen(8081, () => {
  console.log(`Server running at http://localhost:8081/`);
});
