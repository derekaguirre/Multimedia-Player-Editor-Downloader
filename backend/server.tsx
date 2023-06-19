
// Importing module
import express from 'express';
const app = express();
const cors = require('cors');

app.use(cors());
  
const PORT:number=3000;


//Temporary Non-Functional API
app.post("/upload", (req, res) => {
    // use modules such as express-fileupload, Multer, Busboy
    
    setTimeout(() => {
        console.log('file uploaded')
        return res.status(200).json({ result: true, msg: 'file uploaded' });
    }, 3000);
});

app.delete("/upload", (req, res) => {
    console.log('file deleted')
    return res.status(200).json({ result: true, msg: 'file deleted' });
});

app.listen(8080, () => {
    console.log(`Server running on port 8080`)
});
  
// Handling GET / Request
app.get('/', (req, res) => {
    res.send('Welcome to typescript backend!');
})
  
// Server setup
app.listen(PORT,() => {
    console.log('The application is listening on port '+PORT);
})