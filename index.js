// Ensure to install the necessary packages: express, multer, fs, csv-parser, pg, dotenv
const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const csv = require("csv-parser");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.json());

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const file = req.file;
    const filePath = `uploads/${file.filename}`;

    const jsonArray = await parseCSV(filePath);

    await uploadToDB(jsonArray);

   const ageDistribution = await calculateAgeDistribution();

   console.log(ageDistribution);

    fs.unlinkSync(filePath); 

    
    res.json(jsonArray); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

async function parseCSV(filePath) {
  const jsonArray = [];
  const fileStream = fs.createReadStream(filePath);

  await new Promise((resolve, reject) => {
    fileStream
      .pipe(csv())
      .on('data', (data) => {
        const parsedData = {};
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const value = data[key].trim();
            const keys = key.split('.').map(k => k.trim());
            setObjectProperty(parsedData, keys, value);
          }
        }
        jsonArray.push(parsedData);
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  return jsonArray;
}

function setObjectProperty(obj, keys, value) {
  let nestedObj = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    nestedObj[key] = nestedObj[key] || {};
    nestedObj = nestedObj[key];
  }
  nestedObj[keys[keys.length - 1]] = value;
}


async function uploadToDB(jsonArray) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const item of jsonArray) {
      const { firstName, lastName, age, ...rest } = item;

      const name = `${firstName} ${lastName}`;
      const address = {};

      for (const key in rest) {
        if (key.startsWith("address.")) {
          const subKey = key.replace("address.", "");
          address[subKey] = rest[key];
          delete rest[key];
        }
      }

      await client.query(
        "INSERT INTO users (name, age, address, additional_info) VALUES ($1, $2, $3, $4)",
        [name, age, JSON.stringify(address), JSON.stringify(rest)]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function calculateAgeDistribution() {
  const query = `
    SELECT 
      CASE 
        WHEN age < 20 THEN '< 20' 
        WHEN age >= 20 AND age <= 40 THEN '20 to 40' 
        WHEN age > 40 AND age <= 60 THEN '40 to 60' 
        ELSE '> 60' 
      END AS "Age-Group",
      COUNT(*) AS count
    FROM users
    GROUP BY "Age-Group"
    ORDER BY "Age-Group";
  `;

  const { rows } = await pool.query(query);

  const totalCount = rows.reduce((acc, curr) => acc + parseInt(curr.count), 0);

  const distribution = rows.map((row) => ({
    "Age-Group": row["Age-Group"],
    "% Distribution": ((parseInt(row.count) / totalCount) * 100).toFixed(2),
  }));

  return distribution;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
