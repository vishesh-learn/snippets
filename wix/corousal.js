
$w.onReady(function () {
    new Carousal1({
        stateBoxesId: '#stateBoxes1',
        nextButtonId: '#nextButton1',
        previousButtonId: '#previousButton1',
    }).setPrevNextDisabledButtonBG("rgba(0,0,0,0)");
});

class Carousal1 {
    constructor({ stateBoxesId, nextButtonId, previousButtonId}) {
        this.isProcessing = false;
        this.stateBoxesId = stateBoxesId;
        this.nextButtonId = nextButtonId;
        this.previousButtonId = previousButtonId;

        this.initCarousal();
    }

    initCarousal() {
        $w(this.nextButtonId).onClick(() => this.nextState());
        $w(this.previousButtonId).onClick(() => this.previousState());
        $w(this.stateBoxesId).onChange(() => {
            this.updateButtonStates();
        });

        this.updateButtonStates();
    }

    setPrevNextDisabledButtonBG(color) {
        try {
            $w(this.previousButtonId).style.disabled.backgroundColor = color;
            $w(this.nextButtonId).style.disabled.backgroundColor = color;
        } catch (error) {
            console.log(error);
        }
    }

    async nextState() {
        if (!this.isProcessing) {
            this.isProcessing = true;

            const stateBoxes = $w(this.stateBoxesId);
            let currentStateIndex = stateBoxes.states.findIndex(state => state.id === stateBoxes.currentState.id);
            if (currentStateIndex < stateBoxes.states.length - 1) {
                let newCurrentState = stateBoxes.states[currentStateIndex + 1];
                await stateBoxes.changeState(newCurrentState.id);
            }

            this.isProcessing = false;
        }
    }

    async previousState() {
        if (!this.isProcessing) {
            this.isProcessing = true;

            const stateBoxes = $w(this.stateBoxesId);
            let currentStateIndex = stateBoxes.states.findIndex(state => state.id === stateBoxes.currentState.id);
            if (currentStateIndex > 0) {
                let newCurrentState = stateBoxes.states[currentStateIndex - 1];
                await stateBoxes.changeState(newCurrentState.id);
            }

            this.isProcessing = false;
        }
    }

    updateButtonStates() {
        const stateBoxes = $w(this.stateBoxesId);
        const currentStateIndex = stateBoxes.states.findIndex(state => state.id === stateBoxes.currentState.id);

        if (currentStateIndex === 0) {
            $w(this.previousButtonId).disable();
        } else {
            $w(this.previousButtonId).enable();
        }

        if (currentStateIndex === stateBoxes.states.length - 1) {
            $w(this.nextButtonId).disable();
        } else {
            $w(this.nextButtonId).enable();
        }
    }
}

