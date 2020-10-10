import React from "react";
import { Link, graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Pagination from "../components/pagination";

const BlogIndex = ({ data, location, pageContext }) => {
  console.log(data);
  const siteTitle = data.site.siteMetadata.title;
  const { edges } = data.allMarkdownRemark;
  const {
    currentPage,
    hasNextPage,
    hasPrevPage,
    prevPagePath,
    nextPagePath
  } = pageContext;
  const pageTitle = currentPage > 0 ? `Posts - Page ${currentPage} - ${siteTitle}` : siteTitle;

  if (edges.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={pageTitle}>
      <SEO title="All posts" />
      <ol className="blog-list">
        {edges.map(edge => {
          const title = edge.node.frontmatter.title || edge.node.fields.slug

          return (
            <li key={edge.node.fields.slug} className="blog-list-item">
              <Link to={edge.node.fields.slug} itemProp="url" className="title">
                <span itemProp="headline">{title}</span>
              </Link>
              <small className="date">{edge.node.frontmatter.date}</small>
            </li>
          )
        })}
      </ol>
      <Pagination
        prevPagePath={prevPagePath}
        nextPagePath={nextPagePath}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
      />
    </Layout>
  )
}

export default BlogIndex

export const query = graphql`
  query IndexTemplate($postsLimit: Int!, $postsOffset: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: $postsLimit,
      skip: $postsOffset,
      filter: { frontmatter: { template: { eq: "post" } } },
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`