# Construction Blueprint Website

A web application for managing and distributing construction blueprints. Users can browse, purchase, and download blueprints for various construction projects.

## Features

- User Authentication (Register/Login)
- Blueprint Gallery with Search and Filter
- Detailed Blueprint Views
- User Dashboard
- Admin Panel
- Secure Payment Integration
- Responsive Design

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd construction-blueprint-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a MySQL database and run the schema:
```bash
mysql -u root -p < database.sql
```

4. Create a .env file in the root directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=construction_db
SESSION_SECRET=your_session_secret
PORT=3000
```

5. Start the application:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
construction/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── dashboard.ejs
├── app.js
├── database.sql
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
