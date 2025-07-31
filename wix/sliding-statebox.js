class SlidingStatebox {
    constructor({ stateBoxId }) {
        this.stateBoxId = stateBoxId;
        this.interval = null;

        this.init = this.init.bind(this);
        this.nextSlide = this.nextSlide.bind(this);
    }

    get stateBox() {
        return $w(`#${this.stateBoxId}`);
    }

    init() {
        if (!this.stateBox) {
            console.error(`Error while trying to init statebox sliding. Statebox not found for statebox Id ${this.stateBoxId}`);

            return false;
        }

        this.stateBox.onViewportEnter(() => {
            this.interval = setInterval(this.nextSlide, 2000);
        });

        this.stateBox.onViewportLeave(() => {
            clearInterval(this.interval);
        });
    }

    nextSlide() {
        console.log('nextSlide');

        let targetStateIndex = 0;

        if (!this.stateBox) {
            console.error(`Error while trying to change to next slide. Statebox not found for statebox Id ${this.stateBoxId}`);

            return false;
        }

        const states = this.stateBox.states;

        const currentState = this.stateBox.currentState;

        const currentStateIndex = states.findIndex(state => state.id == currentState.id);

        const lastStateIndex = states.length - 1;

        if (currentStateIndex < lastStateIndex) {
            targetStateIndex = currentStateIndex + 1;
        }

        const targetState = states[targetStateIndex];

        this.stateBox.changeState(targetState);
    }
}

const slidingStatebox = new SlidingStatebox({
    stateBoxId: "stateBoxes"
});

$w.onReady(function () {

    slidingStatebox.init();

});