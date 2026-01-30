import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.css';
import { Layout } from '../src/components/Layout/Layout';
import { ViewportKeyboardJoint, type InteractiveWidgetValue } from '../src/pages/ViewportKeyboardJoint/ViewportKeyboardJoint';

// Detect interactive-widget value from viewport meta tag
function getInteractiveWidgetValue(): InteractiveWidgetValue {
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  const content = viewportMeta?.getAttribute('content') || '';

  if (content.includes('interactive-widget=resizes-visual')) {
    return 'resizes-visual';
  }
  if (content.includes('interactive-widget=resizes-content')) {
    return 'resizes-content';
  }
  if (content.includes('interactive-widget=overlays-content')) {
    return 'overlays-content';
  }
  return 'default';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout>
      <ViewportKeyboardJoint interactiveWidget={getInteractiveWidgetValue()} />
    </Layout>
  </StrictMode>
);
