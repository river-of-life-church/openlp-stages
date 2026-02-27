(() => {
  const host = window.location.hostname;
  const websocket_port = 4317;
  const ws = new WebSocket(`ws://${host}:${websocket_port}`);

	const bgEl = document.getElementById('bgslide');
	const bookEl = document.getElementById('book');
	const verseEl = document.getElementById('verse');
	const versionEl = document.getElementById('version');
	const textEl = document.getElementById('text');

	const getLiveData = () => fetch("/api/v2/controller/live-items").then(r => r.json());

	function handleSlideshow(item) {
		if (item.name === 'bibles') {
			const [verse, version] = item.footer;
			const [versionName, license] = version.split(',').map(v => v.trim());
			const slide = item.slides.find(s => s.selected);

			const [book, curVerse] = [verse, slide.text].map(v => v.substring(0, v.lastIndexOf(' ')));
			bookEl.innerText = book;
			verseEl.innerText = curVerse;
			versionEl.innerText = license;

			textEl.innerText = slide.text.substring(slide.text.indexOf(' ') + 1);

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