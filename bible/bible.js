createStageHandler({
	slideElementId: 'bgslide',
	itemName: 'bibles',
	onSlide(item) {
		const titleEl = document.getElementById('title')
		const textEl = document.getElementById('text')
		const versionEl = document.getElementById('version')

		const { footer: [passageRef], data: { bibles: [{ version }] }, slides } = item
		const slide = slides.find(s => s.selected)
		if (!slide) return

		const bookChapter = passageRef.substring(0, passageRef.lastIndexOf(':'))

		titleEl.textContent = `${bookChapter}:${slide.tag}`
		textEl.textContent = slide.text.replace(/^\d+:\d+\s*/, '')
		versionEl.textContent = version
	}
})
