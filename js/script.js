class Generator {
    get genData() {
        return this._genData
    }

    set genData(value) {
        this._genData = value
    }
    
    constructor() {
        this.genData = {};
        this.prepareEvents();
        this.clearInputs();
    }

    prepareEvents() {
        document.querySelectorAll('.typeSelect#generator .selectItem').forEach(el => {
            el.addEventListener('click', () => {
                if (!el.classList.contains('selected')) this.switchGenerator(el);
            });

            el.addEventListener('touchstart', () => {
                if (!el.classList.contains('selected')) this.switchGenerator(el);
            });
        });

        document.querySelectorAll('.typeSelect#theme .selectItem').forEach(el => {
            el.addEventListener('click', () => {
                if (!el.classList.contains('selected')) this.switchTheme(el);
            });

            el.addEventListener('touchstart', () => {
                if (!el.classList.contains('selected')) this.switchTheme(el);
            });
        });

        document.querySelectorAll('.generator .entry input, .generator .entry textarea').forEach(el => {
            el.addEventListener('keyup', () => { this.updateGenData(el) });
        });

        document.querySelectorAll('.generator .entry select').forEach(el => {
            el.addEventListener('change', () => { this.updateGenData(el) });
        });

        document.querySelector("div.preview").addEventListener("click", () => {
            if (!document.querySelector("div.preview").classList.contains("expanded")) {
                document.querySelector("div.preview").classList.add("expanded");
                document.querySelector("div.preview > div.json").classList.remove("hidden");
                document.querySelector("div.preview > a.download").classList.remove("hidden");
            } else {
                document.querySelector("div.preview").classList.remove("expanded");
                document.querySelector("div.preview > div.json").classList.add("hidden");
                document.querySelector("div.preview > a.download").classList.add("hidden");
            }
        })
    }

    switchTheme(element) {
        const type = element.getAttribute('data-type');
        const parent = element.parentElement;
        const highlightCssLink = document.getElementsByTagName("link").item(1);

        if (type === 'light') {
            parent.querySelector('.selectItem[data-type="dark"]').classList.remove('selected');
            parent.querySelector('.selectItem[data-type="light"]').classList.add('selected');
            
            const newHighlightCssLink = document.createElement("link");
            newHighlightCssLink.setAttribute("rel", "stylesheet");
            newHighlightCssLink.setAttribute("type", "text/css");
            newHighlightCssLink.setAttribute("href", "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/styles/atom-one-light.min.css");

            document.getElementsByTagName("head").item(0).replaceChild(newHighlightCssLink, highlightCssLink);
            
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        } else {
            parent.querySelector('.selectItem[data-type="light"]').classList.remove('selected');
            parent.querySelector('.selectItem[data-type="dark"]').classList.add('selected');
            
            const newHighlightCssLink = document.createElement("link");
            newHighlightCssLink.setAttribute("rel", "stylesheet");
            newHighlightCssLink.setAttribute("type", "text/css");
            newHighlightCssLink.setAttribute("href", "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/styles/atom-one-dark.min.css");

            document.getElementsByTagName("head").item(0).replaceChild(newHighlightCssLink, highlightCssLink);

            document.body.classList.add('dark');
            document.body.classList.remove('light');
        }
    }

    switchGenerator(element) {
        const type = element.getAttribute('data-type')
        const parent = element.parentElement

        if (type === 'plugins') {
            parent.querySelector('.selectItem[data-type="themes"]').classList.remove('selected');
            parent.querySelector('.selectItem[data-type="plugins"]').classList.add('selected');

            document.querySelector('.generator[data-type="themes"]').classList.remove('selected');
            document.querySelector('.generator[data-type="plugins"]').classList.add('selected');
        } else {
            parent.querySelector('.selectItem[data-type="plugins"]').classList.remove('selected');
            parent.querySelector('.selectItem[data-type="themes"]').classList.add('selected');

            document.querySelector('.generator[data-type="plugins"]').classList.remove('selected');
            document.querySelector('.generator[data-type="themes"]').classList.add('selected');
        }

        document.querySelector("div.preview").classList.add('disabled')
        this.genData = {}
        this.clearInputs()
    }

    updateGenData(element) {
        const inputType = element.id.slice(10, element.id.length);

        if (element.value !== '') {
            this.genData[inputType] = element.value;
            element.closest('.entry').setAttribute('data-filled', "true");
        } else {
            delete this.genData[inputType];
            element.closest('.entry').setAttribute('data-filled', "false");
        }

        this.checkIfDataRequired();
    }

    checkIfDataRequired() {
        let requiredFilled = true;

        document.querySelectorAll('.selected .entry[data-required=true]').forEach(el => {
            if (requiredFilled) {
                if (el.getAttribute('data-filled') === "false") {
                    requiredFilled = false;
                }
             }
        });

        document.querySelector("div.preview > div.json > pre > code").innerHTML = JSON.stringify(this.genData, null, 4);
        hljs.highlightBlock(document.querySelector("div.preview > div.json > pre > code"));

        document.styleSheets[2].cssRules[37].style.height = `${((Object.keys(this.genData).length + 2) * 28) + (12 * 2) + (19.5 * 2) + (29 * 2)}px`

        if (requiredFilled) {
            this.downloadManifestFile();
            document.querySelector("div.preview").classList.remove('disabled');
        } else {
            document.querySelector("div.preview").classList.add('disabled');
        }
    }

    downloadManifestFile() {
        const blob = new Blob([JSON.stringify(this.genData, null, 4)], { type: 'application/json' });
        document.querySelector("div.preview > a.download").href = URL.createObjectURL(blob);
        document.querySelector("div.preview > a.download").download = document.querySelector('.generator.selected').getAttribute('data-fileName');
    }

    clearInputs() {
        document.querySelectorAll('input[type="text"], textarea').forEach(el => {
            el.value = ''
        })
    }
}