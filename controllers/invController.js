const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildVehicleDetail = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  try {
    const vehicle = await invModel.getVehicleDetailById(inventory_id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    const vehicleHTML = invModel.buildVehicleHTML(vehicle);
    let nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
    });
  } catch (error) {
    next(error);
  }
};

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash('message') || null,
  });
};

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  const result = await invModel.addClassification(classification_name);
  
  if (result) {
    req.flash("notice", "Classification added successfully");
    res.redirect("/inv");
  } else {
    req.flash("notice", "Failed to add classification");
    res.redirect("/inv/add-classification");
  }
};

module.exports = {buildByClassificationId, buildVehicleDetail};