import { BaseController } from './BaseController.js'

export class BiblesController extends BaseController {
    
    constructor() {
        super()
        this.PLUGIN = 'bibles'
        this.curPlugin = this.PLUGIN
    }

}