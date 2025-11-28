const Product = require('../models/Product');
const ReviewModel = require('../models/Review');

exports.getProducts = async (req, res) => {
    try {
        

        const { category, search, sortBy, page = 1, limit = 8 } = req.query;
        const query = { isActive: true   , stock : {$gt : 0 } };
     
        
        
     
        if (category) query.category = category;
        if (search && search !== 'null' && search !== 'undefined' && search.trim() !== '') query.name = { $regex: search, $options: 'i' };
            
    
         
         
        const sortOptions = {
            'price-low': { price: 1 },
            'price-high': { price: -1 },
            'newest': { createdAt: -1 },
            'oldest': { createdAt: 1 }
        };
            

        const products = await Product.find(query)
            .sort(sortOptions[sortBy] || { createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

         const productCount =   await Product.countDocuments(query);

    const pageCount =     Math.ceil(productCount/limit);         
       

    
        res.status(200).json({
            success: true,
            products,
            pageCount
        });


    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.getPageCount = async(req , res)=>{
    try {
        const pagePerCount = 8;
        const totalproduct =await  Product.countDocuments({isActive : true  , stock : {$gt : 0 }});         
       const data =  Math.ceil(totalproduct / pagePerCount);       
        res.status(201).json({pageCount : data})
    } catch (error) {
                res.status(401).json({message : error.message})
    }
} 

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.createProduct = async (req , res) => {

    try {   
      // 👀 Check if it's undefined
             const userId  = req.user._id  
             const {name , storage , color , description , price , stock , category} = req.body;
             const features = JSON.parse(req.body.features);
             const specifications = JSON.parse(req.body.specifications);

            
        // Handle image and video
       const imageUrls = req.files?.image ? req.files.image.map(file => file.path) : [];
        const videoUrl = req.files?.video ? req.files.video[0]?.path : '';
        
        // Check if no image or video is uploaded
        if (!imageUrls.length && !videoUrl) {
          return res.status(400).json({ success: false, message: 'No image or video uploaded' });
        }
        
        // Prepare the product data 
       const productData = {
          name,
          color,
          storage,
          stock,
          description,
          price,
          category,
          features,
          specifications,   
          images: imageUrls, // Array of image URLs
          video: videoUrl,   // Single video URL
          createdBy: userId, // Example user ID, replace with actual user ID
        };
        
        const newProduct = new Product(productData);
        const product = await newProduct.save();

        res.status(201).json({
          success: true,
          data: product,
        }); 
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    } 
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        if (product.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: 'Not authorized to update this product' 
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        if (product.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: 'Not authorized to delete this product' 
            });
        }

        product.isActive = false;
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// exports.getAdminProducts = async (req, res) => {
//     try {
//         const { category, search, sort } = req.query;
//         let query = { 
//             isActive: true,
//             createdBy: req.user.id 
//         };

//         if (category) query.category = category;
//         if (search) query.$text = { $search: search };

//         const sortOptions = {
//             'price-asc': { price: 1 },
//             'price-desc': { price: -1 },
//             'newest': { createdAt: -1 },
//             'oldest': { createdAt: 1 }
//         };

//         let sortOption = { createdAt: -1 };
//         if (sort === 'price_asc') sortOption = { price: 1 };
//         else if (sort === 'price_desc') sortOption = { price: -1 };

//         const products = await Product.find(query)
//             .sort(sortOption[sort] || {createdAt : -1})
//             .populate('createdBy', 'name email role')
//             .select('-__v');

//         res.status(200).json({
//             success: true,
//             count: products.length,
//             data: products
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.getAdminProduct = async (req, res) => {
//     try {
//         const product = await Product.findOne({
//             _id: req.params.id,
//             createdBy: req.user.id,
//             isActive: true
//         }).populate('createdBy', 'name email role');
            
//         if (!product) {
//             return res.status(404).json({ 
//                 success: false,
//                 message: 'Product not found' 
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: product
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.updateAdminProduct = async (req, res) => {
//     try {
//         const product = await Product.findOne({
//             _id: req.params.id,
//             createdBy: req.user.id
//         });

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found'
//             });
//         }

//         const updatedProduct = await Product.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             {
//                 new: true,
//                 runValidators: true
//             }
//         ).populate('createdBy', 'name email role');

//         res.status(200).json({
//             success: true,
//             data: updatedProduct
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.deleteAdminProduct = async (req, res) => {
//     try {
//         const product = await Product.findOne({
//             _id: req.params.id,
//             createdBy: req.user.id
//         });

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found'
//             });
//         }

//         product.isActive = false;
//         await product.save();

//         res.status(200).json({
//             success: true,
//             message: 'Product deactivated successfully'
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }; 