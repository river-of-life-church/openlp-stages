(() => {
	const host = window.location.hostname
	const websocket_port = 4317
	const ws = new WebSocket(`ws://${host}:${websocket_port}`)

	const bgEl = document.getElementById('bgslide')
	const contentsEl = document.getElementById('contents')

	const getLiveData = () => fetch("/api/v2/controller/live-items").then(r => r.json())

	function handleSlideshow(item) {
		if (item.name === 'songs') {
			const slide = item.slides.find(s => s.selected)
			const lines = slide?.text?.toUpperCase()?.split('\n')

			contentsEl.innerHTML = wrapLines(lines)
				.map(line => `<span class="line">${line ?? ''}</span>`)
				.join('');

			bgEl.classList.add('show')
		} else {
			hideSlide()
		}
	}

	function wrapLines(lines = []) {
		if (lines.length <= 2) return lines

		return lines.reduce((acc, text, i) => {
			if (i % 2 === 0) {
				acc.push([]);
			}
			let sanitized = text.trim();
			if (sanitized[sanitized.length - 1] == ',') {
				sanitized = sanitized.slice(0, -1);
			}
			acc[acc.length - 1].push(sanitized);
			return acc;
		}, [])
			.map(([a, b]) => `${a ?? ''}${Boolean(b) ? ', ' + b : ''}`);
	}

	function hideSlide() {
		bgEl.classList.remove('show')
	}

	ws.onmessage = (e) => {
		const reader = new FileReader()
		reader.onload = () => {
			const data = JSON.parse(reader.result.toString()).results
			// Check if the slide should be visible:
			if (!data.display && !data.blank && !data.theme) {
				getLiveData().then(handleSlideshow)
			} else {
				hideSlide()
			}
		}
		reader.readAsText(e.data)
	}

})()
