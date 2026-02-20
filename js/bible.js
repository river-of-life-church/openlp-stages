import { BiblesController } from './controller/BiblesController.js';

const controller = new BiblesController();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => controller.start());
} else {
    controller.start();
}
