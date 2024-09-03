'use client'

import React from 'react'
import { ApolloLink, HttpLink } from '@apollo/client'
import clientCookies from 'js-cookie'
import {
  ApolloNextAppProvider,
  InMemoryCache,
  ApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support'

import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import { setVerbosity } from 'ts-invariant'

if (process.env.NODE_ENV === 'development') {
  setVerbosity('debug')
  loadDevMessages()
  loadErrorMessages()
}

export function ApolloWrapper({
  children,
  delay: delayProp,
}: React.PropsWithChildren<{
  // this will be passed in from a RSC that can read cookies
  // on the client we want to read the cookie instead
  // but in SSR we don't have access to cookies, so
  // we have to use this weird workaround
  delay: number;
}>) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )

  function makeClient() {
    const httpLink = new HttpLink({
      uri: 'https://api.testnet.aptoslabs.com/v1/graphql',
      fetchOptions: { cache: 'no-store' },
    })

    const delayLink = new ApolloLink((operation, forward) => {
      const delay =
        typeof window === 'undefined'
          ? delayProp
          : clientCookies.get('apollo-x-custom-delay') ?? delayProp
      operation.setContext(({ headers = {} }) => {
        return {
          headers: {
            ...headers,
            'x-custom-delay': delay,
          },
        }
      })

      return forward(operation)
    })
    const link =
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: false,
              cutoffDelay: 100,
            }),
            delayLink,
            httpLink,
          ])
        : ApolloLink.from([delayLink, httpLink])

    return new ApolloClient({
      cache: new InMemoryCache(),
      link,
    })
  }
}