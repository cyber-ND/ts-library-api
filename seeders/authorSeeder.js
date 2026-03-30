const { faker } = require('@faker-js/faker');
const Author = require('../models/Author');

const seedAuthors = async () => {
    const authors = [];

    for (let i = 0; i < 10; i++) {
        const author = await Author.create({
            name: faker.person.fullName(),
            bio: faker.lorem.sentence(2),
        });
        authors.push(author);
    }
    console.log(`seeded ${authors.length} authors`);
    return authors;
};

module.exports = seedAuthors;