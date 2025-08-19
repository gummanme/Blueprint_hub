const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcryptjs');
const dbConfig = require('./config/database');
require('dotenv').config();

const app = express();

// Database connection
const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Home route
app.get('/', (req, res) => {
    // Get featured blueprints
    db.query(
        `SELECT b.*, c.name as category_name 
         FROM blueprints b 
         LEFT JOIN blueprint_categories bc ON b.id = bc.blueprint_id 
         LEFT JOIN categories c ON bc.category_id = c.id 
         ORDER BY b.created_at DESC 
         LIMIT 6`,
        (err, blueprints) => {
            if (err) {
                console.error('Error fetching blueprints:', err);
                blueprints = [];
            }

            // Get categories with counts
            db.query(
                `SELECT c.*, COUNT(bc.blueprint_id) as blueprint_count 
                 FROM categories c 
                 LEFT JOIN blueprint_categories bc ON c.id = bc.category_id 
                 GROUP BY c.id`,
                (err, categories) => {
                    if (err) {
                        console.error('Error fetching categories:', err);
                        categories = [];
                    }

                    res.render('index', {
                        user: req.session.user,
                        featuredBlueprints: blueprints,
                        categories: categories
                    });
                }
            );
        }
    );
});

// Authentication routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validate input
        if (!username || !email || !password) {
            return res.render('register', { 
                error: 'All fields are required',
                user: null 
            });
        }

        // Check if user already exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.render('register', { 
                    error: 'An error occurred during registration',
                    user: null
                });
            }

            if (results.length > 0) {
                return res.render('register', { 
                    error: 'Email already registered',
                    user: null
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Insert new user
            db.query(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                [username, email, hashedPassword],
                (err, results) => {
                    if (err) {
                        console.error('Registration error:', err);
                        return res.render('register', { 
                            error: 'Error registering user',
                            user: null
                        });
                    }

                    // Log the inserted user ID
                    console.log('User registered successfully. ID:', results.insertId);
                    
                    // Create session for the new user
                    req.session.user = {
                        id: results.insertId,
                        username: username,
                        email: email
                    };

                    res.redirect('/dashboard');
                }
            );
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', { 
            error: 'An error occurred during registration',
            user: null
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.render('login', { 
                error: 'Please provide both email and password',
                user: null
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.render('login', { 
                    error: 'An error occurred during login',
                    user: null
                });
            }

            if (results.length === 0) {
                return res.render('login', { 
                    error: 'Invalid email or password',
                    user: null
                });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.render('login', { 
                    error: 'Invalid email or password',
                    user: null
                });
            }

            req.session.user = { 
                id: user.id, 
                username: user.username, 
                email: user.email 
            };
            res.redirect('/dashboard');
        });
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { 
            error: 'An error occurred during login',
            user: null
        });
    }
});

// Contact routes
app.get('/contact', (req, res) => {
    db.query(
        'SELECT setting_value FROM site_settings WHERE setting_key = ?',
        ['map_embed_url'],
        (err, results) => {
            const mapUrl = err ? '' : (results[0]?.setting_value || '');
            res.render('contact', {
                user: req.session.user,
                mapUrl: mapUrl,
                success: req.query.success,
                error: req.query.error
            });
        }
    );
});

app.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.render('contact', {
                user: req.session.user,
                error: 'All fields are required',
                success: false
            });
        }

        // Store the contact message in the database
        db.query(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message],
            (err, result) => {
                if (err) {
                    console.error('Error saving contact message:', err);
                    return res.render('contact', {
                        user: req.session.user,
                        error: 'Error sending message. Please try again.',
                        success: false
                    });
                }

                // Redirect with success message
                res.redirect('/contact?success=true');
            }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        res.render('contact', {
            user: req.session.user,
            error: 'An error occurred. Please try again.',
            success: false
        });
    }
});

// Blueprint routes
app.get('/blueprints', (req, res) => {
    db.query('SELECT * FROM blueprints', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching blueprints' });
            return;
        }
        // Add full image URLs to the results
        const blueprintsWithUrls = results.map(blueprint => ({
            ...blueprint,
            image_url: `/images/${path.basename(blueprint.image_url)}`
        }));
        res.render('blueprints', { 
            blueprints: blueprintsWithUrls, 
            user: req.session.user 
        });
    });
});

// Blueprint detail route
app.get('/blueprint/:id', (req, res) => {
    const blueprintId = req.params.id;
    
    db.query(
        `SELECT b.*, GROUP_CONCAT(c.name) as categories 
         FROM blueprints b 
         LEFT JOIN blueprint_categories bc ON b.id = bc.blueprint_id 
         LEFT JOIN categories c ON bc.category_id = c.id 
         WHERE b.id = ?
         GROUP BY b.id`,
        [blueprintId],
        (err, results) => {
            if (err) {
                console.error('Error fetching blueprint:', err);
                return res.status(500).render('error', {
                    message: 'Error fetching blueprint details',
                    error: err,
                    user: req.session.user
                });
            }

            if (results.length === 0) {
                return res.status(404).render('error', {
                    message: 'Blueprint not found',
                    error: null,
                    user: req.session.user
                });
            }

            const blueprint = results[0];
            blueprint.categories = blueprint.categories ? blueprint.categories.split(',') : [];

            res.render('blueprint-details', {
                blueprint: blueprint,
                user: req.session.user
            });
        }
    );
});

// Save blueprint route
app.post('/blueprint/:id/save', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const blueprintId = req.params.id;
    const userId = req.session.user.id;

    db.query(
        'INSERT IGNORE INTO user_blueprints (user_id, blueprint_id) VALUES (?, ?)',
        [userId, blueprintId],
        (err, result) => {
            if (err) {
                console.error('Error saving blueprint:', err);
                return res.status(500).json({ error: 'Error saving blueprint' });
            }

            res.redirect('/dashboard');
        }
    );
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    // Fetch user's saved blueprints
    const userId = req.session.user.id;
    db.query(
        `SELECT b.* FROM blueprints b 
         INNER JOIN user_blueprints ub ON b.id = ub.blueprint_id 
         WHERE ub.user_id = ?`,
        [userId],
        (err, blueprints) => {
            if (err) {
                console.error('Error fetching user blueprints:', err);
                return res.render('dashboard', { 
                    user: req.session.user,
                    blueprints: [],
                    error: 'Error fetching your blueprints'
                });
            }

            res.render('dashboard', { 
                user: req.session.user,
                blueprints: blueprints,
                error: null
            });
        }
    );
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {},
        user: req.session.user
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
