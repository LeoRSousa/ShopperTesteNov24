const Sequelize = require('sequelize');

const connect = new Sequelize(
    'mydb',
    'teste',
    'teste123',
    {
        host: 'postgresdb',
        port: 5432,
        dialect: 'postgres',
        logging: false,
        timezone: '-03:00'
    }
);

module.exports = connect;