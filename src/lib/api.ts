export function apiUrl(path: string, searchParams?: URLSearchParams | null): string {
  const { hostname, protocol } = window.location;

  const url = new URL('http://localhost');

  url.port = '3000';
  url.hostname = hostname;
  url.protocol = protocol;
  url.pathname = path;

  if (searchParams) {
    url.search = `?${searchParams.toString()}`;
  }

  return url.href;
}
