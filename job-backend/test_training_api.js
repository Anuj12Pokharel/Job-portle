const fetch = require('node-fetch'); // Assuming node-fetch or native fetch in Node 18+

async function testApi() {
    const baseUrl = 'http://localhost:5000/api/training';

    console.log('1. Testing POST (Create Training)...');
    try {
        const createRes = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: "Mastering React",
                description: "Deep dive into React ecosystem",
                instructor: "Anjali Singh",
                duration: "10 Weeks",
                price: "$499",
                startDate: "2024-05-01",
                image: "https://example.com/react.jpg"
            })
        });
        const createData = await createRes.json();
        console.log('Create Response:', createData);
    } catch (err) {
        console.error('Create Failed:', err.message);
    }

    console.log('\n2. Testing GET (List Trainings)...');
    try {
        const getRes = await fetch(baseUrl);
        const getData = await getRes.json();
        console.log('Get Response:', getData);
    } catch (err) {
        console.error('Get Failed:', err.message);
    }
}

testApi();
