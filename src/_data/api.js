const { GraphQLClient, gql } = require('graphql-request');


require('dotenv').config()

async function hygraphData() {
  try {
    const client = new GraphQLClient(process.env.HYG_API);

    const query = /* First GraphQL query goes here */ gql`
         query Categories {
          categories {
            id
            name
            slug
            description
            thumbnail
          }
      }
    `;

    // const query2 = /* Second GraphQL query goes here */ `
    //   {
    //     // Your second query to fetch data from Hygraph CMS
    //   }
    // `;

    const {categories} = await client.request(query)
      

    return categories; // Modify this based on the structure of your data
  } catch (error) {
    console.error('Error fetching data from Hygraph CMS:', error);
    return null;
  }
}

module.exports = hygraphData;

