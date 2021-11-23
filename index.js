// console.log('Servidor running ;)')

// npm install express 
// npm install --save cors
const express=require('express');

// const cors=require('cors');
// const corstOptions={
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200
// };
// app.use(cors(corstOptions));

const app=express();
const PORT=3001;

const fs=require('fs');


const path=require('path');
const pathToFile=path.resolve('./data.json');
console.log(pathToFile);

const getResources=()=>JSON.parse(fs.readFileSync(pathToFile));

app.use(express.json());//--> se le indica los datos que va a recibir

app.get('/', (req, res)=>{
    res.send('Hello world from express / ');
});

app.get('/api/resources',(req, res)=>{
    const RESOURCES=getResources();

    // res.send('Hello from api/resources ');
    res.send(RESOURCES);//-->Se obtienen los datos de data.json
});

//Para solicitar el id y navegar a la pág de los detalles//////////////////
app.get('/api/resources/:id',(req, res)=>{
    const RESOURCES=getResources();

    const {id}=req.params;//--> extrayendo el id. Se pone id porque así se ha definido en la URL dinámica
    const resource=RESOURCES.find((item)=>item.id===id);//-->se busca en el arreglo
    // res.send('Hello from api/resources ');
    res.send(resource);//-->Se obtienen los datos de data.json
    //Para probarlo, se hace la petición en el navegador a la URL con un id que se tenga en el JSON
});

app.post('/api/resources',(req, res)=>{
    const RESOURCES=getResources();
    const resource=req.body;
    resource.createdAt=new Date();
    resource.status='inactive';
    resource.id=Date.now().toString();
    RESOURCES.unshift(resource);//--> unshift para que lo ponga al inicio del json

    fs.writeFile(pathToFile, JSON.stringify(RESOURCES, null, 2), (error)=>{
        if(error){
            return res.status(422).send('Cannot store data in the file');
        }else {

            return res.send('Datos recibidos en node');
        }
    })
    // console.log('Datos recibidos en node (POST end-point)')
    // console.log(req.body);
});

app.listen(PORT, ()=>{
    console.log('Server is listening on Port: '+PORT);
});