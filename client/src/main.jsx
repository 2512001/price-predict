// main.jsx or index.js
import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import App from './App.jsx';
const App = React.lazy(() => import('./App.jsx'));
import LoadingIcon from './components/LoadingIcon.jsx';

import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import { store } from '../src/redux/store.js'; // adjust path as needed
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        <QueryClientProvider client={queryClient} >
          <Suspense fallback={<LoadingIcon />}>
            <App />
          </Suspense>
        </QueryClientProvider>
      {/* </PersistGate> */}
    </Provider>
  </StrictMode>
);
