import React, { Fragment, Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

// This query is executed at run time by Apollo.
const APOLLO_QUERY = gql`{
  allPeople(first:5) {
    edges {
      node {
        name
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}`;

export class List extends Component {

  render() {
    return (
    <Query query={APOLLO_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading star...</p>;
          if (error) return <p>Error: ${error.message}</p>;

          console.log(data);
          const { search } = data.twitter;
          return (
            <Fragment>
              {search.map(tweet =>
                <div>
                  <p>{tweet.user.screen_name}</p>
                  <p>{tweet.text}</p>
                </div>
              )}
            </Fragment>
          );
        }}
      </Query>
    )
  }
}