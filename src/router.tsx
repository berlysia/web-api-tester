import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home/Home';
import { VisualViewport } from './pages/VisualViewport/VisualViewport';
import { VirtualKeyboard } from './pages/VirtualKeyboard/VirtualKeyboard';
import { ViewportKeyboardJoint } from './pages/ViewportKeyboardJoint/ViewportKeyboardJoint';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/visual-viewport',
    element: (
      <Layout>
        <VisualViewport />
      </Layout>
    ),
  },
  {
    path: '/virtual-keyboard',
    element: (
      <Layout>
        <VirtualKeyboard />
      </Layout>
    ),
  },
  {
    path: '/viewport-keyboard',
    element: (
      <Layout>
        <ViewportKeyboardJoint />
      </Layout>
    ),
  },
]);
