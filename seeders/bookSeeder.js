const { faker } = require('@faker-js/faker');
const Book = require('../models/Book');
const Author = require('../models/Author');

const seedBooks = async () => {
    const authors = await Author.find().select('_id');

    if (authors.length === 0) {
        console.log('No authors found. Please seed authors before seeding books.');
        return;
    }

    const books = [];

    for (let i = 0; i < 20; i++) {
        const randomAuthors = faker.helpers.arrayElements(authors, {
            min: 1,
            max: 2,
        });

        const book = await Book.create({
            title: faker.lorem.words({ min: 2, max: 5 }),
            isbn: `ISBN-${Date.now()}-${i}`,
            authors: randomAuthors.map((author) => author._id),
            status:'IN',
        });
        books.push(book);
    };
    console.log(`seeded ${books.length} books`);
    return books;
};

module.exports = seedBooks;