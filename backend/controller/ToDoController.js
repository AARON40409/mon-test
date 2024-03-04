const ToDoModel = require('../models/ToDoModel');


module.exports.getToDos = async (req, res) => {
    const toDos = await ToDoModel.find()
    res.send(toDos)
};


module.exports.saveToDos = async (req, res) => {
    const {toDo} = req.body

    ToDoModel.create({toDo})
    .then(data => {
        console.log("tache créee avec succès")
        res.status(200).send(data)
    })
    .catch((err) => {
        console.log(err)
        res.send({error: err, msg: "ceci n'est pas possible"})
    });
}


module.exports.updateToDos = async (req, res) => {
    const {id} = req.params
    const {toDo} = req.body;

    ToDoModel.findByIdAndUpdate(id, {toDo})
    .then(() => {
        res.send("tache modifiée avec succès")
    })
    .catch((err) => {
        console.log(err)
        res.send({error: err, msg: "ceci n'est pas possible"})
    });
}


module.exports.deleteToDos = async (req, res) => {
    const {id} = req.params

    ToDoModel.findByIdAndDelete(id)
    .then(() => {
        res.send("tache supprimée avec succès")
    })
    .catch((err) => {
        console.log(err)
        res.send({error: err, msg: "ceci n'est pas possible"})
    });
}