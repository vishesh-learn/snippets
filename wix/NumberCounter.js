export class NumberCounter {
    static timeOutDuration = 200;

    constructor(element) {
        this.element = element;

        this.targetNumberString = element.text;
        this.targetNumber = Number(this.targetNumberString);
        this.targetNumberDigitCount = this.targetNumberString.length;
        this.targetDigits = this.targetNumberString.split('').map(Number);

        this.currentDigits = this.targetDigits.map(() => 0);

        this.itemOut = null;

        this.hasEnteredViewportOnce = false;
        this.isInitiated = false;

        this.init = this.init.bind(this);
        this.onViewportEnter = this.onViewportEnter.bind(this);
        this.play = this.play.bind(this);
        this.showCurrentNumber = this.showCurrentNumber.bind(this);

        this.init();
    }

    get currentNumber() {
        const currentNumberString = this.currentNumberString;

        return Number(currentNumberString);
    }

    get currentNumberString() {
        return this.currentDigits.join('');
    }

    init() {
        if (this.isInitiated) {
            return false;
        }

        this.showCurrentNumber();

        this.element.onViewportEnter(() => {
            if (this.hasEnteredViewportOnce) {
                return false;
            }

            this.itemOut = setTimeout(this.play, 200);

            this.hasEnteredViewportOnce = true;
        });

        this.isInitiated = true;
    }

    onViewportEnter() {
        this.itemOut = setTimeout(this.play, 200);
    }

    play() {
        this.currentDigits = this.currentDigits
            .map((digit, index) => {
                if (digit < this.targetDigits[index]) {
                    digit++;
                }

                return digit;
            });

        this.showCurrentNumber();

        if (this.currentNumber < this.targetNumber) {
            clearTimeout(this.itemOut);

            this.itemOut = setTimeout(this.play, NumberCounter.timeOutDuration);
        }
    }

    showCurrentNumber() {
        this.element.text = this.currentNumberString;
    }

}

/* sample usage

import { NumberCounter } from 'public/NumberCounter';

$w.onReady(function () {
    new NumberCounter($w('#counter1'));
    new NumberCounter($w('#counter2'));
    new NumberCounter($w('#counter3'));
});

*/