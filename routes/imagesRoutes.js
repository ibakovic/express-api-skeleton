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

}

router
  .get('/', getMongoImages)
  .post('/', addImage);

module.exports = router;
