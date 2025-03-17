"use strict";

module.exports = {
    up: async(queryInterface, Sequelize) => {
        const permissionsData = [{
                name: "Analista comercial",
                codigo: "ANCO",
                status: "1",
                areaId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Auxiliar de desarrollo",
                codigo: "AXDE",
                status: "1",
                areaId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert("cargos", permissionsData, {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("cargos", null, {});
    },
};