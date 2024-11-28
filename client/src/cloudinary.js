// src/cloudinary.js
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'doruryee7', // Replace with your Cloudinary cloud name
  },
});

export default cld;
