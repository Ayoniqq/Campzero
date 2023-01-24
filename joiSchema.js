const { string } = require('joi');
const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages:
        { 'string.escapeHTML': '{{#label}} must not include HTML!' },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;

            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

//VALIDATE JOI SCHEMA FOR DB
module.exports.campgroundJoiSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(1),
    //image: Joi.string().required(),
    description: Joi.string().required().escapeHTML(),
    deleteImages: Joi.array()
}).required();

module.exports.reviewJoiSchema = Joi.object({
    reviewText: Joi.string().required().escapeHTML(),
    rating: Joi.number().required()
}).required();

//module.exports = campgroundJoiSchema;