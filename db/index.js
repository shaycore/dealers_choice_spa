const Sequelize = require('sequelize');
const { STRING, ENUM } = Sequelize;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_spa_db');

const Hero = conn.define('hero', {
    name: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
    }
});

const Role = conn.define('role', {
    name: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
    }
});

const Party = conn.define('party', {

});

Hero.belongsTo(Role);
Party.belongsTo(Hero);

const syncAndSeed = async() => {
    await conn.sync({ force: true });
    const [ adventurer, angel, assassin, demon, elf, tank, wizard ] = await Promise.all([
        Role.create({ name: 'Adventurer' }),
        Role.create({ name: 'Angel' }),
        Role.create({ name: 'Assassin' }),
        Role.create({ name: 'Demon' }),
        Role.create({ name: 'Elf' }),
        Role.create({ name: 'Tank' }),
        Role.create({ name: 'Wizard' })
    ]);
    const [ kyrue, cree, raphael, hyojin, Hank] = await Promise.all([
        Hero.create({ name: 'Kyrue', roleId: adventurer.id }),
        Hero.create({ name: 'Cree', roleId: elf.id }),
        Hero.create({ name: 'Raphael', roleId: angel.id }),
        Hero.create({ name: 'Hyojin', roleId: assassin.id }),
        Hero.create({ name: 'Hank', roleId: tank.id })
    ]);
    await Promise.all([
        Party.create({ heroId: kyrue.id }),
        Party.create({ heroId: hyojin.id }),
        Party.create({ heroId: Hank.id })
    ]);
};

module.exports = {
    syncAndSeed,
    Hero,
    Role
};