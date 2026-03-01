const mongoose = require('mongoose');

const check = async () => {
  try {
    const uri = 'mongodb://localhost:27017/lbs_school_erp';
    console.log('Connecting to:', uri);
    await mongoose.connect(uri);
    console.log('Connected!');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    const teachers = await mongoose.connection.db.collection('teachers').find().toArray();
    const users = await mongoose.connection.db.collection('users').find().toArray();
    const classes = await mongoose.connection.db.collection('classes').find().toArray();

    console.log('--- DB SUMMARY ---');
    console.log('Teachers Count:', teachers.length);
    console.log('Users Count:', users.length);
    console.log('Classes Count:', classes.length);
    
    if (teachers.length > 0) {
        console.log('Last Teacher:', teachers[teachers.length - 1].firstName, teachers[teachers.length - 1].email);
    }
    console.log('------------------');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

check();
