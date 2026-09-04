/**
 * Universal Safe Response JSON Parser for Prem Mobile
 * Prevents "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
 * across all fetch requests in the application.
 */
export async function parseResponseJson(res) {
  if (!res) {
    return { success: false, error: 'No network response received.' };
  }

  try {
    const text = await res.text();
    if (!text || text.trim() === '') {
      return {
        success: res.ok,
        error: res.ok ? null : `Server returned empty response (HTTP ${res.status})`
      };
    }

    try {
      const data = JSON.parse(text);
      if (typeof data === 'object' && data !== null) {
        if (!('success' in data)) {
          data.success = res.ok;
        }
        return data;
      }
      return { success: res.ok, data };
    } catch (jsonErr) {
      console.warn(`Non-JSON response from ${res.url || 'API'}:`, text.slice(0, 150));
      return {
        success: false,
        error: `Server error (HTTP ${res.status}): ${text.replace(/<[^>]*>?/gm, '').slice(0, 120)}`
      };
    }
  } catch (readErr) {
    return {
      success: false,
      error: readErr.message || 'Failed to parse response content.'
    };
  }
}
