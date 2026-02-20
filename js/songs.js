import { SongsController } from './controller/SongsController.js';

const controller = new SongsController();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => controller.start());
} else {
    controller.start();
}
