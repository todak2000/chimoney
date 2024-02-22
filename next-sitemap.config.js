/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dashlytics.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
