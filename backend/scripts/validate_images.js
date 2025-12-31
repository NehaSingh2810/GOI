require('dotenv').config();
const axios = require('axios');
const connectDB = require('../config/db');
const News = require('../models/News');

const TIMEOUT = 7000;

(async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const all = await News.find({}).select('title imageUrl');
    console.log(`Found ${all.length} news items (checking those with imageUrl)...`);

    let checked = 0;
    let invalidCount = 0;

    for (const item of all) {
      if (!item.imageUrl) continue;
      checked++;
      const url = item.imageUrl;

      try {
        // Try HEAD first
        const headResp = await axios.head(url, { timeout: TIMEOUT, maxRedirects: 5, validateStatus: null });
        const ct = headResp.headers && headResp.headers['content-type'];
        if (ct && ct.startsWith('image')) {
          // valid image
          continue;
        }

        // If HEAD didn't indicate image, try GET (stream) to inspect headers
        const getResp = await axios.get(url, { timeout: TIMEOUT, responseType: 'stream', maxRedirects: 5, validateStatus: null });
        const getCt = getResp.headers && getResp.headers['content-type'];
        if (getCt && getCt.startsWith('image')) {
          // valid image
          // close stream
          if (getResp.data && getResp.data.destroy) getResp.data.destroy();
          continue;
        }

        // Not an image (or couldn't determine)
        console.log(`Invalid image URL for "${item.title}": ${url} (content-type: ${ct || getCt || 'unknown'})`);
        item.imageUrl = null;
        await item.save();
        invalidCount++;

        if (getResp && getResp.data && getResp.data.destroy) getResp.data.destroy();
      } catch (err) {
        // On any error (timeout, network, 403), treat as invalid and null it
        console.log(`Error accessing image for "${item.title}": ${url} -> ${err.message}`);
        item.imageUrl = null;
        await item.save();
        invalidCount++;
      }
    }

    console.log(`Checked ${checked} items with imageUrl. Invalid/cleared: ${invalidCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Script error:', error);
    process.exit(1);
  }
})();
