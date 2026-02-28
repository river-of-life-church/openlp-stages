(() => {
  const host = window.location.hostname;
  const websocket_port = 4317;
  const ws = new WebSocket(`ws://${host}:${websocket_port}`);

	const bgEl = document.getElementById('bgslide');
	const titleEl = document.getElementById('title');
	const textEl = document.getElementById('text');
	const versionEl = document.getElementById('version');

	const getLiveData = () => fetch("/api/v2/controller/live-items").then(r => r.json());

	function handleSlideshow(item) {
		if (item.name === 'bibles') {
			const [verse, version] = item.footer;

			const lastSpace = verse.lastIndexOf(' ');
			const book = verse.slice(0, lastSpace);
			const [chapter, verseRange] = verse.slice(lastSpace + 1).split(':');

			const [versionName, license] = version.split(',').map(v => v.trim());

			const slide = item.slides.find(s => s.selected);
			const currentVerse = slide.tag;
			const text = slide.text.replace(/^\d+:\d+\s*/, '');
			
			titleEl.innerText = `${book} ${chapter}:${currentVerse}`;
			textEl.innerText = text;
			versionEl.innerText = license;
			bgEl.classList.add('show');
		} else {
			hideSlide();
		} 
	}

	function hideSlide() {
		bgEl.classList.remove('show');
	}

	ws.onmessage = (e) => {
		const reader = new FileReader();
		reader.onload = () => {
			const data = JSON.parse(reader.result.toString()).results;
			// Check if the slide should be visible:
			if (!data.display && !data.blank && !data.theme) {
				getLiveData().then(handleSlideshow);
			} else {
				hideSlide();
			}
		}
		reader.readAsText(e.data);
	};

})();
