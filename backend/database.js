const Sequelize = require('sequelize');

const connect = new Sequelize(
    'mydb',
    'teste',
    'teste123',
    {
        host: 'localhost',
        port: 15432,
        dialect: 'postgres',
        logging: false
    }
);

module.exports = connect;