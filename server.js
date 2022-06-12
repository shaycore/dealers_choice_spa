const db = require('./db');
const { Hero, Role } = db;
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use('/assets', express.static('assets'));
app.use('/dist', express.static('dist'));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/heroes', async(req, res, next)=> {
    try {
        res.send(await Hero.findAll());
    }
    catch(ex) { 
        next(ex);
    }
});

app.get('/api/roles', async(req, res, next)=>{
    try {
        res.send(await Role.findAll());
    }
    catch(ex) {
        next(ex);
    }
});

//Routes to Add and Delete Heroes
app.post('/api/heroes', async(req, res, next)=> {
    try {
      res.status(201).send( await Hero.create({ name: req.body.name, roleId: req.body.role }));
    }
    catch(ex){
      next(ex);
    }
  });

app.delete('/api/heroes/:id', async(req, res, next)=> {
    try {
        const hero = await Hero.findByPk(req.params.id);
        await hero.destroy();
        res.sendStatus(204);
    }
    catch(ex) {
        next(ex);
    }
});

//Catch err

app.use((err, req, res, next)=> {
    console.log(err);
    res.status(500).send(err);
  });

const init = async()=> {
    try {
        await db.syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`app listening on port ${port}`));
    }
    catch(ex) {
        console.log(ex);
    }
};

init();