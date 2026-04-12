export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const targetUrl = 'https://p01--boiling-frame--kw6dd7bjv2nr.code.run/check' + url.search;

  // 清理 headers，移除可能导致问题的头
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('cf-connecting-ip');
  headers.delete('cf-ray');
  headers.delete('cf-visitor');
  headers.delete('cf-ipcountry');
  headers.delete('x-forwarded-proto');
  headers.delete('x-real-ip');

  // 构建 fetch 选项，GET/HEAD 不传 body（EdgeOne 严格模式会报错）
  const fetchOptions = {
    method: request.method,
    headers: headers,
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    fetchOptions.body = request.body;
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
