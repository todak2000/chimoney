/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://chimoney-pi.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
