const { Business } = require("../dao");
const {
  SaveBusinessResponse,
} = require("../dto/responses/SaveBusinessResponse");
const { BusinessService } = require("../services/business.service");
const { logger } = require("../utils/logger");

const businessDAO = new Business();
const businessService = new BusinessService(businessDAO);

module.exports = {
  getBusiness: async (req, res) => {
    try {
      const businesses = await businessDAO.getBusinesses();
      if (!businesses || businesses.length === 0) {
        logger.info("No businesses found");
        return res.sendError("No businesses found", 404);
      }
      logger.info(`Retrieved ${businesses.length} businesses`);
      res.sendSuccess(businesses.map((b) => new SaveBusinessResponse(b)));
    } catch (error) {
      logger.error("Error in getBusiness:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  getBusinessById: async (req, res) => {
    try {
      const id = req.params.id;
      logger.debug(`Attempting to get business with id: ${id}`);
      const business = await businessDAO.getBusinessById(id);
      if (!business) {
        logger.info(`Business with id ${id} not found`);
        return res.sendError("Business not found", 404);
      }
      logger.info(`Retrieved business with id ${id}`);
      res.sendSuccess(new SaveBusinessResponse(business));
    } catch (error) {
      logger.error(`Error in getBusinessById for id ${req.params.id}:`, error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  createBusiness: async (req, res) => {
    try {
      const businessData = req.body;
      logger.debug("Attempting to create new business", businessData);
      const business = await businessService.createBusiness(businessData);
      logger.info("New business created successfully", {
        businessId: business._id,
      });
      res.sendSuccess(new SaveBusinessResponse(business));
    } catch (error) {
      logger.error("Error in createBusiness:", error);
      res.sendError(error.message || "An unexpected error occurred", 500);
    }
  },

  addProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const product = req.body;
      logger.debug(`Attempting to add product to business ${id}`, product);
      const result = await businessService.addProduct(id, product);
      logger.info(`Product added successfully to business ${id}`);
      res.sendSuccess({ product, message: "Product added successfully" });
    } catch (error) {
      logger.error(`Error in addProduct for business ${req.params.id}:`, error);
      res.sendError(error.message || "An unexpected error occurred", 500);
    }
  },
};
