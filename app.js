/* on appelle express , on declare app qui contient express
et on permet a app de s'exporter vers d'autres fichiers */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');


const Thing = require('./models/Thing');


/* mongodb+srv://marco:HpdJXCMBQz9dGDPq@sandbox.vpspe.mongodb.net/test?retryWrites=true&w=majority
 */
mongoose.connect('mongodb+srv://marco:HpdJXCMBQz9dGDPq@sandbox.vpspe.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());



//reccupere tous les produits
app.get('/api/products', (req, res, next) => {
    Product.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({error}))
  });


//reccupere un produit a partir de son id
app.get('/api/products/:id', (req, res, next)=> {
    Product.findOne({ _id: req.params.id})
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({error}));
})
//créer un nouveau produit
app.post('/api/products', (req, res, next) => {
    delete req.body._id;
    const product = new Product({
        ...req.body
    });
    Product.save()
    .then(() => res.status(201).json({ message: 'produit enregistré'}))
    .catch(error => res.status(400).json({error}));
});

//modifier un produit
app.put('/api/products/:id', (req, res, next) => {
      Product.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Modified!'}))
        .catch(error => res.status(400).json({error}));
});

//supprimer un produit
app.delete('api/products/:id', (req, res, next) => {
      Product.deleteOne({ _id: req.params.id})
      .then(() => res.status(200).json({ message: 'objet supprimé'}))
      .catch(error => res.status(400).json({error}));
});


module.exports = app;