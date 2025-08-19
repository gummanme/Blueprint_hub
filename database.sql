CREATE DATABASE IF NOT EXISTS construction_db;
USE construction_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blueprints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    size VARCHAR(50),
    price DECIMAL(10, 2),
    image_url VARCHAR(255),
    file_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_blueprints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    blueprint_id INT,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (blueprint_id) REFERENCES blueprints(id)
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(255)
);

CREATE TABLE blueprint_categories (
    blueprint_id INT,
    category_id INT,
    FOREIGN KEY (blueprint_id) REFERENCES blueprints(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    PRIMARY KEY (blueprint_id, category_id)
);

-- Insert sample categories with images
INSERT INTO categories (name, description, image_url) VALUES
('Residential', 'Home and apartment blueprints', '/images/categories/residential.jpg'),
('Commercial', 'Office and retail space blueprints', '/images/categories/commercial.jpg'),
('Industrial', 'Factory and warehouse blueprints', '/images/categories/industrial.jpg'),
('Educational', 'School and university blueprints', '/images/categories/educational.jpg'),
('Healthcare', 'Hospital and clinic blueprints', '/images/categories/healthcare.jpg');

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('company_name', 'Blueprint Hub'),
('company_address', 'VCGY Office, Basavangudi, Near BMSCE, Bangalore'),
('company_phone', '+91 9996661234'),
('company_email', 'info@blueprinthub.com'),
('business_hours', 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM'),
('map_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5657686304365!2d77.56437081482233!3d12.941549090877592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae158b11e34d2f%3A0x5f4adbdbab8bd80f!2sBMS%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1674147799255!5m2!1sen!2sin');
