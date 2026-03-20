const getYear = () => new Date().getFullYear();

exports.generateCategoryCode = (id) => {
  return `CAT-${getYear()}-${String(id).padStart(3, "0")}`;
};

exports.generateSubcategoryCode = (id) => {
  return `SUB-${getYear()}-${String(id).padStart(3, "0")}`;
};

exports.generateProductCode = (id) => {
  return `PROD-${getYear()}-${String(id).padStart(4, "0")}`;
};