export function getServicesFromDOM(): Record<string, string[]> {
  const services: Record<string, string[]> = {};

  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[type="text/plain"][data-cookie-category][data-service]',
  );

  for (const script of scripts) {
    const category = script.getAttribute('data-cookie-category');
    const service = script.getAttribute('data-service');

    if (!category || !service) continue;

    if (!services[category]) services[category] = [];
    if (!services[category].includes(service)) {
      services[category].push(service);
    }
  }

  for (const key in services) {
    services[key]?.sort();
  }

  return services;
}

export function calculateChecksum(services: string[]): string {
  const sorted = [...services].sort();
  const json = JSON.stringify(sorted);
  let hash = 0;

  for (let i = 0; i < json.length; i++) {
    const char = json.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(16);
}
