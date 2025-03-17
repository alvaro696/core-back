"use strict";

module.exports = {
    up: async(queryInterface, Sequelize) => {
        const permissionsData = [{
                name: "LA PAZ",
                status: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "COCHABAMBA",
                status: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert("distritos", permissionsData, {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("distritos", null, {});
    },
};