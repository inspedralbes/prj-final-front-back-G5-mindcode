import 'dotenv/config';
import { sequelize, Class, User, Language, Restriction } from '../models/index.js';

const seed = async () => {
  try {
    await sequelize.sync({ force: true });

    await Class.bulkCreate([
      {
        idclass: 1,
        code: 'PY101',
        name: 'Introduction to Python',
        teacher_id: '[1]',
        language: '[{"id": 1,"name": "Python","restrictionId": 1}]',
      },
      {
        idclass: 2,
        code: 'JS201',
        name: 'JavaScript for Web Development',
        teacher_id: '[2, 5]',
        language: '[{"id": 2,"name": "Javascript","restrictionId": 3},{"id": 1,"name": "Python","restrictionId": 1}]',
      },
      {
        idclass: 3,
        code: 'JAVA301',
        name: 'Advanced Java Concepts',
        teacher_id: '[2]',
        language: '[{"id": 3,"name": "Java","restrictionId": 2}]',
      },
    ]);

    await User.bulkCreate([
      {
        id: 1,
        name: 'Alice Johnson',
        gmail: 'alice.johnson@gmail.com',
        teacher: true,
        language: '[{"id": 1,"name": "Python","restrictionId": 1}]',
        googleId: null,
        class: 1,
      },
      {
        id: 2,
        name: 'Bob Smith',
        gmail: 'bob.smith@gmail.com',
        teacher: true,
        language: '[{"id": 2,"name": "Javascript","restrictionId": 3},{"id": 1,"name": "Python","restrictionId": 1}]',
        googleId: null,
        class: 2,
      },
      {
        id: 3,
        name: 'Charlie Brown',
        gmail: 'charlie.brown@gmail.com',
        teacher: false,
        language: '[{"id": 2,"name": "Javascript","restrictionId": 3}]',
        googleId: null,
        class: 3,
      },
      {
        id: 4,
        name: 'Diana Lee',
        gmail: 'diana.lee@gmail.com',
        teacher: false,
        language: '[{"id": 3,"name": "Java","restrictionId": 2}]',
        googleId: null,
        class: null,
      },
      {
        id: 5,
        name: 'Arnau A22 Fernández Gil',
        gmail: 'a22arnfergil@inspedralbes.cat',
        teacher: true,
        language: '[{"id": 3,"name": "Java","restrictionId": 2}]',
        googleId: "EHGRxTGwEfXaB3U4XJ9RAy2E8nA3",
        class: null,
      },
    ]);

    await Language.bulkCreate([
      { id: 1, name: 'Python' },
      { id: 2, name: 'JavaScript' },
      { id: 3, name: 'Java' },
    ]);

    await Restriction.bulkCreate([
      { content: "Only answer questions by explaining, don't provide code" },
      { content: "Answer questions by providing code snippets but not direct answers to the problem" },
      { content: "Answer questions by providing full code examples" },
    ]);

    console.log('✅ Seed completed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seed();
