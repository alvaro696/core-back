"use strict";

module.exports = {
    up: async(queryInterface, Sequelize) => {
        const permissionsData = [{
                name: "Jefatura Nacional Comercial Privados",
                codigo: "JNCO",
                status: "1",
                gerenciaId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Jefatura Nacional de Sistemas",
                codigo: "JNSI",
                status: "1",
                gerenciaId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert("areas", permissionsData, {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("areas", null, {});
    },
};