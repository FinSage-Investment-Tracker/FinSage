const puppeteer = require('puppeteer');

const getStockNews = async (company) => {
  // Construct the search URL based on the company parameter
  const url = `https://news.google.com/search?hl=en-IN&q=${company}&gl=IN&ceid=IN:en`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const [page] = await browser.pages();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('article', { timeout: 10000 });

    const news = await page.evaluate(() => {
      const articles = [];
      const articleElements = document.querySelectorAll('article');

      articleElements.forEach((article) => {
        const timeElement = article.querySelector('time.hvbAAd');
        const titleElement = article.querySelector('a.JtKRv');
        const linkElement = article.querySelector('a.JtKRv');

        const time = timeElement ? timeElement.innerText : 'No Time Available';
        const title = titleElement ? titleElement.innerText : 'No Title';
        const link = linkElement ? linkElement.href : '';

        if (title && link) {
          articles.push({
            time,
            title,
            link, // Ensure that this is the actual article link
          });
        }
      });

      return articles.slice(0, 4); // Return top 8 articles
    });

    await page.close();
    await browser.close();

    return news;
  } catch (error) {
    console.error('Error in web scraper:', error);
    return [];
  }
};

module.exports = getStockNews;