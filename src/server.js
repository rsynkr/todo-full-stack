import express from 'express';
import path,{dirname} from 'path';
import { fileURLToPath } from 'url';
const app = express();
const PORT =   process.env.PORT||5000


import authroutes from './routes/authroutes.js'
import todoroutes from './routes/todoroutes.js'
import authmiddleware from './middleware/authmiddleware.js';


const __filename = fileURLToPath(import.meta.url);

const __dirname= dirname(__filename);
app.use(express.static(path.join(__dirname,"../public")));
app.use(express.json())
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"))

})


app.use("/auth",authroutes)
app.use("/todos",authmiddleware,todoroutes)







app.listen(PORT, () => {

    
})