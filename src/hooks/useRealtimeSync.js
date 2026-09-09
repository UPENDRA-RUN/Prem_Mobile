import { useEffect, useRef } from 'react';

/**
 * Custom React Hook for Real-Time Event Synchronization.
 * Listens to Server-Sent Events (/api/events) and calls the callback whenever
 * a database mutation occurs (e.g. PRODUCTS_UPDATED, ORDERS_UPDATED, SALE_UPDATED).
 * Flexibly accepts (callback, eventTypes, pollInterval) OR (eventTypes, callback, pollInterval).
 */
export function useRealtimeSync(arg1, arg2, arg3 = 15000) {
  let callback = typeof arg1 === 'function' ? arg1 : typeof arg2 === 'function' ? arg2 : () => {};
  let eventTypes = Array.isArray(arg1) ? arg1 : Array.isArray(arg2) ? arg2 : ['PRODUCTS_UPDATED'];
  let pollIntervalMs = typeof arg3 === 'number' ? arg3 : 15000;

  const callbackRef = useRef(callback);
  const eventTypesRef = useRef(eventTypes);

  useEffect(() => {
    callbackRef.current = callback;
    eventTypesRef.current = eventTypes;
  }, [callback, eventTypes]);

  useEffect(() => {
    let eventSource = null;
    let pollTimer = null;

    const triggerUpdate = () => {
      if (typeof callbackRef.current === 'function') {
        callbackRef.current(true); // Pass true for silent background update
      }
    };

    const setupSSE = () => {
      try {
        eventSource = new EventSource('/api/events');

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && eventTypesRef.current && eventTypesRef.current.includes(data.type)) {
              triggerUpdate();
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
      pollTimer = setInterval(triggerUpdate, pollIntervalMs);
    }

    return () => {
      if (eventSource) eventSource.close();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [pollIntervalMs]);
}

export default useRealtimeSync;
