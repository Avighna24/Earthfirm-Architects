import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

// Threshold definitions for Web Vitals metrics
interface MetricThreshold {
  good: number;
  poor: number;
  unit: string;
}

const THRESHOLDS: Record<string, MetricThreshold> = {
  CLS: { good: 0.1, poor: 0.25, unit: '' },
  FCP: { good: 1800, poor: 3000, unit: 'ms' },
  INP: { good: 200, poor: 500, unit: 'ms' },
  LCP: { good: 2500, poor: 4000, unit: 'ms' },
  TTFB: { good: 800, poor: 1800, unit: 'ms' },
};

function getMetricRating(name: string, value: number): { rating: 'good' | 'needs-improvement' | 'poor'; color: string } {
  const threshold = THRESHOLDS[name];
  if (!threshold) {
    return { rating: 'good', color: '#10B981' }; // Emerald
  }

  if (value <= threshold.good) {
    return { rating: 'good', color: '#10B981' }; // Emerald
  }
  if (value <= threshold.poor) {
    return { rating: 'needs-improvement', color: '#F59E0B' }; // Amber
  }
  return { rating: 'poor', color: '#EF4444' }; // Rose
}

const logMetric = (metric: Metric) => {
  // Only log if running in development mode (Vite uses import.meta.env.DEV)
  if (import.meta.env.PROD) return;

  const { name, value, delta, id, entries } = metric;
  const threshold = THRESHOLDS[name];
  const unit = threshold?.unit || '';
  const { rating, color } = getMetricRating(name, value);

  const formattedValue = value.toFixed(name === 'CLS' ? 4 : 0);
  const formattedDelta = delta.toFixed(name === 'CLS' ? 4 : 0);

  // High-end terminal styling for console logs
  console.groupCollapsed(
    `%c⚡ [Performance] ${name}: ${formattedValue}${unit} (${rating.toUpperCase()})`,
    `color: #ffffff; background-color: ${color}; padding: 3px 6px; border-radius: 3px; font-weight: bold;`
  );

  console.log(`%cMetric ID: %c${id}`, 'color: #888; font-weight: bold;', 'color: #fff; font-family: monospace;');
  console.log(
    `%cCurrent Value: %c${formattedValue}${unit} %c(Change: ${formattedDelta > '0' ? '+' : ''}${formattedDelta}${unit})`,
    'color: #888; font-weight: bold;',
    `color: ${color}; font-weight: bold;`,
    'color: #666; font-style: italic;'
  );

  if (threshold) {
    console.log(
      `%cThresholds: %cGood <= ${threshold.good}${unit} | Poor > ${threshold.poor}${unit}`,
      'color: #888; font-weight: bold;',
      'color: #bbb;'
    );
  }

  if (entries && entries.length > 0) {
    console.log('%cRaw Performance Entries:', 'color: #888; font-weight: bold;', entries);
  }

  console.groupEnd();
};

export function initPerformanceMonitor() {
  // Only register during development to prevent any analytics payload or observer overhead in production
  if (import.meta.env.PROD) return;

  try {
    onCLS(logMetric);
    onFCP(logMetric);
    onINP(logMetric);
    onLCP(logMetric);
    onTTFB(logMetric);
    
    console.log(
      '%c⚡ Earthfirm Architects Performance Monitor Initialized ⚡',
      'color: #10B981; font-weight: bold; font-size: 11px; background-color: #064E3B; padding: 4px 8px; border-radius: 4px;'
    );
  } catch (error) {
    console.warn('[Performance Monitor] Failed to initialize observers:', error);
  }
}
