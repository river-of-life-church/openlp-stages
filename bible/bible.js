(() => {
	const host = window.location.hostname;
	const websocket_port = 4317;
	const ws = new WebSocket(`ws://${host}:${websocket_port}`);

	const bgEl = document.getElementById('bgslide');
	const titleEl = document.getElementById('title');
	const textEl = document.getElementById('text');
	const versionEl = document.getElementById('version');
	const versePattern = /^(\d+):(\d+)\s*/;

	const getLiveData = () => fetch("/api/v2/controller/live-items").then(r => r.json());

	// Build a tag → { verse, text } lookup, joining all slides that share the same tag
	const buildVerseMap = (slides) => slides.reduce((map, {tag, text}) => {
		const cleaned = text.replace(versePattern, '');
		if (!map[tag]) {
			const match = text.match(versePattern);
			map[tag] = { verse: match?.[2] ?? '', text: cleaned };
		} else {
			map[tag].text += ' ' + cleaned;
		}
		return map;
	}, {});

	function handleSlideshow(item) {
		if (item.name === 'bibles') {
			const { footer: [passageRef], data: { bibles: [{ version }] }, slides } = item;
			const { tag } = slides.find(s => s.selected);
			const verseMap = buildVerseMap(slides);
			const bookChapter = passageRef.substring(0, passageRef.lastIndexOf(':'));
			const { verse, text: verseText } = verseMap[tag];

			titleEl.textContent = verse ? `${bookChapter}:${verse}` : passageRef;
			textEl.textContent = verseText || text;
			versionEl.textContent = version;

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
