import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:8083/graphql", 
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Content-Type": "application/json"
    }
  }),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Provider store={store}>
<React.StrictMode>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  </React.StrictMode>
</Provider>
);
