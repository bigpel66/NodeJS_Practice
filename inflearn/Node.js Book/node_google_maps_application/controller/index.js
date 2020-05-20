const util = require('util');
const googleMaps = require('@google/maps');
const History = require('../schemas/history');
const Favorite = require('../schemas/favorite');

const googleMapsClient = googleMaps.createClient({
    key: process.env.PLACES_API_KEY,
});

module.exports.getMain = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({});
        const histories = await History.find({}).limit(5).sort('-createdAt');

        res.render('index', { results: favorites, histories });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.getQueryAutoComplete = (req, res, next) => {
    googleMapsClient.placesQueryAutoComplete(
        {
            input: req.params.query,
            language: 'ko',
        },
        (err, response) => {
            if (err) {
                return next(err);
            } else {
                return res.json(response.json.predictions);
            }
        }
    );
};

module.exports.getQuerySearch = async (req, res, next) => {
    const googlePlaces = util.promisify(googleMapsClient.places);
    const googlePlacesNearby = util.promisify(googleMapsClient.placesNearby);
    const { lat, lng, type } = req.query;

    try {
        const histories = await History.find({}).limit(5).sort('-createdAt');

        const newHistory = new History({
            query: req.params.query,
        });

        await newHistory.save();

        let response;

        if (lat && lng) {
            response = await googlePlacesNearby({
                keyword: req.params.query,
                language: 'ko',
                location: `${lat},${lng}`,
                rankby: 'distance',
                type,
            });
        } else {
            response = await googlePlaces({
                query: req.params.query,
                language: 'ko',
            });
        }

        res.render('result', {
            title: `${req.params.query} Search Result`,
            results: response.json.results,
            query: req.params.query,
            histories,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.postFavoriteLocation = async (req, res, next) => {
    try {
        const favorite = new Favorite({
            placeId: req.params.id,
            name: req.body.name,
            location: [req.body.lng, req.body.lat],
        });

        await favorite.save();

        res.send('Favorite saved');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.deleteFavoriteLocation = async (req, res, next) => {
    try {
        await Favorite.remove({ placeId: req.params.id });
        res.send('Favorite deleted');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// WORKING EVERYWHERE, BUT KOREA
module.exports.getDirections = async (req, res, next) => {
    try {
        const { origin, destination } = req.query;
        const directions = util.promisify(googleMapsClient.directions);
        const response = await directions({ origin, destination });
        console.log(response);
        res.json(response);
    } catch (err) {
        console.error(err);
        next(err);
    }
};
