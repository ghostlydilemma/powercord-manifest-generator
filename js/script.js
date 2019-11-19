class Generator {

    _genData

    get genData() {
        return this._genData
    }
    set genData(value) {
        this._genData = value
    }

    constructor() {
        this.genData = {}
        this.prepareQuerySel()
    }

    prepareQuerySel() {
        document.querySelectorAll('.typeSelect#generator .selectItem').forEach(el => {

            el.addEventListener('click', () => {
                if (!el.classList.contains('selected')) {
                    this.switchGenerator(el)
                }
            })
        })

        document.querySelectorAll('.typeSelect#theme .selectItem').forEach(el => {

            el.addEventListener('click', () => {
                if (!el.classList.contains('selected')) {
                    this.switchTheme(el)
                }
            })
        })

        document.querySelectorAll('.generator .entry input, .generator .entry textarea').forEach(el => {
            el.addEventListener('keyup', () => {
                this.updateGenData(el)
            })
        })

        document.querySelectorAll('.generator .entry select').forEach(el => {

            el.addEventListener('change', () => {
                this.updateGenData(el)
            })
        })

        document.querySelector('a.download').addEventListener('click', () => {
            this.clearInputs();
        })
    }

    switchGenerator(element) {
        let type = element.getAttribute('data-type')
        let parent = element.parentElement
        if (type === 'plugins') {
            parent.querySelector('.selectItem[data-type="themes"]').classList.remove('selected')
            parent.querySelector('.selectItem[data-type="plugins"]').classList.add('selected')

            document.querySelector('.generator[data-type="themes"]').classList.remove('selected')
            document.querySelector('.generator[data-type="plugins"]').classList.add('selected')
        } else {
            parent.querySelector('.selectItem[data-type="plugins"]').classList.remove('selected')
            parent.querySelector('.selectItem[data-type="themes"]').classList.add('selected')

            document.querySelector('.generator[data-type="plugins"]').classList.remove('selected')
            document.querySelector('.generator[data-type="themes"]').classList.add('selected')
        }
        document.querySelector('a.download').classList.add('disabled')
        this.genData = {}
        this.clearInputs();
    }

    switchTheme(element) {
        let type = element.getAttribute('data-type')
        let parent = element.parentElement

        if (type === 'dark') {
            parent.querySelector('.selectItem[data-type="light"]').classList.remove('selected')
            parent.querySelector('.selectItem[data-type="dark"]').classList.add('selected')

            document.body.classList.add('dark')
            document.body.classList.remove('light')
        } else {
            parent.querySelector('.selectItem[data-type="dark"]').classList.remove('selected')
            parent.querySelector('.selectItem[data-type="light"]').classList.add('selected')

            document.body.classList.add('light')
            document.body.classList.remove('dark')
        }
    }

    /**
    *
    * @param {HTMLElement} element
    */
    updateGenData(element) {

        let inputType = element.id.slice(10, element.id.length)

        if (element.value !== '') {
            this.genData[inputType] = element.value
            element.closest('.entry').setAttribute('data-filled', "true");
        }
        else {
            delete this.genData[inputType]
            element.closest('.entry').setAttribute('data-filled', "false");
        }

        this.checkIfDataRequired();

    }

    checkIfDataRequired() {

        let requiredFilled = true;

        document.querySelectorAll('.selected .entry[data-required=true]').forEach(el => {

            if (requiredFilled) {
                if (el.getAttribute('data-filled') === "false") {
                    requiredFilled = false
                }
            }

        })

        if (requiredFilled) {
            this.generateDownloadFile();
            document.querySelector('a.download').classList.remove('disabled')
        } else {
            document.querySelector('a.download').classList.add('disabled')
        }

    }

    generateDownloadFile() {

        console.log(this.genData)

        const blob = new Blob([JSON.stringify(this.genData)], { type: 'application/json' });
        const dlLink = document.querySelector('a.download')
        dlLink.href = URL.createObjectURL(blob);
        dlLink.download = document.querySelector('.generator.selected').getAttribute('data-fileName')

    }

    clearInputs() {
        document.querySelectorAll('input, textarea').forEach(el => {
            el.value = '';
        })
    }
}
