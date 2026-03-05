/**
 * Creates a stage handler that connects to OpenLP via WebSocket,
 * listens for slide changes, and calls the appropriate callback.
 *
 * @param {Object} options
 * @param {string} options.slideElementId - ID of the element to toggle visibility on
 * @param {string} options.itemName - OpenLP item type to handle (e.g. 'bibles', 'songs')
 * @param {function} options.onSlide - Called with the live item when a matching slide is active
 */
function createStageHandler({ slideElementId, itemName, onSlide }) {
	const host = window.location.hostname
	const port = new URLSearchParams(window.location.search).get('ws_port') || 4317
	const slideEl = document.getElementById(slideElementId)

	const getLiveData = () =>
		fetch('/api/v2/controller/live-items')
			.then(r => r.json())
			.catch(err => console.error('Failed to fetch live data:', err))

	function handleSlideshow(item) {
		if (!item) return
		if (item.name === itemName) {
			onSlide(item)
			slideEl.classList.add('show')
		} else {
			hideSlide()
		}
	}

	function hideSlide() {
		slideEl.classList.remove('show')
	}

	function connect() {
		const ws = new WebSocket(`ws://${host}:${port}`)

		ws.onmessage = (e) => {
			e.data.text().then(text => {
				try {
					const data = JSON.parse(text).results
					if (!data.display && !data.blank && !data.theme) {
						getLiveData().then(handleSlideshow)
					} else {
						hideSlide()
					}
				} catch (err) {
					console.error('Failed to parse WebSocket message:', err)
				}
			})
		}

		ws.onclose = () => {
			console.warn('WebSocket closed, reconnecting in 3s...')
			setTimeout(connect, 3000)
		}

		ws.onerror = (err) => {
			console.error('WebSocket error:', err)
			ws.close()
		}
	}

	connect()
}
