# KetoHub Documentation

Welcome to the **KetoHub** repository! This web application provides users with access to a database of over 400 ketogenic recipes, making it easier to plan and maintain a keto diet.

---

## Features

- Search for recipes by category or keyword.
- Save your favorite recipes for easy access.
- View detailed recipe information, including preparation time, difficulty, ingredients, and nutritional information.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- **Node.js** (v16.x or later)
- **npm** (v7.x or later) or **yarn** for package management
- **Git** for cloning the repository

---

### Clone the Repository

1. Open your terminal and navigate to the directory where you'd like to clone the project.
2. Run the following command to clone the repository:

   ```bash
   git clone https://github.com/ShyneADL/recipe-app.git
3. Navigate into the project directory:
   ```bash
   cd recipe-app
### Install Dependencies
To install the necessary packages, run one of the following commands based on your package manager:
Using npm:

 ```bash
   npm install
```
Using Yarn:
 ```bash
   yarn install
```
### Environment Setup
1. Create a .env.local file in the root directory of the project.

2. Add the necessary environment variables to the file. Below is an example of the variables you may need:

```env
NEXT_PUBLIC_RAPID_API_KEY=<your_api_key>
```
Replace <your_api_key> with your actual API key.

### Running the Application
To start the application locally, run:

Using npm:
```bash
npm run dev
```
Using Yarn:
```bash
yarn dev
```
The application will start on http://localhost:3000.

### Building for Production
To create a production build of the application, use the following command:

Using npm:
```bash
npm run build
```
using yarn:
```bash
yarn build
```
To start the production server, run:

Using npm:
```bash
npm run start
```
Using yarn:
```bash
yarn start
```

### Contributions
I welcome contributions! To contribute:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "Add some feature"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Create a pull request.

### License
This project is licensed under the MIT License. See the LICENSE file for details.
