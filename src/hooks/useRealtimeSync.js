import { useEffect } from 'react';

/**
 * Custom React Hook for Real-Time Event Synchronization.
 * Listens to Server-Sent Events (/api/events) and calls the callback whenever
 * a database mutation occurs (e.g. PRODUCTS_UPDATED, ORDERS_UPDATED, SALE_UPDATED).
 * Also runs a periodic polling check as a safety net.
 */
export function useRealtimeSync(onUpdate, eventTypes = ['PRODUCTS_UPDATED'], pollIntervalMs = 4000) {
  useEffect(() => {
    let eventSource = null;
    let pollTimer = null;

    const setupSSE = () => {
      try {
        eventSource = new EventSource('/api/events');

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && eventTypes.includes(data.type)) {
              onUpdate();
            }
          } catch (e) {
            // Ignore parse errors
          }
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
          }
        };
      } catch (e) {
        // SSE unsupported or network block
      }
    };

    setupSSE();

    if (pollIntervalMs > 0) {
      pollTimer = setInterval(() => {
        onUpdate();
      }, pollIntervalMs);
    }

    return () => {
      if (eventSource) eventSource.close();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [onUpdate, pollIntervalMs]);
}

export default useRealtimeSync;
