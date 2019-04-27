import React, { Fragment, Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

// This query is executed at run time by Apollo.
const APOLLO_QUERY = gql`
query content($first: Int, $skip: Int, $after: String) {
  apis: apisConnection(first: $first, skip: $skip, after: $after) {
    edges {
      node {
        id
        name
        description
        graphiqlLink
        docsLink
        repoLink
        tags
      }
    }
    pageInfo {
      startCursor
      endCursor
    }
  }
  apisConnection {
    aggregate {
      count
    }
  }
}`;



export class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPage: 1,
      pageSize: 3,
      pageRange: [],
      totalPages: 0
    }
  }

  render() {
    return (
      <Fragment>
        <div className="jumbotron">
          <h1 className="display-4">Public GraphQL APIs</h1>
          <hr className="my-4" />
          <p>A collective list of public GraphQL APIs.</p>
          <a className="btn btn-info btn-lg" href="https://github.com/APIs-guru/graphql-apis" target="_blank" rel="noopener noreferrer" role="button">See the full list</a>
        </div>

        <Query query={APOLLO_QUERY} variables={{"first":this.state.pageSize}}>
        {({ data, loading, error, fetchMore }) => {
          if (loading) return <p>Loading APIs...</p>;
          if (error) return <p>Error: ${error.message}</p>;

          const results = data.apis.edges;
          const pageInfo = data.apis.pageInfo;
          const count = data.apisConnection.aggregate.count;

          return (
            <Fragment>
              <div className="text-center">
              <div className="btn-group" role="group" aria-label="pagination">
                {this.hasPrevPage(this.state.currentPage) ? 
                  <button onClick={e => 
                    this.setState({
                      currentPage: this.state.currentPage-1
                    }, () => {
                      fetchMore({
                        query: APOLLO_QUERY,
                        variables: this.getPageQueryVariables(),
                        updateQuery: (prev, {fetchMoreResult}) => {
                          if (!fetchMoreResult) return prev;
                          return fetchMoreResult;
                        }
                      })
                    })} className="btn btn-secondary"><i className="fas fa-chevron-left"></i> Previous page
                  </button>
                  :
                  <button className="btn btn-outline-secondary" disabled><i className="fas fa-chevron-left"></i> Previous page</button>
                }
                {this.getPageRange(count).map(pg => 
                  <button key={pg} onClick={e => 
                    this.setState({
                      currentPage: pg
                    }, () => {
                      fetchMore({
                        query: APOLLO_QUERY,
                        variables: this.getPageQueryVariables(),
                        updateQuery: (prev, {fetchMoreResult}) => {
                          if (!fetchMoreResult) return prev;
                          return fetchMoreResult;
                        }
                      })
                    })} className={"btn " + (this.state.currentPage === pg ? "btn-info" : "btn-secondary")}>{pg}
                  </button>
                )}
                {this.hasNextPage(count, this.state.currentPage, this.state.pageSize) && pageInfo.endCursor ? 
                  <button onClick={e => 
                    this.setState({
                      currentPage: this.state.currentPage+1
                    }, () => {
                      fetchMore({
                        query: APOLLO_QUERY,
                        variables: {"first":this.state.pageSize, "after": pageInfo.endCursor},
                        updateQuery: (prev, {fetchMoreResult}) => {
                          if (!fetchMoreResult) return prev;
                          return fetchMoreResult;
                        }
                      })
                    })} className="btn btn-secondary">Next page <i className="fas fa-chevron-right"></i>
                  </button>
                  :
                  <button className="btn btn-outline-secondary" disabled>Next page <i className="fas fa-chevron-right"></i></button>
                }
              </div>
              </div>

              <hr />
              <p>Total API count: {count}</p>
              {results.map(api =>
                <div key={api.node.id} className="alert alert-info" role="alert">
                  <h4 className="alert-heading">{api.node.name}</h4>
                  <p>{api.node.description}</p>
                  <p><i className="fas fa-flask"></i> <a href={api.node.graphiqlLink} target="_blank" rel="noopener noreferrer">Try it out here</a></p>
                  <hr />
                  <p className="mb-0">(id: {api.node.id})</p>
                </div>
              )}
            </Fragment>
          );
        }}
      </Query>
    </Fragment>
    
    )
  }

  getPageQueryVariables() {
    return {"first":this.state.pageSize,"skip":(this.state.currentPage-1)*this.state.pageSize}
  }

  getPageRange(totalCount) {
    var totalPages = this.totalPages(totalCount, this.state.pageSize);
    var range = [];
    var startPage = this.state.currentPage + 4 <= totalPages ? Math.max(this.state.currentPage - 2, 1) : Math.max(totalPages - 4, 1);
    for (var i = startPage; i <= Math.min(startPage + 4, totalPages); i++) {
      range.push(i);
    }
    return range;
  }

  hasNextPage(count, currentPage, pageSize) {
    return currentPage < this.totalPages(count, pageSize);
  }

  hasPrevPage(currentPage) {
    return currentPage > 1;
  }

  totalPages(count, pageSize) {
    return Math.ceil(count / pageSize);
  }
}

