module.exports = {
    siteMetadata: {
      title: 'Gatsby With Apollo',
    },
    plugins: [
      {
        resolve: 'gatsby-source-graphql',
        options: {
          typeName: 'SWAPI',
          fieldName: 'swapi',
          url: 'https://api.graphcms.com/simple/v1/swapi',
        },
      },
    ],
  };