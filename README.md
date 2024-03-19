
# CSV to JSON Converter API

## Overview
This is a Node.js application built with Express.js that provides an API endpoint for converting CSV files to JSON format. It also uploads the converted data to a PostgreSQL database and calculates the age distribution of the users.

## Features
- **CSV to JSON Conversion**: Accepts CSV files and converts them to JSON format.
- **Database Upload**: Uploads the converted JSON data to a PostgreSQL database.
- **Age Distribution Calculation**: Calculates the age distribution of users in the database and prints a report.

## Installation
1. Clone the repository: `git clone https://github.com/your-repo-url.git`
2. Install dependencies: `npm install`
3. Set up environment variables: Create a `.env` file and specify the required environment variables (`PORT`, `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`).
4. Ensure PostgreSQL is installed and running.

## Usage
1. Start the server: `npm start`
2. Upload a CSV file using the `/upload` endpoint (e.g., via Postman).
3. Monitor the server console for the age distribution report.
4. Access the PostgreSQL database to view the uploaded data.

## API Endpoints
- `POST /upload`: Uploads a CSV file and converts it to JSON format.

## Output
### Response Image
![image](https://github.com/jaykush42/CsvToJson/assets/81802769/c15b2955-b857-4d1e-b1c1-78bc603374a7)

### Terminal Image (Console log)
![image](https://github.com/jaykush42/CsvToJson/assets/81802769/08cb863d-3530-4ca0-8af6-eb28d6506a7f)


## Dependencies
- `express`: Web framework for Node.js.
- `multer`: Middleware for handling file uploads.
- `fs`: File system module for Node.js.
- `csv-parser`: CSV parsing library.
- `pg`: PostgreSQL client for Node.js.
- `dotenv`: Loads environment variables from a `.env` file.

## Configuration
- Environment variables are loaded from a `.env` file. Ensure to specify the required variables for the application to run.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors
- [Jay Kushwaha](https://github.com/jaykush42)

---

Feel free to customize this README to include any additional information specific to your project or setup.
