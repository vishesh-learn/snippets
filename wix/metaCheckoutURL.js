// backend/meta-integration.web.js file -------------

import { Permissions, webMethod } from "@wix/web-methods";
import {
    cart
} from "@wix/ecom";

export const updateCurrentCart = webMethod(
    Permissions.Anyone,
    async (options) => {
        return cart.createCart(options);
    },
);

// cart page code -----------

import { location } from '@wix/site-location';
import { ecom } from "@wix/site-ecom";
import { updateCurrentCart } from 'backend/meta-integration.web';

$w.onReady(function () {
    checkUrl_andUpdateCart();
});

async function checkUrl_andUpdateCart() {
    try {
        const queryParams = await location.query();

        try {
            if (!queryParams["products"]) {
                return false;
            }

            const productsString = queryParams["products"]; // e.g., "12345:3,23456:1"

            const productEntries = productsString.split(',');

            const lineItemsToAdd = productEntries.map(entry => {
                const [productId, quantity] = entry.split(':');

                return {
                    catalogReference: {
                        appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e",
                        catalogItemId: productId
                    },
                    quantity: Number(quantity)
                };
            });

            console.log("line items to add", ...lineItemsToAdd);

            if (lineItemsToAdd.length > 0) {
                const updateOptions = {
                    lineItems: lineItemsToAdd
                }

                console.log("cart update options", updateOptions);

                try {
                    const updatedCurrentCart = await updateCurrentCart(updateOptions);

                    console.log("updatedCurrentCart", updatedCurrentCart);

                    ecom.refreshCart();

                    console.log('Products added to cart successfully.\nupdatedCurrentCart:', updatedCurrentCart);
                } catch (error) {
                    console.error('Error adding products to cart or navigating:', error);
                }

                try {
                    if (queryParams["coupon"]) {
                        const updateOptions = {
                            lineItems: lineItemsToAdd,
                            couponCode: queryParams["coupon"]
                        }

                        console.log("cart update options", updateOptions);

                        try {
                            const updatedCurrentCart = await updateCurrentCart(updateOptions);

                            console.log("updatedCurrentCart", updatedCurrentCart);

                            ecom.refreshCart();

                            console.log('Products added to cart successfully.\nupdatedCurrentCart:', updatedCurrentCart);
                        } catch (error) {
                            console.error('Error adding products to cart or navigating:', error);
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        console.error(error);
    }

}