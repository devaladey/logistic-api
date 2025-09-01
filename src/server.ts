import express from 'express';

const app = express();



app.get('/', (req, res)=> {
    res.send("Hello from the server side!");
})

app.listen(3000, ()=> console.log(`Server running on port: ${3000}`))