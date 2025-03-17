"use strict";

module.exports = {
    up: async(queryInterface, Sequelize) => {
        const permissionsData = [{
                name: "Gerencia Nacional Comercial",
                codigo: "GNCO",
                status: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Gerencia Nacional Administracion y Finanzas",
                codigo: "GNAF",
                status: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert("gerencias", permissionsData, {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("gerencias", null, {});
    },
};