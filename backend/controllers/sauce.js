const Sauce = require('../models/sauce')
const fs = require('fs');
const user = require('../models/user');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce =  (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.manageLikeSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

  switch(like){
    case 1 : 
      Sauce.updateOne(
        { _id: sauceId }, 
        { $push:
           { usersLiked: userId },
            $inc: { likes: +1 } 
          }
        )
        .then(() => res.status(200).json({ message: 'like'}))
        .catch((error) => res.status(400).json({ error }));
    break;

    case -1 :
      Sauce.updateOne(
        { _id: sauceId},
        { $push: 
          {usersDisliked: userId },
          $inc: { dislikes: +1 }
        }
      )
      .then(() => res.status(200).json({ message: 'disliked'}))
      .catch((error) => res.status(400).json({ error }));
    
    break;

    case 0 :
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne({ _id: sauceId},
            { $pull: 
              { usersLiked: userId }, 
              $inc: { likes: -1 }          
            }
            )
              .then(() => res.status(200).json({ message: 'remove'}))
              .catch((error) => res.status(400).json({ error }));
          }
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne({ _id: sauceId},
            { $pull: 
              { usersDisliked: userId }, 
              $inc: { dislikes: -1 }          
            }
            )
              .then(() => res.status(200).json({ message: 'remove'}))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(400).json({ error }));
    break;
  }
}