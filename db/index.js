const Sequelize = require('sequelize');
const { STRING, ENUM, INTEGER } = Sequelize;

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
    },
    description: {
        type: STRING,
        defaultValue: "A cool addition to your party!"
    },
    attack: {
        type: INTEGER,
        defaultValue: 5
    },
    defense: {
        type: INTEGER,
        defaultValue: 5
    },
    agility: {
        type: INTEGER,
        defaultValue: 5
    },
    magic: {
        type: INTEGER,
        defaultValue: 5
    },
    intelligence: {
        type: INTEGER,
        defaultValue: 5
    }
});

Hero.belongsTo(Role);

const syncAndSeed = async() => {
    await conn.sync({ force: true });
    const [ adventurer, angel, assassin, demon, elf, tank, vampire, cleric, ogre, hunter, mystic  ] = await Promise.all([
        Role.create({ name: 'Adventurer', attack: 7, defense: 7, agility: 6 }),
        Role.create({ name: 'Angel', agility: 9, magic: 8, attack: 2 }),
        Role.create({ name: 'Assassin', agility: 10, defense: 2, attack: 6 }),
        Role.create({ name: 'Demon', attack: 10, magic: 8, defense: 1 }),
        Role.create({ name: 'Elf', magic: 8, attack: 4, defense: 6, intelligence: 8 }),
        Role.create({ name: 'Tank', attack: 10, defense: 10, agility: 2, intelligence: 2, magic: 1 }),
        Role.create({ name: 'Vampire', attack: 9, agility: 8, defense: 3 }),
        Role.create({ name: 'Cleric', magic: 8, defense: 10, intelligence: 8, attack: 2, agility: 2 }),
        Role.create({ name: 'Ogre', agility: 3, magic: 7, attack: 8 }),
        Role.create({ name: 'Hunter', agility: 8, attack: 7, defense: 2, intelligence: 7 }),
        Role.create({ name: 'Mystic', agility: 2, attack: 4, magic: 7, intelligence: 10 })
    ]);
    const [ kyrue, cree, raphael, hyojin, Hank] = await Promise.all([
        Hero.create({ name: 'Kai', roleId: adventurer.id }),
        Hero.create({ name: 'Zeela', roleId: elf.id }),
        Hero.create({ name: 'Raphael', roleId: angel.id }),
        Hero.create({ name: 'Hyojin', roleId: assassin.id }),
        Hero.create({ name: 'Cree', roleId: hunter.id })
    ]);
};

module.exports = {
    syncAndSeed,
    Hero,
    Role
};