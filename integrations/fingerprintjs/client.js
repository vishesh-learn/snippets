import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";
import { fingerprint_backend } from "backend/anonymous/fingerprint-js";

class FingerprintJS_CustomElement extends HTMLElement {
    constructor() {
        super();

        FingerprintJS.load({
            apiKey: "kWzf14a8Fq6ZNAXRwLCw"
        })
            .then(fp => fp.get())
            .then(fingerprint => {
                console.log('fp.get()', fingerprint);

                const sealed = fingerprint.sealedResult;

                return fingerprint_backend(sealed)
                    .then(response => console.log("Finished with status: ", response));
            })
            .catch(err => console.error("Failed to complete Sealed Client Results flow with error: ", err));
    }
}

// Define the custom element
customElements.define('fingerprint-js', FingerprintJS_CustomElement);