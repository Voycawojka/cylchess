import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { useEffect, useState } from 'react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [ apollo, setApollo ] = useState(null)

  useEffect(() => {
    const httpLink = new HttpLink({
      uri: 'http://localhost:3000/graphql'
    })
    
    const wsLink = new WebSocketLink({
      uri: 'ws://localhost:3000/graphql',
      webSocketImpl: WebSocket,
      options: {
        reconnect: true
      }
    })
    
    const link = split(({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    }, wsLink, httpLink)
    
    setApollo(new ApolloClient({
      cache: new InMemoryCache(),
      link
    }))
  }, [])

  if (!apollo) {
    return null
  }

  return (
    <ApolloProvider client={apollo}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
