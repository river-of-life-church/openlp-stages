import { CONFIG } from '../constants.js'
import { fetchJSON, fadeOut, fadeIn, replaceClass, isArrayEmpty } from '../utils.js'

export class BaseController {
    constructor() {
        this.PLUGIN = ''
        this.LIVE_STATUS = 'live'
        this.currentItem = null
        this.currentService = null
        this.currentSlide = 0
        this.currentSlides = []
        this.curStatus = this.LIVE_STATUS
        this.curPlugin = null
        this.curtext = ''
        this.ws = null
        this.elements = null
    }

    initElements() {
        this.elements = {
            songTitle: document.querySelector('#songtitle'),
            currentSlide: document.querySelector('#currentslide'),
            bgSlide: document.querySelector('#bgslide')
        }

        if (!this.elements.songTitle) console.warn('Song title element not found')
        if (!this.elements.currentSlide) console.warn('Current slide element not found')
        if (!this.elements.bgSlide) console.warn('Background slide element not found')
    }

    initWebSocket() {
        const host = window.location.hostname
        const wsUrl = `ws://${host}:${CONFIG.WEBSOCKET_PORT}`

        this.ws = new WebSocket(wsUrl)

        this.ws.onmessage = async (event) => {
            try {
                const text = await event.data.text()
                const data = JSON.parse(text).results
                this.handleWebSocketMessage(data)
            } catch (error) {
                console.error('Error processing WebSocket message:', error)
            }
        }

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        this.ws.onclose = () => {
            console.log('WebSocket connection closed')
        }
    }

    handleWebSocketMessage(data) {
        this.curStatus = (data.theme || data.display || data.blank) ? '' : this.LIVE_STATUS

        if (this.currentItem !== data.item || this.currentService !== data.service) {
            this.currentItem = data.item
            this.currentService = data.service
            this.loadSlides()
        } else if (this.currentSlide !== data.slide) {
            this.currentSlide = parseInt(data.slide, 10)
            this.updateSlide()
        } else {
            this.loadService()
        }
    }

    async loadService() {
        try {
            const data = await fetchJSON(`${CONFIG.API_BASE}/service/items`)

            const selectedItem = data.find(item => item.selected)

            if (selectedItem) {
                this.currentItem = selectedItem
                this.curPlugin = selectedItem.plugin
                this.updateSongTitle(selectedItem.title);
                this.updateSlide()
            }
        } catch (error) {
            console.error('Failed to load service:', error)
        }
    }

    updateSongTitle(title = '') {
        const shouldShowTitle = this.curPlugin === this.PLUGIN && this.curStatus === this.LIVE_STATUS
        if(this.elements?.songTitle) {
            this.elements.songTitle.innerHTML = shouldShowTitle ? title : ''
        }
    }

    async loadSlides() {
        try {
            const data = await fetchJSON(`${CONFIG.API_BASE}/controller/live-items`)

            this.currentSlides = data.slides
            this.currentSlide = data.slides.findIndex(slide => slide.selected) || 0

            await this.loadService()
        } catch (error) {
            console.error('Failed to load slides:', error)
        }
    }

    updateSlide() {
        if (!this.currentSlides[this.currentSlide]) return

        const slide = this.currentSlides[this.currentSlide]
        let text = slide.text || slide.title || ''

        text = text.replace(/\n/g, '<br />')
        text = this.renderContent(text)

        if (this.curtext !== text) {
            this.animateSlideChange(text)
        }
    }

    renderContent(content) {
        const showContent = this.curPlugin === this.PLUGIN && this.curStatus === this.LIVE_STATUS
        const [oldClass, newClass] = showContent
            ? ['slideclear', 'slide']
            : ['slide', 'slideclear']
        replaceClass(this.elements.bgSlide, oldClass, newClass)
        return showContent ? content : ''
    }

    async animateSlideChange(text) {
        if (!this.elements.currentSlide) return

        this.curtext = text
        const slideElement = this.elements.currentSlide

        await fadeOut(slideElement, CONFIG.FADE_OUT_DURATION)

        this.renderSlideContent(slideElement, text)

        fadeIn(slideElement, CONFIG.FADE_IN_DURATION)
    }

    renderSlideContent(container, text) {
        const lines = text.split('<br />')

        container.innerHTML = ''

        if (isArrayEmpty(lines)) return

        const fragment = document.createDocumentFragment()

        const wrappedLines = this.wrapLines(lines)

        wrappedLines.forEach(line => {
            if (!line) return

            const span = document.createElement('span')
            span.className = 'line'
            span.textContent = line
            fragment.appendChild(span)
            fragment.appendChild(document.createElement('br'))
        })

        container.appendChild(fragment)
    }

    wrapLines(lines) {
        return lines
    }

    start() {
        this.initElements()
        this.initWebSocket()
    }
}