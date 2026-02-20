import { BaseController } from './BaseController.js';
import { replaceClass } from '../utils.js';

export class BiblesController extends BaseController {
    constructor() {
        super();
        this.PLUGIN = 'bibles'
        this.curPlugin = this.PLUGIN;
    }

    renderContent(content) {
        const showContent = this.curPlugin === this.PLUGIN && this.curStatus === this.LIVE_STATUS
        const [oldClass, newClass] = showContent
            ? ['slideclear', 'slide']
            : ['slide', 'slideclear']
        replaceClass(this.elements.bgSlide, oldClass, newClass)
        return showContent ? content : ''
    }

    updateSongTitle(title = '') {
        if (!this.elements.songTitle) return

        const shouldShowTitle = this.curPlugin === this.PLUGIN && this.curStatus === this.LIVE_STATUS
        this.elements.songTitle.innerHTML = shouldShowTitle ? title : ''
    }
}