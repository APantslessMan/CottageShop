# CottageShop CMS

CottageShop CMS is a web application for Cottage craft and Industry. planned features are a store front, and </nr>
an admin panel with CMS and Supply stock tracking. </br>

Also planned is a Plugin system, with plugins for different aspects of the industry. these would include:</br>
<ul>
  <li>Bakers Calculator, for calculating percentages to be used in sourdough breads</li>
  
</ul>


## Features

- User authentication: Users can register and log in to the system.
- Product management: Admin users can add, edit, and delete products from the inventory.
- Order processing: Users can add products to their cart and place orders.

## Technologies Used

- **Frontend**: React.js, React Router, MaterialUI
- **Backend**: Flask (Python), Flask-RESTful, SQLAlchemy
- **Database**: SQLite (for development), PostgreSQL (for production)
- **Authentication**: JSON Web Tokens (JWT)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/CottageShop-CMS.git
   ```
Navigate to the project directory:

  ```bash

cd CottageShop-CMS
```

Install dependencies:

```bash

npm install    # Install frontend dependencies
pip install -r requirements.txt   # Install backend dependencies
```

Set up environment variables:

Create a .env file in the root directory of the backend (backend/.env) and define the necessary environment variables such as REACT_APP_API_URL for the frontend and SECRET_KEY for the backend.
Start the development server:

```bash

npm start   # Start the frontend development server
python app.py   # Start the Flask backend server
```

Access the application in your web browser:<br/> <br/> 

Open http://localhost:3000 to view the frontend.<br/> 
The backend API will be available at http://localhost:5000.<br/> <br/> 

## Usage<br/> 
Register as a new user or log in with existing credentials.<br/> 
Explore the product catalog, add items to your cart, and place orders.<br/> 
Admin users can access the admin dashboard to manage products and view orders.<br/> 

## Contributing<br/> 
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:<br/> <br/> 

## Fork the repository.<br/> 
Create a new branch for your feature or bug fix.<br/> 
Make your changes and commit them.<br/> 
Push your changes to your fork.<br/> 
Submit a pull request with a detailed description of your changes.<br/> 
License<br/> 
This project is licensed under the MIT License - see the LICENSE file for details.<br/> 

