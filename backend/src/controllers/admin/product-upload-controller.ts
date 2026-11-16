import { prismaClientInstance } from './../../db/prismaClient';
import { Request, Response } from "express"


export const productUploaderController = async (req: Request, res: Response) => {

    try {
        
        // process media is provided by middleware
        const {
        productName,
        productType,
        productGenderUse,
        productPrice,
        productDescription,
        productQuantity,
        productValue,
        adminUsername,
        processedMedia, // Provided by our middleware
      } = req.body;


      // Create product record and associate all media items in a single transaction
      const newProduct = await prismaClientInstance.productInfo.create({
        data: {
          productName,
          productType,
          productGenderUse,
          productPrice: parseFloat(productPrice),
          productDescription,
          productQuantity: parseInt(productQuantity),
          productValue: productValue ? parseInt(productValue) : null,
          adminUsername,
          media: {
            // Inserts URLs, publicIds, and isMain flags automatically
            create: processedMedia || [], 
          },
        },
        include: {
          media: true, // Returns the saved media array in the response
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully with images and videos!',
        product: newProduct,
      });


    } catch (error) {
     return res.status(500).json({ success: false, error: (error as Error).message });   
    }
}