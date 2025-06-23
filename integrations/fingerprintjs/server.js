// Requires Node SDK v3.1 or higher
const { unsealEventsResponse, DecryptionAlgorithm } = require("@fingerprintjs/fingerprintjs-pro-server-api");

const BASE64_KEY = 'E5riDOQB9Bb6ZssD8NwsbniC9laRlqB4TAtQlcign4I=';

export async function fingerprint_backend(sealedData) {
    const decryptionKey = BASE64_KEY;

    if (!sealedData || !decryptionKey) {
        console.error('Please set BASE64_KEY and BASE64_SEALED_RESULT environment variables');
        process.exit(1);
    }

    try {
        const unsealedData = await unsealEventsResponse(Buffer.from(sealedData, 'base64'), [{
            key: Buffer.from(decryptionKey, 'base64'),
            algorithm: DecryptionAlgorithm.Aes256Gcm,
        },]);

        return unsealedData;

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

const sampleResult = {
    "identification": {
        "data": {
            "visitorId": "uvZEehfix6o7gcXtb0NB",
            "requestId": "1750679102661.nXs9aK",
            "browserDetails": {
                "browserName": "Chrome",
                "browserMajorVersion": "137",
                "browserFullVersion": "137.0.0",
                "os": "Linux",
                "osVersion": "",
                "device": "Other",
                "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
            },
            "incognito": false,
            "ip": "103.224.4.60",
            "timestamp": 1750679102671,
            "time": "2025-06-23T11:45:02Z",
            "url": "https://www.ozzy.school/rough",
            "tag": {},
            "confidence": {
                "score": 1,
                "revision": "v1.1"
            },
            "visitorFound": true,
            "firstSeenAt": {
                "global": "2025-06-20T11:56:46.677Z",
                "subscription": "2025-06-20T11:56:46.677Z"
            },
            "lastSeenAt": {
                "global": "2025-06-23T11:39:42.257Z",
                "subscription": "2025-06-23T11:39:42.257Z"
            }
        }
    },
    "botd": {
        "data": {
            "bot": {
                "result": "notDetected"
            },
            "url": "https://www.ozzy.school/rough",
            "ip": "103.224.4.60",
            "time": "2025-06-23T11:45:02.701Z",
            "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            "requestId": "1750679102661.nXs9aK"
        }
    },
    "rootApps": {
        "data": {
            "result": false
        }
    },
    "emulator": {
        "data": {
            "result": false
        }
    },
    "ipInfo": {
        "data": {
            "v4": {
                "address": "103.224.4.60",
                "geolocation": {
                    "accuracyRadius": 20,
                    "latitude": 19.46,
                    "longitude": 72.8097,
                    "postalCode": "401303",
                    "timezone": "Asia/Kolkata",
                    "city": {
                        "name": "Virār"
                    },
                    "country": {
                        "code": "IN",
                        "name": "India"
                    },
                    "continent": {
                        "code": "AS",
                        "name": "Asia"
                    },
                    "subdivisions": [{
                        "isoCode": "MH",
                        "name": "Maharashtra"
                    }]
                },
                "asn": {
                    "asn": "45415",
                    "name": "Vasai Cable Pvt. Ltd.",
                    "network": "103.224.4.0/22"
                },
                "datacenter": {
                    "result": false,
                    "name": ""
                }
            }
        }
    },
    "vpn": {
        "data": {
            "result": false,
            "confidence": "high",
            "originTimezone": "Asia/Calcutta",
            "originCountry": "unknown",
            "methods": {
                "timezoneMismatch": false,
                "publicVPN": false,
                "auxiliaryMobile": false,
                "osMismatch": false,
                "relay": false
            }
        }
    },
    "incognito": {
        "data": {
            "result": false
        }
    },
    "tampering": {
        "data": {
            "result": false,
            "anomalyScore": 0.0205,
            "antiDetectBrowser": false
        }
    },
    "clonedApp": {
        "data": {
            "result": false
        }
    },
    "factoryReset": {
        "data": {
            "time": "1970-01-01T00:00:00Z",
            "timestamp": 0
        }
    },
    "jailbroken": {
        "data": {
            "result": false
        }
    },
    "frida": {
        "data": {
            "result": false
        }
    },
    "privacySettings": {
        "data": {
            "result": false
        }
    },
    "virtualMachine": {
        "data": {
            "result": false
        }
    },
    "locationSpoofing": {
        "data": {
            "result": false
        }
    },
    "suspectScore": {
        "data": {
            "result": 0
        }
    },
    "velocity": {
        "data": {
            "distinctIp": {
                "intervals": {
                    "5m": 1,
                    "1h": 1,
                    "24h": 1
                }
            },
            "distinctLinkedId": {},
            "distinctCountry": {
                "intervals": {
                    "5m": 1,
                    "1h": 1,
                    "24h": 1
                }
            },
            "events": {
                "intervals": {
                    "5m": 1,
                    "1h": 2,
                    "24h": 2
                }
            },
            "ipEvents": {
                "intervals": {
                    "5m": 1,
                    "1h": 2,
                    "24h": 2
                }
            },
            "distinctIpByLinkedId": {},
            "distinctVisitorIdByLinkedId": {}
        }
    },
    "developerTools": {
        "data": {
            "result": true
        }
    }
}