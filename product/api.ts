
import axios from "axios";
import Papa from "papaparse";
import { Product } from "./types";

export default {
  list: async (): Promise<Product[]> => {
    return axios
      .get('https://fakestoreapi.com/products')
      .then( (response) => {
        return response.data
      });
  },
};
