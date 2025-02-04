import { contacts } from 'wix-crm-backend';

export function createOrGetContactIdForEmail(email, tag = '') {
    const contactInfo = {
        emails: [{
            tag: tag,
            email: email,
            primary: true
        }]
    };

    return contacts.createContact(contactInfo, {
        suppressAuth: true,
        allowDuplicates: false
        })
        .then((resolvedContact) => {
            return resolvedContact._id;
        })
        .catch((error) => {
            console.error("error creating contact", error);

            if (error.details?.applicationError?.data?.duplicateContactId) {
                console.error('returning duplicate contact instead');

                return error.details?.applicationError?.data?.duplicateContactId;
            }
        });
}