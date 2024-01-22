// For more information, see https://crawlee.dev/
import { Dataset, CheerioCrawler, log, LogLevel } from 'crawlee';


import { router } from './routes.js';

const startUrls = ['https://biiitchan.com/m-ld/b4.2/?argument=snfBDnnQ&dmai=a63c4ada0bd983&gad_source=1&gclid=Cj0KCQiAwbitBhDIARIsABfFYIJRLUyrllmBshhVBmnzEwapYyXU69vik-aFquH9noeJ5oVgCwk5Z5QaAgX4EALw_wcB'];

// const crawler = new CheerioCrawler({
//     // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
//     requestHandler: router,
//     // Comment this option to scrape the full website.
//     maxRequestsPerCrawl: 20,
    
// });

const crawler = new CheerioCrawler({
    // The crawler downloads and processes the web pages in parallel, with a concurrency
    // automatically managed based on the available system memory and CPU (see AutoscaledPool class).
    // Here we define some hard limits for the concurrency.
    minConcurrency: 10,
    maxConcurrency: 50,

    // On error, retry each page at most once.
    maxRequestRetries: 1,

    // Increase the timeout for processing of each page.
    requestHandlerTimeoutSecs: 30,

    // Limit to 10 requests per one crawl
    maxRequestsPerCrawl: 10,

    // This function will be called for each URL to crawl.
    // It accepts a single parameter, which is an object with options as:
    // https://crawlee.dev/api/cheerio-crawler/interface/CheerioCrawlerOptions#requestHandler
    // We use for demonstration only 2 of them:
    // - request: an instance of the Request class with information such as the URL that is being crawled and HTTP method
    // - $: the cheerio object containing parsed HTML
    async requestHandler({ request, $ }) {
        log.debug(`Processing ${request.url}...`);

        $('img').each((_, el) => {
            console.log($(el).attr('src'));
        });

        const body = $('body').text().split('\n').map((line) => line.trim()).filter((line) => line.length > 0);

        // Extract data from the page using cheerio.
        const title = $('title').text();

        const h1texts: { text: string }[] = [];
        $('h1').each((_, el) => {
            h1texts.push({
                text: $(el).text(),
            });
        });

        // Store the results to the dataset. In local configuration,
        // the data will be stored as JSON files in ./storage/datasets/default
        await Dataset.pushData({
            url: request.url,
            title,
            h1texts,
            body,
        });
    },

    // This function is called if the page processing failed more than maxRequestRetries + 1 times.
    failedRequestHandler({ request }) {
        log.debug(`Request ${request.url} failed twice.`);
    },
});

await crawler.run(startUrls);
