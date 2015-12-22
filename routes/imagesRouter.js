'use strict';

var router = require('express').Router();
var ImageModel = require('../models/images.js');
var fs = require('fs');

/**
 * Gets image from mongodb
 * @param  {HttpRequest}   req
 * @param  {HttpResponse}  res
 * @param  {Function(req, res, next)} next
 * @return {Image}
 */
function getMongoImages(req, res, next) {
  /*var image = fs.readFileSync('images/Background.png');

  var newImage = new ImageModel({
    data: image,
    contentType: 'image/png'
  });

  newImage.save();*/
  ImageModel.findOne({contentType: 'image/png'}, function(err, image) {
    if(err)
      return next(err);
    res.contentType(image.contentType);
    res.status(200).send(image.data);
  });
}

/**
 * Adds image to database
 * @param {HttpRequest}   req
 * @param {HttpResponse}  res
 * @param {Function(req, res, next)} next
 */
function addImage(req, res, next) {
  var imageQuery = {name: req.body.imageName};
  ImageModel.findOne(imageQuery, function(err, image) {
    if(err)
      return next(err);

    var resData = {};

    if(image) {
      resData.msg = 'This image name already exists';
      resData.success = false;
      res.status(400).json(resData);
    }

    var newImg = new ImageModel({
      data: req.body.imageData,
      contentType: 'image/png'
    });

    newImg.save(function(err, image) {
      if(err)
        return next(err);

      resData.msg = 'Movie saved';
      res.status(200).json(resData);
    });
  });
}

router
  .get('/', getMongoImages)
  .post('/', addImage);

module.exports = router;
