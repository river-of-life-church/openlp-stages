import { BaseController } from './BaseController.js'
import { replaceClass } from '../utils.js'

export class SongsController extends BaseController {
    constructor() {
        super()
        this.PLUGIN_NAME = 'songs'
        this.curPlugin = this.PLUGIN_NAME
    }

    renderContent(content) {
        const showContent = this.curPlugin === this.PLUGIN_NAME && this.curStatus === this.LIVE_STATUS
        const [oldClass, newClass] = showContent
            ? ['slideclear', 'slide']
            : ['slide', 'slideclear']
        replaceClass(this.elements.bgSlide, oldClass, newClass)
        return showContent ? content : ''
    }

    wrapLines(lines) {
        const wrapped = []
        for (let i = 0; i < lines.length; i += 2) {
            const line0 = lines[i]?.trim()
            const line1 = lines[i + 1]?.trim()
            if (!line0) continue
            wrapped.push(line1 ? `${line0}, ${line1}` : line0)
        }
        return wrapped
    }

    updateSongTitle(title = '') {
        if (!this.elements.songTitle) return

        const shouldShowTitle = this.curPlugin === this.PLUGIN_NAME && this.curStatus === this.LIVE_STATUS
        this.elements.songTitle.innerHTML = shouldShowTitle ? title : ''
    }
}