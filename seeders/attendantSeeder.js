const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const Attendant = require('../models/Attendant');

const seedAttendants = async () => {
    const attendants = [];

    for (let i = 0; i < 5; i++) {
        // Generate a random name and email for the attendant
        const name = faker.person.fullName();
        const email = faker.internet.email();
        // Generate a unique staff ID using the current timestamp and index
        const staffId = `ATT-${Date.now()}-${i}`;

        const attendant = await Attendant.create({ name, staffId });

        await User.create({
            name,
            email,
            password: 'password123',
            role: 'Attendant',
            profile: attendant._id,
        });
        attendants.push(attendant);
    }
    console.log(`seeded ${attendants.length} attendants`);
    return attendants;
};

module.exports = seedAttendants;