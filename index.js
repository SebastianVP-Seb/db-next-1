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

//Para traer el recurso activo
app.get('/api/activeresource',(req, res)=>{
    const RESOURCES=getResources();

    const activeResource=RESOURCES.find(resource=>resource.status==='active');
    // res.send('Hello from api/resources ');
    res.send(activeResource);//-->Se obtienen los datos de data.json
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

//Para actualizar una tarea
app.patch('/api/resources/:id',(req, res)=>{
    const RESOURCES=getResources();

    const {id}=req.params;//--> extrayendo el id. Se pone id porque así se ha definido en la URL dinámica
    const index=RESOURCES.findIndex((item)=>item.id===id);//-->se busca en el arreglo

    //verifica si el estado está Activo y si sí, lo guarda en esta var
    const activeResource=RESOURCES.find(resource=>resource.status==='active');

    RESOURCES[index]=req.body;

    //Para que sólo haya un recurso activado a la vez
    if(req.body.status==='active') {
        if(activeResource) {
            return res.status(422).send('There is active resource already');
        }else {//si no: actívalo
            RESOURCES[index].status='active';
            RESOURCES[index].activationTime=new Date();
        }
    }

    fs.writeFile(pathToFile, JSON.stringify(RESOURCES, null, 2), (error)=>{
        if(error){
            return res.status(422).send('Cannot store data in the file');
        }else {
            return res.send('Datos actualizados');
        }
    })
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