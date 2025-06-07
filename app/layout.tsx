'use client'

import React from "react"
import { Provider } from "react-redux"
import { store } from "../store"



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{margin: '100px 0 100px 0'}}>
        <Provider store={store}>
          {children}
        </Provider>

      </body>
    </html>
  )
}
