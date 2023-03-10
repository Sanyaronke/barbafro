import {createStore} from 'vuex'
import {HairCut, HaircutCart, HairCutCollection, HairCutProduct} from "@/types/HaircutType";
import {User, UserLogResponse} from "@/types/UserType";

export default createStore({
    state: {
        //---------------- User ----------------²
        user: {} as User,
        token: "" as string,
        //---------------- haircuts ----------------²
        haircutsCollection: {
            beards: [] as HairCut[],
            hairs: [] as HairCut[],
            massages: [] as HairCut[],
        } as HairCutCollection,
        hairCut_id: 0,
        cart: {
            haircut_carts: [] as HaircutCart[],
        },
        prices: {
            without_taxes: 0,
            taxes: 0,
            with_taxes: 0,
        }
    },
    getters: {

        // Get if the user is logged in or not
        isLoggedIn: (state) => !!state.token,
        // redirect to login page if the user is not logged in
        user_id: (state) => state.user.id,
        // All about haircuts
        beards: (state) => state.haircutsCollection.beards,
        hairs: (state) => state.haircutsCollection.hairs,
        massages: (state) => state.haircutsCollection.massages,
        hairCut_id: (state) => +state.hairCut_id,
        cart: (state) => state.cart,
        cartCount: (state) => state.cart.haircut_carts.length,
        hairCutCart: (state) => state.cart.haircut_carts,
        prices: (state) => state.prices
    },
    mutations: {
        // Mutations are used to set the state values
        setUser(state, user: User) {
            state.user = user;
            localStorage.setItem("user", JSON.stringify(user));
        },
        setToken(state, token: string) {
            state.token = token;
            localStorage.setItem("token", token);
            localStorage.setItem("token_type", "Bearer");
        },

        clearUser(state) {
            state.user = {} as User;
            localStorage.removeItem("user");
        },

        clearToken(state) {
            state.token = "" as string;
            localStorage.removeItem("token");
            localStorage.removeItem("token_type");
        },

        // haircuts mutations
        setBeards(state, beards: HairCut[]) {
            state.haircutsCollection.beards = beards;
        },
        setHairs(state, hairs: HairCut[]) {
            state.haircutsCollection.hairs = hairs;
        },
        setMassages(state, massages: HairCut[]) {
            state.haircutsCollection.massages = massages;
        },
        // cart mutations
        setHaircutCart(state, cart: HaircutCart[]) {
            state.cart.haircut_carts = cart;
            // calcul the prices of the cart without taxes  and with taxes 20%
            cart.forEach((item) => {
                item.price = item.price * item.reservations?.length;
                state.prices.with_taxes += item.price;
            });
            state.prices.taxes = state.prices.with_taxes * 0.2;
            state.prices.without_taxes = state.prices.with_taxes - state.prices.taxes;
            localStorage.setItem("haircutCart", JSON.stringify(cart));
            localStorage.setItem("prices", JSON.stringify(state.prices));
        },

        removeItemFromCart(state, index: number) {
            console.log("state.cart.haircut_carts", state.cart.haircut_carts);
            state.cart.haircut_carts.splice(index, 1);
            console.log("state.cart.haircu", state.cart.haircut_carts);
            state.prices.with_taxes = 0;
            state.prices.taxes = 0;
            state.prices.without_taxes = 0;
            state.cart.haircut_carts.forEach((item) => {
                item.price = item.price * item.reservations?.length;
                state.prices.with_taxes += item.price;
            });
            state.prices.taxes = state.prices.with_taxes * 0.2;
            state.prices.without_taxes = state.prices.with_taxes - state.prices.taxes;
            localStorage.setItem("haircutCart", JSON.stringify(state.cart.haircut_carts));
            localStorage.setItem("prices", JSON.stringify(state.prices));
        },
        // delete reservations in the item of the cart and update the cart in the local storage
        deleteReservations(state, data: { index: number, reservation_index: number }) {
            console.log("data", data);
            state.cart.haircut_carts[data.index].reservations?.splice(data.reservation_index, 1);
            state.prices.with_taxes = 0;
            state.prices.taxes = 0;
            state.prices.without_taxes = 0;
            state.cart.haircut_carts.forEach((item) => {
                item.price = item.price * item.reservations?.length;
                state.prices.with_taxes += item.price;
            });
            state.prices.taxes = state.prices.with_taxes * 0.2;
            state.prices.without_taxes = state.prices.with_taxes - state.prices.taxes;
            localStorage.setItem("haircutCart", JSON.stringify(state.cart.haircut_carts));
            localStorage.setItem("prices", JSON.stringify(state.prices));
        },

        // Mutations are used to set the state values
        initializeStore(state) {
            if (localStorage.getItem("user")) {
                state.user = JSON.parse(localStorage.getItem("user") || "{}");
            }
            if (localStorage.getItem("token")) {
                state.token = localStorage.getItem("token") || "";
            }
            if (localStorage.getItem("haircutCart")) {
                state.cart.haircut_carts = JSON.parse(localStorage.getItem("haircutCart") || "[]");
            }
            if (localStorage.getItem("prices")) {
                state.prices = JSON.parse(localStorage.getItem("prices") || "{}");
            }
        },
    },
    actions: {

        // login action to set the user and the token
        login({commit}, data: UserLogResponse) {
            console.log("data", data)
            commit("setUser", data.user);
            commit("setToken", data.token);
            commit("setHaircutCart", data.HaircutCart);
        },
        // logout action to clear the user and the token
        logout({commit}) {
            commit("clearUser");
            commit("clearToken");
        },
        // haircuts actions
        haircutsCollection({commit}, haircutsCollection: HairCutCollection) {
            commit("setBeards", haircutsCollection.beards);
            commit("setHairs", haircutsCollection.hairs);
            commit("setMassages", haircutsCollection.massages);
        },
        // cart actions
        addHaircutCart({commit}, cart: HaircutCart) {
            console.log("cart", cart)
            commit("setHaircutCart", cart);
        }
    },
    modules: {}
})
