import { createStore } from 'vuex'
import {HairCut, HaircutCart, HairCutCollection, HairCutProduct} from "@/types/HaircutType";
import {User, UserLogResponse} from "@/types/UserType";

export default createStore({
  state: {
    //---------------- User ----------------²
    user: {},
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
    }
  },
  getters: {
    // All about haircuts
    beards: (state) => state.haircutsCollection.beards,
    hairs: (state) => state.haircutsCollection.hairs,
    massages: (state) => state.haircutsCollection.massages,
    hairCut_id: (state) => +state.hairCut_id,
    cart: (state) => state.cart,
    cartCount: (state) => state.cart.haircut_carts.length,
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
    setHaircutCart(state, cart: HaircutCart) {
        state.cart.haircut_carts.push({
          name: cart.name,
          description: cart.description,
          price: cart.price,
        });
    },
    // Mutations are used to set the state values
    initializeStore(state) {
      if (localStorage.getItem("user")) {
        state.user = JSON.parse(localStorage.getItem("user") || "{}");
      }
      if (localStorage.getItem("token")) {
        state.token = localStorage.getItem("token") || "";
      }
    },
  },
  actions: {

    // login action to set the user and the token
    login({ commit }, data: UserLogResponse) {
      commit("setUser", data.user);
      commit("setToken", data.token);
    },
    // logout action to clear the user and the token
    logout({ commit }) {
        commit("clearUser");
        commit("clearToken");
    },
    // haircuts actions
    haircutsCollection({ commit }, haircutsCollection: HairCutCollection) {
      commit("setBeards", haircutsCollection.beards);
      commit("setHairs", haircutsCollection.hairs);
      commit("setMassages", haircutsCollection.massages);
    },
    // cart actions
    addHaircutCart({ commit }, cart: HaircutCart) {
      commit("setHaircutCart", cart);
    }
  },
  modules: {
  }
})
