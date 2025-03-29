import express from "express";

const routerNotes = express.Router();

routerNotes.get('/mynotes', (req, res)=>{

})

routerNotes.post('/add', (req, res)=>{

})

routerNotes.delete('/delete/:id', (req, res)=>{

})

routerNotes.put('/complete/:id', (req, res)=>{

})

export default routerNotes;