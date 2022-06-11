const db = require('./db');
const { Hero, Role } = db;
const express = require('express');
const app = express();
const path = require('path');

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