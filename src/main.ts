import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

function dismissBootLoader(): void {
  const loader = document.getElementById('maison-boot');
  if (!loader || loader.dataset['state'] === 'ready') return;

  const remove = () => loader.remove();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    remove();
    return;
  }

  loader.addEventListener('animationend', remove, { once: true });
  loader.dataset['state'] = 'ready';
  window.setTimeout(remove, 300);
}

function showBootError(): void {
  const loader = document.getElementById('maison-boot');
  if (!loader) return;

  loader.dataset['state'] = 'error';
  const message = loader.querySelector<HTMLElement>('[data-boot-message]');
  if (message) message.textContent = 'WORKSPACE UNAVAILABLE';
}

bootstrapApplication(App, appConfig)
  .then((application) => {
    void application.whenStable().then(() => requestAnimationFrame(dismissBootLoader));
    window.setTimeout(dismissBootLoader, 2500);
  })
  .catch((err: unknown) => {
    showBootError();
    console.error(err);
  });
