import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.css';
import { Layout } from '../src/components/Layout/Layout';
import { VirtualKeyboard } from '../src/pages/VirtualKeyboard/VirtualKeyboard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout>
      <VirtualKeyboard />
    </Layout>
  </StrictMode>
);
