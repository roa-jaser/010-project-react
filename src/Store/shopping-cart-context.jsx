import { createContext, useReducer, useState } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
    items: [],
    addItemToCart: () => { },
    updateCartItemQuantity: () => { },
});

function shoppingCartReducer(state, action) {
    if (action.type === "ADD_ITEM") {
        const updatedItems = [...state.items];
        const id = action.payload;

        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === id
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === id);
            updatedItems.push({
                id: id,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        return { ...state, items: updatedItems };
    }

    if (action.type === "UPDATE_ITEM") {
        const updatedItems = [...state.items];
        const { productId, amount } = action.payload;

        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === productId
        );

        if (updatedItemIndex >= 0) {
            const updatedItem = { ...updatedItems[updatedItemIndex] };
            updatedItem.quantity += amount;

            if (updatedItem.quantity <= 0) {
                updatedItems.splice(updatedItemIndex, 1);
            } else {
                updatedItems[updatedItemIndex] = updatedItem;
            }
        }

        return { ...state, items: updatedItems };
    }

    return state;
}

export default function CartContextProvider({ children }) {
    const [shoppingCartState, shoppingCartDispatch] = useReducer(
        shoppingCartReducer,
        { items: [] }
    );

    const [cartIsVisible, setCartIsVisible] = useState(false);

    function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: "ADD_ITEM",
            payload: id,
        });
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: "UPDATE_ITEM",
            payload: { productId, amount },
        });
    }

    function handleShowCart() {
        setCartIsVisible(true);
    }

    function handleHideCart() {
        setCartIsVisible(false);
    }

    const ctxValue = {
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        updateCartItemQuantity: handleUpdateCartItemQuantity,
        cartIsVisible, // ممكن تحتاجه
        showCart: handleShowCart,
        hideCart: handleHideCart,
    };

    return (
        <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
    );
}
