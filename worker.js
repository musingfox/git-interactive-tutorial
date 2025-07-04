// Cloudflare Worker for handling /git-interactive-tutorial/ path
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Check if path starts with /git-interactive-tutorial/
    if (url.pathname.startsWith('/git-interactive-tutorial/')) {
      // Remove the /git-interactive-tutorial prefix
      const newPath = url.pathname.replace('/git-interactive-tutorial', '') || '/';
      
      // Redirect to the Pages project
      const pagesUrl = `https://git-interactive-tutorial.pages.dev${newPath}`;
      
      // Fetch from Pages project
      const response = await fetch(pagesUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      // Return response with original URL
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
    
    // For other paths, pass through or handle as needed
    return new Response('Not Found', { status: 404 });
  }
}