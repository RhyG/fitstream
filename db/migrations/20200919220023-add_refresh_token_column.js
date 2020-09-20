"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("users", "refreshToken", {
      type: Sequelize.STRING(2000),
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "refreshToken");
  },
};
