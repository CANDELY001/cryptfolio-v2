import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cryptoNewsHeaders = {
  "X-RapidAPI-Key": "RapidAPI-Ke",
  "X-RapidAPI-Host": "RapidAPI-Host",
};

const createRequest = (url) => ({ url, headers: cryptoNewsHeaders });

export const cryptoNewsApi = createApi({
  reducerPath: "cryptoNewsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://google-news13.p.rapidapi.com",
  }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: ({ newsCategory }) =>
        createRequest(`/search/suggest?keyword=${newsCategory}&lr=en-US`),
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
