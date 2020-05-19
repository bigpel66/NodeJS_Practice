const util = require('util');
const googleMaps = require('@google/maps');
const History = require('../schemas/history');

const googleMapsClient = googleMaps.createClient({
    key: process.env.PLACES_API_KEY,
});
module.exports.getMain = (req, res, next) => {
    res.render('index');
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

    try {
        const newHistory = new History({
            query: req.params.query,
        });

        await newHistory.save();

        const response = await googlePlaces({
            query: req.params.query,
            language: 'ko',
        });

        res.render('result', {
            title: `${req.params.query} Search Result`,
            results: response.json.results,
            query: req.params.query,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
