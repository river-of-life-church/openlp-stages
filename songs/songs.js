createStageHandler({
	slideElementId: 'bgslide',
	itemName: 'songs',
	onSlide(item) {
		const contentsEl = document.getElementById('contents')
		const slide = item.slides.find(s => s.selected)
		if (!slide) return

		const lines = slide.text?.split('\n') || []
		const wrapped = wrapLines(lines)

		contentsEl.textContent = ''
		for (const line of wrapped) {
			const span = document.createElement('span')
			span.className = 'line'
			span.textContent = line
			contentsEl.appendChild(span)
		}
	}
})

function wrapLines(lines) {
	if (lines.length <= 2) return lines

	return lines.reduce((acc, text, i) => {
		if (i % 2 === 0) {
			acc.push([])
		}
		let sanitized = text.trim()
		if (sanitized.endsWith(',')) {
			sanitized = sanitized.slice(0, -1)
		}
		acc[acc.length - 1].push(sanitized)
		return acc
	}, [])
		.map(([a, b]) => `${a || ''}${b ? ', ' + b : ''}`)
}
