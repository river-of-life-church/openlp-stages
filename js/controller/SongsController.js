import { BaseController } from './BaseController.js'

export class SongsController extends BaseController {
    
    constructor() {
        super()
        this.PLUGIN = 'songs'
        this.curPlugin = this.PLUGIN
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

}