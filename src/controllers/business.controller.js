const { Business } = require("../dao");
const businessDAO = new Business();

module.exports = {
  getBusiness: async (_, res) => {
    try {
      const businesses = await businessDAO.getBusinesses();
      if (!businesses || businesses.length === 0) {
        return res.sendError("No businesses found", 404);
      }
      res.sendSuccess(businesses);
    } catch (error) {
      console.error("Error in getBusiness:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  getBusinessById: async (req, res) => {
    try {
      const id = req.params.id;
      const business = await businessDAO.getBusinessById(id);
      if (!business) {
        return res.sendError("Business not found", 404);
      }
      res.sendSuccess(business);
    } catch (error) {
      console.error("Error in getBusinessById:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  createBusiness: async (req, res) => {
    try {
      const businessData = req.body;
      if (!businessData || Object.keys(businessData).length === 0) {
        return res.sendError("Invalid business data", 400);
      }
      const business = await businessDAO.saveBusiness(businessData);
      if (!business) {
        return res.sendError("Failed to create business", 500);
      }
      res.sendSuccess(business);
    } catch (error) {
      console.error("Error in createBusiness:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  addProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const product = req.body;

      if (!product || Object.keys(product).length === 0) {
        return res.sendError("Invalid product data", 400);
      }

      const business = await businessDAO.getBusinessById(id);
      if (!business) {
        return res.sendError("Business not found", 404);
      }

      if (!Array.isArray(business.products)) {
        business.products = [];
      }

      business.products.push(product);
      const result = await businessDAO.updateBusiness(id, {
        products: business.products,
      });

      if (!result) {
        return res.sendError("Failed to add product", 500);
      }
      res.sendSuccess({ product, message: "Product added successfully" });
    } catch (error) {
      console.error("Error in addProduct:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },
};
