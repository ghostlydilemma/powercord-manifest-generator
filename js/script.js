class Generator {

    get genData() {
        return this._genData
    }
    set genData(value) {
        this._genData = value
    }

    constructor() {
        this.genData = {}
        this.prepareQuerySel();
        this.clearInputs();
    }

    prepareQuerySel() {
        document.querySelectorAll('.typeSelect#generator .selectItem').forEach(el => {

            el.addEventListener('click', () => {
                if (!el.classList.contains('selected')) {
                    this.switchGenerator(el)
                }
            });

            el.addEventListener('touchstart', () => {
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

            el.addEventListener('touchstart', () => {
                if (!el.classList.contains('selected')) {
                    this.switchTheme(el)
                }
            })
        })

        document.querySelectorAll('.generator .entry input, .generator .entry textarea, .generator .entry select').forEach(el => {

            let eventListener = 'keyup'

            if (el.localName === 'select') {
                eventListener = 'change'
            }

            el.addEventListener(eventListener, () => {
                this.updateGenData(el)
            })
        })

        document.querySelector('a.download').addEventListener('click', () => {
            this.clearInputs()
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
        this.clearInputs()
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

        let subObjects = (element.id.slice(10, element.id.length)).split('-');

        if (element.value !== '') {

            let value = element.value
            if (element.closest('.entry').getAttribute('data-export') === 'array') {
                value = element.value.split(',')
            }

            if (subObjects.length > 1) {
                if (this.genData[subObjects[0]] === undefined) this.genData[subObjects[0]] = {}
                this.genData[subObjects[0]][subObjects[1]] = value
            } else this.genData[subObjects[0]] = value

            element.closest('.entry').setAttribute('data-filled', "true")
            let multiple = element.closest('.input.multiple')
            if (multiple) this.updateMultiple(multiple, 'filled', element)
        } else {

            if (subObjects.length > 1) {
                delete this.genData[subObjects[0]][subObjects[1]]
                if (Object.keys(this.genData[subObjects[0]]).length === 0 && this.genData[subObjects[0]].constructor === Object) delete this.genData[subObjects[0]]
            } else delete this.genData[subObjects[0]]

            element.closest('.entry').setAttribute('data-filled', "false")
            let multiple = element.closest('.input.multiple')
            if (multiple) this.updateMultiple(multiple, 'empty', element)
        }

        this.checkIfDataRequired()

    }

    checkIfDataRequired() {

        let requiredFilled = true

        document.querySelectorAll('.selected .entry[data-required=true]').forEach(el => {

            if (requiredFilled) {
                if (el.getAttribute('data-filled') === "false") {
                    requiredFilled = false
                }
            }

        })

        if (requiredFilled) {
            this.generateDownloadFile()
            document.querySelector('a.download').classList.remove('disabled')
        } else {
            document.querySelector('a.download').classList.add('disabled')
        }

    }

    /**
     * 
     * @param {HTMLDivElement} multiple 
     * @param {HTMLElement} elementChanged
     */
    updateMultiple(multiple, state, elementChanged) {

        /**
         * @type {HTMLInputElement[]}
         */
        let inputsToCheck = JSON.parse(multiple.getAttribute('data-from'))

        let allFilled = true;
        if (state === 'filled') {

            inputsToCheck.forEach(el => {
                el = document.querySelector(`#${el}`);
                el.closest('.entry').setAttribute('data-filled', true)
                if (el.value === "") allFilled = false;
            })
            if (allFilled) this.functions()[multiple.getAttribute('data-needed-function')]['on']()
        } else {
            multiple.setAttribute('data-entered', parseInt(multiple.getAttribute('data-entered')) - 1)
            this.functions()[multiple.getAttribute('data-needed-function')]['off']();
            inputsToCheck.forEach(el => {
                el = document.querySelector(`#${el}`)
                if (elementChanged !== el && el.value === '') el.closest('.entry').setAttribute('data-filled', false)
            })
        }

    }

    generateDownloadFile() {

        const blob = new Blob([JSON.stringify(this.genData)], { type: 'application/json' });
        const dlLink = document.querySelector('a.download')
        dlLink.href = URL.createObjectURL(blob)
        dlLink.download = document.querySelector('.generator.selected').getAttribute('data-fileName')

    }

    clearInputs() {
        document.querySelectorAll('input[type="text"], textarea').forEach(el => {
            el.value = ''
        })
        let functions = this.functions();
        for (let f in functions) {
            functions[f]['off']();
        }
    }

    functions() {
        return {
            "author-function": {
                "on": () => { document.getElementById('pc-plugin-author-preferred-entry').classList.remove('hidden') },
                "off": () => { document.getElementById('pc-plugin-author-preferred-entry').classList.add('hidden') }
            }
        }
    }
}
