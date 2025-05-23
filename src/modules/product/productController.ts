import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ProductModel } from './productModel';
import { ProductImageModel } from '../productImage/productImageModel';
import { AuthRequest } from '../../middleware/authenticate';
import { AppError } from '../../utils/AppError';
import { SellerModel } from '../seller/sellerModel';

export const addProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'seller') {
      throw new AppError('Only sellers can add products', 403);
    }

    const seller = await SellerModel.findOne({ userId: req.userId });
    if (!seller) {
      throw new AppError('Seller profile not found for this user', 403);
    }

    const { name, description, image, price, stockQty, categoryId, images } = req.body;

    const newProduct = await ProductModel.create({
      sellerId: seller._id,
      name,
      description,
      image,
      price,
      stockQty,
      lastUpdated: new Date(),
      categoryId,
      isActive: true,
    });

    if (images && Array.isArray(images) && images.length > 0) {
      const imageDocs = images.map((imgUrl: string) => ({
        productId: newProduct._id,
        imageUrl: imgUrl,
        uploadedDate: new Date(),
        isActive: true,
      }));
      await ProductImageModel.insertMany(imageDocs);
    }

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'seller') {
      throw new AppError('Only sellers can update products', 403);
    }

    const seller = await SellerModel.findOne({ userId: req.userId });
    if (!seller) {
      throw new AppError('Seller profile not found for this user', 403);
    }

    const productId = req.params.id;
    if (!mongoose.isValidObjectId(productId)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await ProductModel.findById(productId);
    if (!product || product.isActive === false) {
      throw new AppError('Product not found or inactive', 404);
    }

    if (product.sellerId.toString() !== seller._id.toString()) {
      throw new AppError('Unauthorized to update this product', 403);
    }

    const updateData = req.body;
    updateData.lastUpdated = new Date();

    const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'seller') {
      throw new AppError('Only sellers can delete products', 403);
    }

    const seller = await SellerModel.findOne({ userId: req.userId });
    if (!seller) {
      throw new AppError('Seller profile not found for this user', 403);
    }

    const productId = req.params.id;
    if (!mongoose.isValidObjectId(productId)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await ProductModel.findById(productId);
    if (!product || product.isActive === false) {
      throw new AppError('Product not found or already inactive', 404);
    }

    if (product.sellerId.toString() !== seller._id.toString()) {
      throw new AppError('Unauthorized to delete this product', 403);
    }

    product.isActive = false;
    await product.save();

    await ProductImageModel.updateMany(
      { productId: product._id, isActive: true },
      { $set: { isActive: false } }
    );

    res.status(200).json({ success: true, message: 'Product deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;

    if (!mongoose.isValidObjectId(productId)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await ProductModel.findOne({ _id: productId, isActive: true });
    if (!product) {
      throw new AppError('Product not found or inactive', 404);
    }

    const images = await ProductImageModel.find({ productId: product._id, isActive: true });

    res.status(200).json({ success: true, data: { product, images } });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      ProductModel.find({ isActive: true }).skip(skip).limit(limit).lean(),
      ProductModel.countDocuments({ isActive: true }),
    ]);

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await ProductImageModel.find({ productId: product._id, isActive: true });
        return { product, images };
      })
    );

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: productsWithImages,
      meta: {
        totalProducts: totalCount,
        currentPage: page,
        totalPages,
        pageSize: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};
