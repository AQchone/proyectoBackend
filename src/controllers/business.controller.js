const { Business } = require("../dao");
const {
  SaveBusinessResponse,
} = require("../dto/responses/SaveBusinessResponse");
const { BusinessService } = require("../services/business.service");

const businessDAO = new Business();
const businessService = new BusinessService(businessDAO);

module.exports = {
  getBusiness: async (_, res) => {
    try {
      const businesses = await businessDAO.getBusinesses();
      if (!businesses || businesses.length === 0) {
        return res.sendError("No businesses found", 404);
      }
      res.sendSuccess(businesses.map((b) => new SaveBusinessResponse(b)));
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
      res.sendSuccess(new SaveBusinessResponse(business));
    } catch (error) {
      console.error("Error in getBusinessById:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  createBusiness: async (req, res) => {
    try {
      const businessData = req.body;
      const business = await businessService.createBusiness(businessData);
      res.sendSuccess(new SaveBusinessResponse(business));
    } catch (error) {
      console.error("Error in createBusiness:", error);
      res.sendError(error.message || "An unexpected error occurred", 500);
    }
  },

  addProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const product = req.body;
      const result = await businessService.addProduct(id, product);
      res.sendSuccess({ product, message: "Product added successfully" });
    } catch (error) {
      console.error("Error in addProduct:", error);
      res.sendError(error.message || "An unexpected error occurred", 500);
    }
  },
};
