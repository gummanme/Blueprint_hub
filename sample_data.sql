-- Insert categories
INSERT INTO categories (name, description) VALUES
('Residential', 'House plans and residential buildings'),
('Commercial', 'Office buildings and retail spaces'),
('Industrial', 'Factories and warehouses'),
('Modern', 'Contemporary architectural designs'),
('Traditional', 'Classic architectural styles');

-- Insert sample blueprints
INSERT INTO blueprints (title, description, type, size, price, image_url, file_url) VALUES
('Modern Family Home', '3 bedroom, 2 bathroom modern family house with open floor plan', 'Residential', '2500 sq ft', 299.99, '/images/modern-family-home.jpg', '/blueprints/modern-family-home.pdf'),
('Office Complex', 'Multi-story office building with flexible workspace layout', 'Commercial', '10000 sq ft', 999.99, '/images/office-complex.jpg', '/blueprints/office-complex.pdf'),
('Industrial Warehouse', 'Large warehouse with loading docks and office space', 'Industrial', '50000 sq ft', 1499.99, '/images/warehouse.jpg', '/blueprints/warehouse.pdf'),
('Luxury Villa', '5 bedroom luxury villa with pool and garden', 'Residential', '4500 sq ft', 599.99, '/images/luxury-villa.jpg', '/blueprints/luxury-villa.pdf'),
('Shopping Center', 'Retail complex with multiple stores and parking', 'Commercial', '25000 sq ft', 1299.99, '/images/shopping-center.jpg', '/blueprints/shopping-center.pdf'),
('Starter Home', '2 bedroom starter home with modern amenities', 'Residential', '1200 sq ft', 199.99, '/images/starter-home.jpg', '/blueprints/starter-home.pdf'),
('Tech Office', 'Modern tech company office space design', 'Commercial', '5000 sq ft', 799.99, '/images/tech-office.jpg', '/blueprints/tech-office.pdf'),
('Storage Facility', 'Self-storage facility with security features', 'Industrial', '30000 sq ft', 899.99, '/images/storage-facility.jpg', '/blueprints/storage-facility.pdf');

-- Link blueprints to categories
INSERT INTO blueprint_categories (blueprint_id, category_id)
SELECT b.id, c.id
FROM blueprints b, categories c
WHERE 
    (b.type = 'Residential' AND c.name = 'Residential') OR
    (b.type = 'Commercial' AND c.name = 'Commercial') OR
    (b.type = 'Industrial' AND c.name = 'Industrial');
