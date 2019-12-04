class Generator {

    get genData() {
        return this._genData
    }
    set genData(value) {
        this._genData = value
    }

    get contributors() {
        return this._contributors
    }

    set contributors(value) {
        this._contributors = value;
    }

    constructor() {
        this.genData = {}
        this.contributors = []
        this.prepareQuerySel()
        this.clearInputs()
    }

    prepareQuerySel() {
        document.querySelectorAll('.typeSelect#generator .selectItem').forEach(el => {

            el.addEventListener('click', () => {
                if (!el.classList.contains('selected')) {
                    this.switchGenerator(el)
                }
            })

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

        document.getElementById('addContribButton').addEventListener('click', () => {
            this.addContributor();
        })

        document.getElementById('removeContribButton').addEventListener('click', () => {
            this.removeContributor();
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

        let subObjects = (element.id.slice(10, element.id.length)).split('-')

        if (element.value !== '') {

            let value = element.value
            if (element.closest('.entry').getAttribute('data-export') === 'array') {
                value = element.value.split(',')
            }

            if (subObjects.length > 1) {

                let subObjectParsed = parseInt(subObjects[0]);
                if (typeof subObjectParsed === 'number' && !isNaN(subObjectParsed)) {
                    let arrIndex = subObjects.shift();

                    if (this.genData[subObjects[0]] === undefined) this.genData[subObjects[0]] = []
                    if (this.genData[subObjects[0]][arrIndex] === undefined) this.genData[subObjects[0]][arrIndex] = {}

                    this.genData[subObjects[0]][arrIndex][subObjects[1]] = value;
                } else {
                    if (this.genData[subObjects[0]] === undefined) this.genData[subObjects[0]] = {}
                    this.genData[subObjects[0]][subObjects[1]] = value
                }
            } else this.genData[subObjects[0]] = value

            element.closest('.entry').setAttribute('data-filled', "true")
            let multiple = element.closest('.input.multiple')
            if (multiple) this.updateMultiple(multiple, 'filled', element)
        } else {

            if (subObjects.length > 1) {
                try {
                    delete this.genData[subObjects[0]][subObjects[1]]
                    if (Object.keys(this.genData[subObjects[0]]).length === 0 && this.genData[subObjects[0]].constructor === Object) delete this.genData[subObjects[0]]
                } catch (e) { }
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
            if (allFilled) this.functions(multiple.getAttribute('data-needed-settings'))[multiple.getAttribute('data-needed-function')]['on']()
        } else {
            multiple.setAttribute('data-entered', parseInt(multiple.getAttribute('data-entered')) - 1)
            this.functions(multiple.getAttribute('data-needed-settings'))[multiple.getAttribute('data-needed-function')]['off']();
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

        this.functions()['author-function']['off']()

        while (true) {
            if (this.removeContributor() === 'empty') break;
        }

    }

    functions(settings) {
        return {
            "author-function": {
                "on": () => { document.getElementById('pc-plugin-author-preferred-entry').classList.remove('hidden') },
                "off": () => { document.getElementById('pc-plugin-author-preferred-entry').classList.add('hidden') }
            },
            "contributor-function": {
                "on": () => {
                    document.getElementById(`pc-plugin-${settings}-contributor-preferred-entry`).classList.remove('hidden')
                },
                "off": () => {
                    document.getElementById(`pc-plugin-${settings}-contributor-preferred-entry`).classList.add('hidden')
                }
            }
        }
    }

    addContributor() {
        let contributors = document.getElementById('contributors')
        let contributorNumber = contributors.getAttribute('data-added');

        document.getElementById('removeContribButton').classList.remove('hidden')

        let contribElem = document.createElement('div')
        contribElem.id = `contributor-${contributorNumber}`
        contribElem.classList.add('contributors')
        contribElem.setAttribute('data-contributor-id', contributorNumber)

        contribElem.innerHTML = `
            <h4>Contributor ${parseInt(contributorNumber) + 1}</h4>
            <div class="input small multiple" 
                data-from='["pc-plugin-${contributorNumber}-contributor-discord", "pc-plugin-${contributorNumber}-contributor-github"]' 
                data-entered="0"
                data-needed="2" 
                data-needed-function="contributor-function"
                data-needed-settings="${contributorNumber}">
                <div class="entry" 
                    data-required=true 
                    data-filled=false>
                    <label for="contributor-github">Github Username: 
                        <span class="required"></span><br>
                        <span class="description">Username of the main author of the plugin.</span><br>
                    </label><br>
                    <input type="text" name="contributor-github" id="pc-plugin-${contributorNumber}-contributor-github" placeholder=" ">
                </div>
                <div class="entry" 
                    data-required=true 
                    data-filled=false>
                    <label for="contributor-discord">Discord ID: 
                        <span class="required"></span><br>
                        <span class="description">Discord Account ID of the main author of the plugin.</span><br>
                    </label><br>
                    <input type="text" name="contributor-discord" id="pc-plugin-${contributorNumber}-contributor-discord" placeholder=" ">
                </div>
                <div class="entry hidden" 
                    id="pc-plugin-${contributorNumber}-contributor-preferred-entry" 
                    data-required=false
                    data-filled=false>
                    <label for="contributor-preferred">Preferred Input: <br>
                        <span class="description">Preferred Way of contacting the author if both Github and Discord are given</span><br>
                    </label><br>
                    <select name="contributor-preferred" id="pc-plugin-${contributorNumber}-contributor-preferred">
                        <option value="discord">Discord</option>
                        <option value="github">Github</option>
                    </select>
                </div>
            </div>`

        contributors.appendChild(contribElem)

        contributors.querySelectorAll(`#contributor-${contributorNumber} input, #contributor-${contributorNumber} select`).forEach(el => {

            let eventListener = 'keyup'

            if (el.localName === 'select') {
                eventListener = 'change'
            }

            el.addEventListener(eventListener, () => {
                this.updateGenData(el)
            })
        })


        contributors.setAttribute('data-added', parseInt(contributorNumber) + 1)
    }

    removeContributor() {

        let contributors = document.getElementById('contributors')

        if (parseInt(contributors.getAttribute('data-added')) === 1) {
            document.getElementById('removeContribButton').classList.add('hidden')
        }

        contributors.setAttribute('data-added', parseInt(contributors.getAttribute('data-added')) - 1)
        let contributor = contributors.querySelector('.contributors:last-child')
        if (contributor) {
            this.genData[contributor.getAttribute('data-contributor-id')] = undefined
            contributor.remove()
        } else {
            contributors.setAttribute('data-added', 0)
            return 'empty';
        }

    }
}
