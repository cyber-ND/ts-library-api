const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const Student = require('../models/Student');

const seedStudents = async () => {
    const students = [];

    for (let i = 0; i < 10; i++) {
        const name = faker.person.fullName();
        const email = faker.internet.email();
        const studentId = `STU-${Date.now()}-${i}`;

        const student = await Student.create({ name, email, studentId });

        await User.create({
            name,
            email,
            password: 'password123',
            role: 'Student',
            profile: student._id,
        });
        students.push(student);
    }
    console.log(`seeded ${students.length} students`);
    return students;
};

module.exports = seedStudents;