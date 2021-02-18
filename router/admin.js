// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.
const multer = require('multer'); // multer is used to handle image or file uploads.
const fs = require('fs'); // fs is used to acces file system.

// Importing necessary models.
const { Login } = require('../models/login');
const { Product } = require('../models/addproduct');
const { type } = require('os');


// Configuring multer or middleware of multer.
// Creating multer storage
const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads');
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1];
        const filename = file.originalname.split('.')[0];
        callback(null, `product-${filename}-${Date.now()}.${ext}`)
    }
});
// Creating upload handler.
const upload = multer({
    storage: multerStorage,
    dest: 'public/uploads'
});
// creating multer middleware.
const uploadPhoto = upload.single('image');



// GET endpoint. showing admin/dashboard.ejs file.
router.get('/dashboard', async (req, res) => {
    if(!req.session.userid) {
        return res.redirect('/login');
    }
    const logData = await Login.findById({_id: req.session.userid});
    res.render('admin/dashboard', {info: logData.name}); // rendering admin/dashboard.ejs file
})


// GET endpoint. showing admin/add product.ejs file.
router.get('/addproduct', async (req, res) => {
    if(!req.session.userid) {;
        return res.redirect('/login');
    }
    res.render('admin/addproduct'); // rendering admin/add product.ejs file
})


// POST endpoint. saving product data to database.
router.post('/addproduct', uploadPhoto, async (req, res) => {
    if(!req.session.userid) {
        return res.redirect('/login');
    }
    const productdata = new Product({    // adding data to Login model objects
        productname: req.body.productname,
        price: req.body.price,
        quantity: req.body.quantity,
        image: req.file.filename
    });
    await productdata.save(); // saving data to databse
    res.redirect('/admin/addproduct'); // after saving. redirecting add product page
})


// GET endpoint. showing admin/view product.ejs file.
router.get('/viewproduct', async (req, res) => {
    if(!req.session.userid) {
        return res.redirect('/login');
    }
    const products = await Product.find({}).sort({_id: -1});
    res.render('admin/viewproduct', {products: products}); // rendering admin/view product.ejs file
})



// GET endpoint. editing product.
router.get('/updateproduct/:id', async (req, res) => {
    if(!req.session.userid) {
        return res.redirect('/login');
    }
    const products = await Product.findById({_id: req.params.id});
    res.render('admin/updateproduct', {product: products}); // rendering updateproduct page
})


// POST endpoint. updating product data to database.
router.post('/updateproduct/:id', uploadPhoto, async (req, res) => {
    if(!req.session.userid) {
        return res.redirect('/login');
    }
    const oldData = await Product.findById({_id: req.params.id});
    fs.unlink(`public/uploads/${oldData.image}`, async (err) => {
        if(err) {
            console.log(err);
        } else {
            const updatedData = await Product.findByIdAndUpdate({_id: req.params.id}, {productname: req.body.productname, price: req.body.price, quantity: req.body.quantity, image: req.file.filename});
        }
    })
    res.redirect('/admin/viewproduct'); // after updating. redirecting view product page
})



// GET endpoint. deleting a aprticular product.
router.get('/deleteproduct/:id', async (req,res) => {
    const oldData = await Product.findById({_id: req.params.id});
    fs.unlink(`public/uploads/${oldData.image}`, async (err) => {
        if(err) {
            console.log(err);
        } else {
            const deletedData = await Product.findByIdAndDelete({_id: req.params.id});
        }
    })
    res.redirect('/admin/viewproduct'); // after deleting. redirecting view product page
})


// GET endpoint. showing admin/outofstock.ejs file.
router.get('/outofstock', async (req, res) => {
    if(!req.session.userid) {
        return res.redirect('/login');
    }
    const outofstocks = await Product.find({quantity: 0}); // taking out of stock products, when quantity is zero.
    res.render('admin/outofstock', {outofstocks: outofstocks}); // rendering admin/outofstock.ejs file
})


// POST endpoint. updating quantity.
router.post('/updatequantity/:id', async (req, res) => {
    if(!req.session.userid) {
        return res.redirect('/login');
    }
    const updatedData = await Product.findByIdAndUpdate({_id: req.params.id}, {quantity: req.body.quantity});
    res.redirect('/admin/outofstock'); // redirecting /admin/outofstock file
})


// GET endpoint. showing admin/bookinghistory.ejs file.
router.get('/bookinghistory', async (req, res) => {
    if(!req.session.userid) {
        return res.redirect('/login');
    }
    res.render('admin/bookinghistory'); // rendering admin/bookinghistory.ejs file
})


// GET endpoint. logout.
router.get('/logout', async (req, res) => {
    if(req.session.userid) {
        req.session.destroy((err) => {
            if (err) {
                return console.log(err);
            }
            res.redirect('/login');
        });
    } 
})


module.exports = router; // exporting router, so that we can acces it anywhere in the code.