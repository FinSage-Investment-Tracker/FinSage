const express = require('express');
const router = express.Router();
const Parser = require('rss-parser');
const parser = new Parser();

const ET_MARKET_FEED = 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms';
const LIVE_MINT_COMPANIES_FEED = 'https://www.livemint.com/rss/companies';
const LIVE_MINT_MARKETS_FEED = 'https://www.livemint.com/rss/markets';

// GET /api/news - Fetch Indian market news with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    // Fetch the RSS feeds
    const etFeed = await parser.parseURL(ET_MARKET_FEED);
    const liveMintCompaniesFeed = await parser.parseURL(LIVE_MINT_COMPANIES_FEED);
    const liveMintMarketsFeed = await parser.parseURL(LIVE_MINT_MARKETS_FEED);

    // Combine all news items and add source tag
    const combinedNews = [
      ...etFeed.items.map(item => ({ ...item, source: "Economictimes" })),
      ...liveMintCompaniesFeed.items.map(item => ({ ...item, source: "Livemint" })),
      ...liveMintMarketsFeed.items.map(item => ({ ...item, source: "Livemint" }))
    ];

    // Sort news items by date (if available)
    combinedNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Paginate the news items
    const startIndex = (page - 1) * pageSize;
    const paginatedNews = combinedNews.slice(startIndex, startIndex + pageSize);

    // Return paginated results with total count
    res.json({
      totalResults: combinedNews.length,
      articles: paginatedNews,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
});

module.exports = router;