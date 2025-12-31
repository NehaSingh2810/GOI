const axios = require('axios');

(async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/news?page=1&limit=6');
    const data = res.data;
    console.log('Status:', res.status);
    console.log('Total news in page:', (data.news || []).length);
    (data.news || []).forEach((n, i) => {
      console.log('\n--- Item', i+1, '---');
      console.log('id:', n._id);
      console.log('title:', n.title);
      console.log('category:', n.category);
      console.log('imageUrl:', n.imageUrl);
      console.log('publishedAt:', n.publishedAt || n.createdAt);
    });
  } catch (err) {
    console.error('Request failed:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Body:', err.response.data);
    }
    process.exit(1);
  }
})();
